import { Link, useLocation } from 'react-router-dom'
import { useCart } from '../context/CartContext.jsx'
import { naira } from '../data/menu.js'

export default function OrderBar() {
  const { count, subtotal, openCart } = useCart()
  const { pathname } = useLocation()
  if (pathname === '/order') return null

  return (
    <div className="orderbar">
      {count > 0 ? (
        <button className="btn btn-gold" onClick={openCart}>
          View cart · {naira(subtotal)}
        </button>
      ) : (
        <Link className="btn btn-gold" to="/menu">Order now</Link>
      )}
      <Link className="btn btn-outline" to="/catering">Catering</Link>
    </div>
  )
}
