import { useSearchParams } from 'react-router-dom'
import ProductCard from '../components/ProductCard.jsx'
import { categories, products } from '../data/menu.js'

export default function Menu() {
  const [params, setParams] = useSearchParams()
  const active = params.get('category') ?? 'all'

  const shown =
    active === 'all' ? products : products.filter((p) => p.category === active)
  const activeName = categories.find((c) => c.id === active)?.name

  const select = (id) => {
    if (id === 'all') setParams({})
    else setParams({ category: id })
  }

  return (
    <section className="band band-cream">
      <div className="wrap">
        <div className="head">
          <h1 style={{ fontSize: 'clamp(2.2rem, 5vw, 3.4rem)' }}>Our menu</h1>
          <p>
            Cooked daily in our Lagos kitchen. Pick a category, choose your portion, and add it to your
            cart — checkout takes a minute.
          </p>
        </div>

        <div className="menu-layout">
          <nav className="catnav" aria-label="Menu categories">
            <button className={active === 'all' ? 'on' : ''} onClick={() => select('all')}>
              Everything
            </button>
            {categories.map((c) => (
              <button key={c.id} className={active === c.id ? 'on' : ''} onClick={() => select(c.id)}>
                {c.name}
              </button>
            ))}
          </nav>

          <div>
            <p className="note" style={{ marginBottom: '1.25rem' }}>
              {shown.length} {shown.length === 1 ? 'dish' : 'dishes'}
              {activeName ? ` in ${activeName}` : ' on the menu'}
            </p>
            {shown.length === 0 ? (
              <div className="panel">
                <h3>Nothing in this category yet</h3>
                <p>We are still cooking. Try another category, or ask us what is available today.</p>
              </div>
            ) : (
              <div className="grid grid-3">
                {shown.map((p) => <ProductCard key={p.slug} product={p} />)}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
