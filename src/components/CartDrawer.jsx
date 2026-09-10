import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext.jsx'
import { naira } from '../data/menu.js'

export default function CartDrawer() {
  const { open, closeCart, lines, subtotal, setQty, remove } = useCart()

  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && closeCart()
    if (open) document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open, closeCart])

  if (!open) return null

  return (
    <>
      <div className="scrim" onClick={closeCart} />
      <aside className="drawer" role="dialog" aria-modal="true" aria-label="Your cart">
        <div className="drawer-head">
          <h3>Your cart</h3>
          <button className="x" onClick={closeCart} aria-label="Close cart">×</button>
        </div>

        <div className="drawer-body">
          {lines.length === 0 ? (
            <div className="empty">
              <p>Nothing in the cart yet.</p>
              <Link className="btn btn-green btn-sm" to="/menu" onClick={closeCart}>Browse the menu</Link>
            </div>
          ) : (
            lines.map((l) => (
              <div className="line" key={l.key}>
                <div className={`line-thumb tone-${l.tone}`} aria-hidden="true" />
                <div>
                  <strong>{l.name}</strong>
                  <small>
                    {[l.portionLabel, ...l.optionLabels].filter(Boolean).join(' · ')}
                  </small>
                  <div className="qty" style={{ marginTop: '0.5rem', transform: 'scale(0.85)', transformOrigin: 'left' }}>
                    <button onClick={() => setQty(l.key, l.qty - 1)} aria-label={`Reduce ${l.name}`}>−</button>
                    <span>{l.qty}</span>
                    <button onClick={() => setQty(l.key, l.qty + 1)} aria-label={`Add another ${l.name}`}>+</button>
                  </div>
                </div>
                <div className="line-price">
                  {naira(l.unitPrice * l.qty)}
                  <div>
                    <button className="remove" onClick={() => remove(l.key)}>Remove</button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {lines.length > 0 && (
          <div className="drawer-foot">
            <div className="summary-total" style={{ borderTop: 0, marginTop: 0, paddingTop: 0 }}>
              <span>Subtotal</span>
              <span className="price">{naira(subtotal)}</span>
            </div>
            <p className="note">Delivery is added at checkout once we have your area.</p>
            <Link className="btn btn-gold btn-block" to="/order" onClick={closeCart}>
              Check out
            </Link>
          </div>
        )}
      </aside>
    </>
  )
}
