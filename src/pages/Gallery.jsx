import { useState } from 'react'
import { Link } from 'react-router-dom'
import { gallery, brand } from '../data/site.js'

export default function Gallery() {
  const [filter, setFilter] = useState('All')
  const filters = ['All', ...gallery.categories]
  const items = filter === 'All' ? gallery.items : gallery.items.filter((g) => g.category === filter)

  return (
    <section className="band band-cream">
      <div className="wrap">
        <div className="head">
          <h1 style={{ fontSize: 'clamp(2.2rem, 5vw, 3.4rem)' }}>Gallery</h1>
          <p>Food, events and the kitchen behind them. More of this daily on <a className="link-gold" href={brand.instagram} target="_blank" rel="noreferrer">Instagram</a>.</p>
        </div>

        <div className="filters" role="group" aria-label="Filter gallery">
          {filters.map((f) => (
            <button
              key={f}
              className={`btn btn-sm ${filter === f ? 'btn-green' : 'btn-outline-dark'}`}
              onClick={() => setFilter(f)}
              aria-pressed={filter === f}
            >
              {f}
            </button>
          ))}
        </div>

        {items.length === 0 ? (
          <div className="panel">
            <h3>Nothing here yet</h3>
            <p>We have not added photos to this set. Try another one.</p>
          </div>
        ) : (
          <div className="tiles">
            {items.map((g) => (
              <figure key={g.id} className={`tile tone-${g.tone}`} style={{ margin: 0 }}>
                <figcaption><span>{g.caption}</span></figcaption>
              </figure>
            ))}
          </div>
        )}

        <p style={{ marginTop: '2.5rem' }}>
          <Link className="btn btn-gold" to="/menu">Order what you see</Link>
        </p>
      </div>
    </section>
  )
}
