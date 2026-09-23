import { Link } from 'react-router-dom'
import ProductCard from '../components/ProductCard.jsx'
import SteamRule from '../components/SteamRule.jsx'
import Hero from '../components/Hero.jsx'
import { menus, categories, featured, signature } from '../data/menu.js'
import { brand, contact, orderingInfo, testimonials, gallery } from '../data/site.js'

export default function Home() {
  const picks = featured()
  const favourites = signature()

  return (
    <>
      <Hero />

      <section className="band band-cream">
        <div className="wrap">
          <div className="head">
            <h2>Our popular picks</h2>
            <p>The dishes people come back for. Add one straight to your cart.</p>
          </div>
          <div className="grid grid-4">
            {picks.map((p) => <ProductCard key={p.slug} product={p} />)}
          </div>
        </div>
      </section>

      <section className="band band-white">
        <div className="wrap">
          <div className="head">
            <h2>Explore our menus</h2>
            <p>
              Three menus, priced three ways — per head for breakfast, by the litre and the tray
              for the bowls, by the pack for the boxes.
            </p>
          </div>
          {/* Grouped by menu rather than one flat list of categories: a
              category means little until you know which menu it is priced on. */}
          {menus.map((m) => (
            <div key={m.id} className="home-menu-group">
              <h3>
                <Link to={m.path}>{m.name}</Link> <span className="note">· {m.minimum}</span>
              </h3>
              <div className="cats">
                {categories
                  .filter((c) => c.menu === m.id)
                  .map((c) => (
                    <Link key={c.id} to={`${m.path}#${c.id}`} className="cat">
                      <strong>{c.name}</strong>
                      <span>{c.note}</span>
                    </Link>
                  ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <SteamRule color="var(--green)" flip />
      <section className="band band-green" style={{ paddingTop: '2rem' }}>
        <div className="wrap grid grid-2" style={{ alignItems: 'center' }}>
          <div>
            <h2>Made for good moments</h2>
            <p>
              Hothobs Cuisines cooks contemporary Nigerian food the long way — stock built from scratch,
              pepper ground fresh, pots watched until they are ready rather than until the clock says so.
            </p>
            <p>
              Whether it is a Tuesday lunch for one or a tray for forty, the food leaves our kitchen the
              way we would want it to arrive at our own table. From the pot to the table.
            </p>
            <Link className="btn btn-gold" to="/about" style={{ marginTop: '0.5rem' }}>Read our story</Link>
          </div>
          <div className="grid grid-2" style={{ gap: '0.85rem' }}>
            {gallery.items.slice(0, 4).map((g) => (
              <div key={g.id} className={`tile tone-${g.tone}`} aria-hidden="true" />
            ))}
          </div>
        </div>
      </section>

      <section className="band band-cream">
        <div className="wrap">
          <div className="head">
            <h2>Hothobs favorites</h2>
            <p>Dishes we are known for, cooked in quantity most days of the week.</p>
          </div>
          <div className="grid grid-4">
            {favourites.map((p) => <ProductCard key={p.slug} product={p} />)}
          </div>
        </div>
      </section>

      <section className="band band-white">
        <div className="wrap grid grid-2" style={{ alignItems: 'center' }}>
          <div>
            <h2>Feeding more than one?</h2>
            <p>
              We cook for events, offices and celebrations — planned around your headcount, your venue
              and the time the food actually needs to land.
            </p>
            <Link className="btn btn-green" to="/catering">Make a catering enquiry</Link>
          </div>
          <div className={`card-media tone-gold`} style={{ aspectRatio: '16/10' }}>
            <span>Trays, coolers and full service</span>
          </div>
        </div>
      </section>

      <section className="band band-deep">
        <div className="wrap">
          <div className="head">
            <h2>What our customers say</h2>
          </div>
          <div className="grid grid-3">
            {testimonials.map((t, i) => (
              <blockquote className="quote" key={i}>
                <p>{t.quote}</p>
                <footer>{t.name} — {t.detail}</footer>
              </blockquote>
            ))}
          </div>
        </div>
      </section>

      <section className="band band-cream">
        <div className="wrap">
          <div className="head">
            <h2>Follow Hothobs</h2>
            <p>
              What is on the fire, what is left, and what is coming this weekend — posted first on{' '}
              <a className="link-gold" href={brand.instagram} target="_blank" rel="noreferrer">Instagram</a>.
            </p>
          </div>
          <div className="tiles">
            {gallery.items.slice(0, 8).map((g) => (
              <a key={g.id} href={brand.instagram} target="_blank" rel="noreferrer" className={`tile tone-${g.tone}`}>
                <span>{g.caption}</span>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="band band-white">
        <div className="wrap">
          <div className="head">
            <h2>Ordering information</h2>
            <p>How to get food from our kitchen to your table.</p>
          </div>
          <div className="info">
            {orderingInfo.map((o) => (
              <div key={o.title}>
                <strong>{o.title}</strong>
                <p>{o.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <SteamRule color="var(--green)" flip />
      <section className="band band-green" style={{ paddingTop: '2rem', textAlign: 'center' }}>
        <div className="wrap">
          <h2>Hungry now?</h2>
          <p style={{ margin: '0 auto 1.75rem' }}>
            Order online, or call the kitchen on {contact.phone} and we will take it from there.
          </p>
          <div className="hero-cta" style={{ justifyContent: 'center' }}>
            <Link className="btn btn-gold" to="/menu">Order now</Link>
            <a className="btn btn-outline" href={`https://wa.me/${contact.whatsapp}`} target="_blank" rel="noreferrer">
              Message us on WhatsApp
            </a>
          </div>
        </div>
      </section>
    </>
  )
}
