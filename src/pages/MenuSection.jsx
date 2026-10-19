import { Link, useParams } from 'react-router-dom'
import SteamRule from '../components/SteamRule.jsx'
import ProductCard from '../components/ProductCard.jsx'
import { getMenu, menuParent, categoriesOf, byMenu, byCategory } from '../data/menu.js'
import NotFound from './NotFound.jsx'

/**
 * One menu, in full.
 *
 * Everything is on the page at once, grouped by category, because these are
 * menus people scan rather than search — the category rail jumps, it does
 * not filter. Each category keeps its own anchor so the nav, the footer and
 * the landing page can link straight to it.
 *
 * Menus with a page of their own (Bowls, Packs & Boxes) pass `menuId`;
 * the rest come in through the /menu/:menuId route.
 */
export default function MenuSection({ menuId: fixedId }) {
  const params = useParams()
  const menu = getMenu(fixedId ?? params.menuId)

  if (!menu) return <NotFound />

  const parent = menuParent(menu.id)
  const cats = categoriesOf(menu.id)
  const total = byMenu(menu.id).length

  return (
    <>
      <section className="band band-deep" style={{ paddingBottom: '2rem' }}>
        <div className="wrap">
          <p className="crumb" style={{ color: 'rgba(255, 248, 232, 0.75)' }}>
            <Link to={parent.to}>{parent.label}</Link> / {menu.name}
          </p>
          <h1 style={{ color: 'var(--cream)' }}>{menu.name}</h1>
          <p style={{ fontSize: '1.1rem', maxWidth: '52ch' }}>{menu.blurb}</p>
          <p className="menu-minimum">{menu.minimum}</p>
        </div>
        <SteamRule color="var(--cream)" />
      </section>

      <section className="band band-cream" style={{ paddingTop: '2rem' }}>
        <div className="wrap">
          <div className="menu-layout">
            <nav className="catnav" aria-label={`${menu.name} categories`}>
              {cats.map((c) => (
                <a key={c.id} href={`#${c.id}`}>{c.name}</a>
              ))}
            </nav>

            <div>
              <p className="note" style={{ marginBottom: '1.5rem' }}>
                {total} {total === 1 ? 'dish' : 'dishes'} on this menu. {menu.minimum}.
              </p>

              {cats.map((c) => {
                const items = byCategory(c.id)
                if (items.length === 0) return null
                return (
                  <section key={c.id} id={c.id} className="menu-group">
                    <div className="head" style={{ marginBottom: '1.5rem' }}>
                      <h2 style={{ marginBottom: '0.25rem' }}>{c.name}</h2>
                      <p className="note" style={{ margin: 0 }}>{c.note}</p>
                    </div>
                    <div className="grid grid-3">
                      {items.map((p) => <ProductCard key={p.slug} product={p} />)}
                    </div>
                  </section>
                )
              })}
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
