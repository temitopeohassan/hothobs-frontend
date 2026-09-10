import { Link } from 'react-router-dom'
import { naira } from '../data/menu.js'
import { useCart } from '../context/CartContext.jsx'

export default function ProductCard({ product }) {
  const { add } = useCart()
  const base = product.portions[0]
  const hasChoices = product.portions.length > 1 || product.options.length > 0

  const quickAdd = () =>
    add({
      key: `${product.slug}|${base.id}`,
      slug: product.slug,
      name: product.name,
      portionLabel: base.label,
      optionLabels: [],
      unitPrice: base.price,
      qty: 1,
      tone: product.tone,
    })

  return (
    <article className="card">
      <Link to={`/menu/${product.slug}`} className={`card-media tone-${product.tone}`}>
        <span>{product.name}</span>
      </Link>
      <h3>
        <Link to={`/menu/${product.slug}`}>{product.name}</Link>
      </h3>
      <p className="card-blurb">{product.blurb}</p>
      <div className="card-foot">
        <span className="price">
          {naira(base.price)}
          {product.portions.length > 1 && <small>{base.label} · more sizes</small>}
        </span>
        {hasChoices ? (
          <Link to={`/menu/${product.slug}`} className="btn btn-gold btn-sm">Choose</Link>
        ) : (
          <button className="btn btn-gold btn-sm" onClick={quickAdd}>Add to cart</button>
        )}
      </div>
    </article>
  )
}
