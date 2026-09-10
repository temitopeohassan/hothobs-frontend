import { Link } from 'react-router-dom'
import { brand, contact, openingHours } from '../data/site.js'
import { categories } from '../data/menu.js'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="wrap">
        <div className="footer-grid">
          <div>
            <h4>
              <span className="logo-chip logo-chip-sm">
                <img src="/logo.png" alt="Hothobs Cuisines" width="747" height="334" />
              </span>
            </h4>
            <p style={{ fontSize: '0.95rem' }}>{brand.concept}</p>
            <p style={{ fontSize: '0.95rem' }}>
              <a href={brand.instagram} target="_blank" rel="noreferrer" className="link-gold" style={{ color: 'var(--warm-gold)' }}>
                Follow us on Instagram
              </a>
            </p>
            <p style={{ fontSize: '0.95rem' }}>
              <a href={brand.facebook} target="_blank" rel="noreferrer" className="link-gold" style={{ color: 'var(--warm-gold)' }}>
                Find us on Facebook
              </a>
            </p>
          </div>

          <div>
            <h4>Menu</h4>
            <ul>
              {categories.slice(0, 6).map((c) => (
                <li key={c.id}><Link to={`/menu?category=${c.id}`}>{c.name}</Link></li>
              ))}
            </ul>
          </div>

          <div>
            <h4>Hothobs</h4>
            <ul>
              <li><Link to="/about">About us</Link></li>
              <li><Link to="/catering">Catering</Link></li>
              <li><Link to="/gallery">Gallery</Link></li>
              <li><Link to="/contact">Contact</Link></li>
              <li><Link to="/order">Order</Link></li>
            </ul>
          </div>

          <div>
            <h4>Reach us</h4>
            <ul>
              <li><a href={`tel:${contact.phone.replace(/\s/g, '')}`}>{contact.phone}</a></li>
              <li><a href={`https://wa.me/${contact.whatsapp}`} target="_blank" rel="noreferrer">WhatsApp</a></li>
              <li><a href={`mailto:${contact.email}`}>{contact.email}</a></li>
              <li>{contact.address}</li>
            </ul>
            <ul style={{ marginTop: '0.75rem' }}>
              {openingHours.map((h) => (
                <li key={h.days}>{h.days}: {h.hours}</li>
              ))}
            </ul>
          </div>
        </div>

        <div className="footer-base">
          <span>© {new Date().getFullYear()} Hothobs Cuisines. Part of the Hothobs family.</span>
          <span>Good food. Good moments.</span>
        </div>
      </div>
    </footer>
  )
}
