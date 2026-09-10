import { useState } from 'react'
import { NavLink, Link, useLocation } from 'react-router-dom'
import { useCart } from '../context/CartContext.jsx'
import { useAuth } from '../context/AuthContext.jsx'

const links = [
  { to: '/', label: 'Home' },
  { to: '/menu', label: 'Menu' },
  { to: '/catering', label: 'Catering' },
  { to: '/about', label: 'About' },
  { to: '/gallery', label: 'Gallery' },
  { to: '/contact', label: 'Contact' },
]

export default function Header() {
  const [open, setOpen] = useState(false)
  const { count, openCart } = useCart()
  const { user } = useAuth()
  const location = useLocation()

  return (
    <header className="header">
      <div className="wrap header-in">
        <Link to="/" className="logo" onClick={() => setOpen(false)}>
          <span className="logo-chip">
            <img src="/logo.png" alt="Hothobs Cuisines" width="747" height="334" />
          </span>
        </Link>

        <nav className="nav" aria-label="Main">
          {links.map((l) => (
            <NavLink key={l.to} to={l.to} end={l.to === '/'} className={({ isActive }) => (isActive ? 'on' : '')}>
              {l.label}
            </NavLink>
          ))}
        </nav>

        <div className="header-actions">
          <Link className="account-link" to={user ? '/account' : '/login'}>
            {user ? user.name.split(' ')[0] : 'Sign in'}
          </Link>
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

      <div className={`mobile-nav ${open ? 'open' : ''}`}>
        {links.map((l) => (
          <Link key={l.to} to={l.to} onClick={() => setOpen(false)} style={{ color: location.pathname === l.to ? 'var(--warm-gold)' : undefined }}>
            {l.label}
          </Link>
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
