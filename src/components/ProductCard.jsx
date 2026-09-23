import { Link } from 'react-router-dom'
import { naira, fromPortion, needsChoosing, minQtyOf, unitNounOf } from '../data/menu.js'
import { useCart } from '../context/CartContext.jsx'

/**
 * One dish on a menu page.
 *
 * Everything here is bought and paid for online. The only question the card
 * answers is whether it can be added in one tap: a dish with a single size,
 * no options, nothing to read and no order minimum can be. Anything else —
 * a pack with contents, a spread priced per head, a dish sold in four sizes
 * — sends the customer to the product page to settle it there.
 */
export default function ProductCard({ product }) {
  const { add } = useCart()

  const base = fromPortion(product)
  const choose = needsChoosing(product)
  const min = minQtyOf(product)

  const quickAdd = () =>
    add({
      key: `${product.slug}|${base.id}`,
      slug: product.slug,
      name: product.name,
      // The server prices the order from these ids — see the backend's
      // src/lib/catalogue.js. unitPrice below is only what we show.
      portionId: base.id,
      options: {},
      portionLabel: base.label,
      optionLabels: [],
      unitPrice: base.price,
      qty: 1,
      tone: product.tone,
    })

  return (
    <article className="card">
      <Link to={`/menu/${product.menu}/${product.slug}`} className={`card-media tone-${product.tone}`}>
        <span>{product.name}</span>
      </Link>
      <h3>
        <Link to={`/menu/${product.menu}/${product.slug}`}>{product.name}</Link>
      </h3>
      <p className="card-blurb">{product.blurb}</p>
      <div className="card-foot">
        <span className="price">
          {naira(base.price)}
          {product.portions.length > 1 ? (
            <small>{base.label} · more sizes</small>
          ) : (
            <small>
              {base.label}
              {min > 1 && ` · min ${min} ${unitNounOf(product)}`}
            </small>
          )}
        </span>
        {choose ? (
          <Link to={`/menu/${product.menu}/${product.slug}`} className="btn btn-gold btn-sm">
            Choose
          </Link>
        ) : (
          <button className="btn btn-gold btn-sm" onClick={quickAdd}>Add to cart</button>
        )}
      </div>
    </article>
  )
}
