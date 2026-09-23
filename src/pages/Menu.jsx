import { Link } from 'react-router-dom'
import SteamRule from '../components/SteamRule.jsx'
import { menus, byMenu, categoriesOf } from '../data/menu.js'

/**
 * The menu landing page: three menus, one card each.
 *
 * Hothobs publishes three separate menus and prices them differently, so
 * this page sends people to the right one rather than pretending they are
 * one long list. The nav dropdown does the same job in one click; this page
 * is for anyone who arrives at /menu from a link, a search result or the
 * "Order now" button.
 */
export default function Menu() {
  return (
    <>
      <section className="band band-deep" style={{ paddingBottom: '2rem' }}>
        <div className="wrap">
          <h1 style={{ color: 'var(--cream)' }}>Our menus</h1>
          <p style={{ fontSize: '1.1rem', maxWidth: '52ch' }}>
            Three menus, cooked to order in our Lagos kitchen. Breakfast is priced per head,
            the bowls and trays are sold by the litre, and the packs and boxes go out by the
            pack.
          </p>
        </div>
        <SteamRule color="var(--cream)" />
      </section>

      <section className="band band-cream" style={{ paddingTop: '2rem' }}>
        <div className="wrap">
          <div className="grid grid-3">
            {menus.map((m) => {
              const cats = categoriesOf(m.id)
              const count = byMenu(m.id).length
              return (
                <article className="panel" key={m.id}>
                  <h2 style={{ fontSize: '1.6rem', marginTop: 0 }}>
                    <Link to={m.path}>{m.name}</Link>
                  </h2>
                  <p className="card-blurb">{m.blurb}</p>
                  <p className="note" style={{ marginBottom: '0.75rem' }}>
                    {count} {count === 1 ? 'dish' : 'dishes'} · {m.minimum}
                  </p>
                  <ul className="menu-card-list">
                    {cats.map((c) => (
                      <li key={c.id}>
                        <Link to={`${m.path}#${c.id}`}>{c.name}</Link>
                      </li>
                    ))}
                  </ul>
                  <p style={{ marginTop: '1.25rem', marginBottom: 0 }}>
                    <Link className="btn btn-gold btn-sm" to={m.path}>See the {m.name.toLowerCase()}</Link>
                  </p>
                </article>
              )
            })}
          </div>
        </div>
      </section>

      <section className="band band-green" style={{ textAlign: 'center' }}>
        <div className="wrap">
          <h2>Catering an event instead?</h2>
          <p style={{ margin: '0 auto 1.75rem', maxWidth: '46ch' }}>
            Weddings, offices and Sunday gatherings are quoted from the catering menu.
          </p>
          <Link className="btn btn-gold" to="/catering/menu">See the catering menu</Link>
        </div>
      </section>
    </>
  )
}
