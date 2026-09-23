import { useEffect, useRef, useState } from 'react'
import { NavLink, Link, useLocation } from 'react-router-dom'
import { useCart } from '../context/CartContext.jsx'
import { useAuth } from '../context/AuthContext.jsx'

// A link with `children` becomes a dropdown. `to` is still the parent's own
// page, so Catering stays reachable in one click for anyone who never opens
// the menu — and for search engines, which do not.
const links = [
  { to: '/', label: 'Home' },
  {
    to: '/menu',
    label: 'Meals Menu',
    children: [
      { to: '/menu/breakfast', label: 'Breakfast Menu' },
      { to: '/menu/bowls', label: 'Bowls Menu' },
      { to: '/menu/packs', label: 'Packs & Boxes' },
    ],
  },
  {
    to: '/catering',
    label: 'Catering',
    children: [
      { to: '/catering', label: 'Catering & large orders' },
      { to: '/catering/menu', label: 'Catering menu' },
    ],
  },
  { to: '/about', label: 'About' },
  { to: '/gallery', label: 'Gallery' },
  { to: '/contact', label: 'Contact' },
]

/**
 * One nav item that opens a submenu.
 *
 * Pointer users get it on hover; keyboard and touch users get it on click,
 * which is why the trigger is a real button with aria-expanded rather than a
 * CSS-only :hover menu. Escape closes it and returns focus to the trigger.
 */
function NavDropdown({ link, active }) {
  const [open, setOpen] = useState(false)
  const holder = useRef(null)
  const trigger = useRef(null)
  const closeTimer = useRef(null)

  // Closing on mouseleave the instant the pointer clears the trigger makes
  // the menu almost unusable: the path from the trigger down to an item
  // crosses a gap, and any diagonal drift leaves the element on the way.
  // The delay keeps it open long enough to get there, and re-entering
  // anywhere in the group cancels the close.
  const openNow = () => {
    clearTimeout(closeTimer.current)
    setOpen(true)
  }
  const closeSoon = () => {
    clearTimeout(closeTimer.current)
    closeTimer.current = setTimeout(() => setOpen(false), 420)
  }

  useEffect(() => () => clearTimeout(closeTimer.current), [])

  useEffect(() => {
    if (!open) return undefined
    const onDown = (event) => {
      if (!holder.current?.contains(event.target)) setOpen(false)
    }
    const onKey = (event) => {
      if (event.key !== 'Escape') return
      clearTimeout(closeTimer.current)
      setOpen(false)
      trigger.current?.focus()
    }
    document.addEventListener('mousedown', onDown)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDown)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  return (
    <div
      className="nav-drop"
      ref={holder}
      onMouseEnter={openNow}
      onMouseLeave={closeSoon}
      onFocus={openNow}
    >
      <button
        type="button"
        ref={trigger}
        className={`nav-drop-trigger ${active ? 'on' : ''}`}
        aria-expanded={open}
        onClick={() => {
          clearTimeout(closeTimer.current)
          setOpen((v) => !v)
        }}
      >
        {link.label}
        <svg width="10" height="7" viewBox="0 0 10 7" aria-hidden="true">
          <path d="M1 1.5L5 5.5L9 1.5" stroke="currentColor" strokeWidth="1.8" fill="none" strokeLinecap="round" />
        </svg>
      </button>

      <div className={`nav-drop-menu ${open ? 'open' : ''}`}>
        {link.children.map((c) => (
          <NavLink
            key={c.to}
            to={c.to}
            end
            className={({ isActive }) => (isActive ? 'on' : '')}
            onClick={() => {
              clearTimeout(closeTimer.current)
              setOpen(false)
            }}
          >
            {c.label}
          </NavLink>
        ))}
      </div>
    </div>
  )
}

export default function Header() {
  const [open, setOpen] = useState(false)
  const { count, openCart } = useCart()
  const { user } = useAuth()
  const location = useLocation()

  // A parent counts as current anywhere in its section — /catering/menu should
  // still light up Catering.
  const inSection = (to) => location.pathname === to || location.pathname.startsWith(`${to}/`)

  return (
    <header className="header">
      <div className="wrap header-in">
        <Link to="/" className="logo" onClick={() => setOpen(false)}>
          <span className="logo-chip">
            <img src="/logo.png" alt="Hothobs Cuisines" width="747" height="334" />
          </span>
        </Link>

        <nav className="nav" aria-label="Main">
          {links.map((l) =>
            l.children ? (
              <NavDropdown key={l.to} link={l} active={inSection(l.to)} />
            ) : (
              <NavLink key={l.to} to={l.to} end={l.to === '/'} className={({ isActive }) => (isActive ? 'on' : '')}>
                {l.label}
              </NavLink>
            )
          )}
        </nav>

        <div className="header-actions">
          {/* No "Sign in" here: the bar is tight once the nav has a dropdown
              in it, and signing in matters at checkout, which offers it —
              along with the burger menu and the footer. A signed-in customer
              still gets their name, because this is their way to /account. */}
          {user && (
            <Link className="account-link" to="/account">
              {user.name.split(' ')[0]}
            </Link>
          )}
          <button className="cart-btn" onClick={openCart} aria-label={`Open cart, ${count} items`}>
            Cart
            <span className="cart-count">{count}</span>
          </button>
          <Link to="/menu" className="btn btn-gold btn-sm">Order now</Link>
        </div>

        <button
          className="burger"
          aria-expanded={open}
          aria-label={open ? 'Close menu' : 'Open menu'}
          onClick={() => setOpen((v) => !v)}
        >
          <svg width="26" height="26" viewBox="0 0 26 26" aria-hidden="true">
            {open ? (
              <path d="M6 6l14 14M20 6L6 20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            ) : (
              <path d="M4 8h18M4 13h18M4 18h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            )}
          </svg>
        </button>
      </div>

      {/* On a phone the submenu is simply indented under its parent — a
          dropdown inside an already-open drawer is one tap too many. The
          child pointing at the parent's own page is dropped, since the
          parent link above it already goes there. */}
      <div className={`mobile-nav ${open ? 'open' : ''}`}>
        {links.map((l) => (
          <div key={l.to}>
            <Link
              to={l.to}
              onClick={() => setOpen(false)}
              style={{ color: location.pathname === l.to ? 'var(--warm-gold)' : undefined }}
            >
              {l.label}
            </Link>
            {l.children?.filter((c) => c.to !== l.to).map((c) => (
              <Link
                key={c.to}
                to={c.to}
                className="mobile-sub"
                onClick={() => setOpen(false)}
                style={{ color: location.pathname === c.to ? 'var(--warm-gold)' : undefined }}
              >
                {c.label}
              </Link>
            ))}
          </div>
        ))}
        <Link to={user ? '/account' : '/login'} onClick={() => setOpen(false)}>
          {user ? 'Your account' : 'Sign in'}
        </Link>
        <Link to="/menu" onClick={() => setOpen(false)} style={{ color: 'var(--warm-gold)', fontWeight: 700 }}>
          Order now
        </Link>
      </div>
    </header>
  )
}
