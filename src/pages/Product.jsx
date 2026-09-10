import { useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import ProductCard from '../components/ProductCard.jsx'
import { getProduct, products, categoryName, naira } from '../data/menu.js'
import { useCart } from '../context/CartContext.jsx'
import NotFound from './NotFound.jsx'

export default function Product() {
  const { slug } = useParams()
  const product = getProduct(slug)
  const { add } = useCart()

  const [portionId, setPortionId] = useState(product?.portions[0]?.id)
  const [choices, setChoices] = useState(() =>
    Object.fromEntries((product?.options ?? []).map((o) => [o.id, o.choices[0].id]))
  )
  const [qty, setQty] = useState(1)
  const [notes, setNotes] = useState('')

  const related = useMemo(
    () => products.filter((p) => p.category === product?.category && p.slug !== slug).slice(0, 3),
    [product, slug]
  )

  if (!product) return <NotFound />

  const portion = product.portions.find((p) => p.id === portionId) ?? product.portions[0]
  const chosen = product.options.map((o) => o.choices.find((c) => c.id === choices[o.id]))
  const unitPrice = portion.price + chosen.reduce((n, c) => n + (c?.price ?? 0), 0)

  const addToCart = () => {
    add({
      key: `${product.slug}|${portion.id}|${Object.values(choices).join('-')}|${notes}`,
      slug: product.slug,
      name: product.name,
      portionLabel: portion.label,
      optionLabels: chosen.filter(Boolean).map((c) => c.label),
      notes,
      unitPrice,
      qty,
      tone: product.tone,
    })
  }

  return (
    <>
      <section className="band band-cream" style={{ paddingBottom: '3rem' }}>
        <div className="wrap">
          <p className="crumb">
            <Link to="/menu">Menu</Link> / <Link to={`/menu?category=${product.category}`}>{categoryName(product.category)}</Link> / {product.name}
          </p>

          <div className="pdp">
            <div className={`pdp-media tone-${product.tone}`}>
              <span>{product.name}</span>
            </div>

            <div>
              <h1 style={{ fontSize: 'clamp(2rem, 4.5vw, 3rem)' }}>{product.name}</h1>
              <p>{product.description}</p>

              {product.portions.length > 1 && (
                <div className="field">
                  <span className="field-label" id="portion-label">Portion</span>
                  <div className="choices" role="radiogroup" aria-labelledby="portion-label">
                    {product.portions.map((p) => (
                      <label key={p.id} className={`choice ${portionId === p.id ? 'on' : ''}`}>
                        <input
                          type="radio"
                          name="portion"
                          checked={portionId === p.id}
                          onChange={() => setPortionId(p.id)}
                        />
                        {p.label} · {naira(p.price)}
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {product.options.map((o) => (
                <div className="field" key={o.id}>
                  <span className="field-label" id={`opt-${o.id}`}>{o.label}</span>
                  <div className="choices" role="radiogroup" aria-labelledby={`opt-${o.id}`}>
                    {o.choices.map((c) => (
                      <label key={c.id} className={`choice ${choices[o.id] === c.id ? 'on' : ''}`}>
                        <input
                          type="radio"
                          name={o.id}
                          checked={choices[o.id] === c.id}
                          onChange={() => setChoices((s) => ({ ...s, [o.id]: c.id }))}
                        />
                        {c.label}
                        {c.price > 0 && ` · +${naira(c.price)}`}
                        {c.price < 0 && ` · ${naira(c.price)}`}
                      </label>
                    ))}
                  </div>
                </div>
              ))}

              <div className="field">
                <label htmlFor="notes" className="field-label">Order notes</label>
                <textarea
                  id="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Anything the kitchen should know — less pepper, no onions, pack separately."
                />
              </div>

              <div className="pdp-buy">
                <div className="qty">
                  <button onClick={() => setQty((q) => Math.max(1, q - 1))} aria-label="Reduce quantity">−</button>
                  <span aria-live="polite">{qty}</span>
                  <button onClick={() => setQty((q) => q + 1)} aria-label="Increase quantity">+</button>
                </div>
                <span className="total-line">{naira(unitPrice * qty)}</span>
                <button className="btn btn-gold" onClick={addToCart}>Add to cart</button>
              </div>
              <p className="note">Delivery is calculated at checkout once we have your area.</p>
            </div>
          </div>
        </div>
      </section>

      {related.length > 0 && (
        <section className="band band-white" style={{ paddingTop: '3rem' }}>
          <div className="wrap">
            <div className="head">
              <h2>Goes well with this</h2>
            </div>
            <div className="grid grid-3">
              {related.map((p) => <ProductCard key={p.slug} product={p} />)}
            </div>
          </div>
        </section>
      )}
    </>
  )
}
