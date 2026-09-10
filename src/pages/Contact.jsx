import { useState } from 'react'
import { contact, openingHours, brand } from '../data/site.js'
import { looksLikeEmail } from '../lib/email.js'

export default function Contact() {
  const [sent, setSent] = useState(false)
  const [form, setForm] = useState({ name: '', phone: '', email: '', message: '' })
  const set = (k) => (e) => setForm((s) => ({ ...s, [k]: e.target.value }))
  const contactReady = form.name && looksLikeEmail(form.email) && form.message

  return (
    <section className="band band-cream">
      <div className="wrap">
        <div className="head">
          <h1 style={{ fontSize: 'clamp(2.2rem, 5vw, 3.4rem)' }}>Talk to the kitchen</h1>
          <p>Call, message or write. For orders going out today, phone or WhatsApp is fastest.</p>
        </div>

        <div className="checkout">
          <div>
            {sent ? (
              <div className="panel confirm">
                <div className="confirm-mark" aria-hidden="true">✓</div>
                <h3>Message sent</h3>
                <p>We have it, and we will reply within one working day.</p>
                <button className="btn btn-outline-dark" onClick={() => setSent(false)}>Write another message</button>
              </div>
            ) : (
              <div className="panel">
                <h3>Send a message</h3>
                <div className="two">
                  <div className="field" style={{ margin: 0 }}>
                    <label htmlFor="n" className="field-label">Your name</label>
                    <input id="n" type="text" value={form.name} onChange={set('name')} />
                  </div>
                  <div className="field" style={{ margin: 0 }}>
                    <label htmlFor="p" className="field-label">Phone</label>
                    <input id="p" type="tel" value={form.phone} onChange={set('phone')} />
                  </div>
                </div>
                <div className="field">
                  <label htmlFor="e" className="field-label">Email</label>
                  <input id="e" type="email" value={form.email} onChange={set('email')} />
                </div>
                <div className="field">
                  <label htmlFor="m" className="field-label">Message</label>
                  <textarea id="m" value={form.message} onChange={set('message')} />
                </div>
                {/* TODO connect to Hothobs' preferred inbox or form handler. */}
                <button className="btn btn-gold" onClick={() => setSent(true)} disabled={!contactReady}>
                  Send message
                </button>
                {!contactReady && (
                  <p className="note" style={{ marginTop: '0.75rem' }}>
                    Add your name, email address and a message so we can reply.
                  </p>
                )}
              </div>
            )}
          </div>

          <div>
            <div className="panel">
              <h3>Reach us directly</h3>
              <div className="info" style={{ gridTemplateColumns: '1fr', gap: '1.25rem' }}>
                <div>
                  <strong>Phone</strong>
                  <p><a className="link-gold" href={`tel:${contact.phone.replace(/\s/g, '')}`}>{contact.phone}</a></p>
                </div>
                <div>
                  <strong>WhatsApp</strong>
                  <p><a className="link-gold" href={`https://wa.me/${contact.whatsapp}`} target="_blank" rel="noreferrer">Message the kitchen</a></p>
                </div>
                <div>
                  <strong>Email</strong>
                  <p><a className="link-gold" href={`mailto:${contact.email}`}>{contact.email}</a></p>
                </div>
                <div>
                  <strong>Instagram</strong>
                  <p><a className="link-gold" href={brand.instagram} target="_blank" rel="noreferrer">@hothobscuisines</a></p>
                </div>
                <div>
                  <strong>Facebook</strong>
                  <p><a className="link-gold" href={brand.facebook} target="_blank" rel="noreferrer">Hothobs Cuisines</a></p>
                </div>
                <div>
                  <strong>Where we are</strong>
                  <p>{contact.address}</p>
                </div>
              </div>
            </div>

            <div className="panel">
              <h3>Opening hours</h3>
              {openingHours.map((h) => (
                <div className="summary-row" key={h.days}>
                  <span>{h.days}</span>
                  <strong>{h.hours}</strong>
                </div>
              ))}
            </div>

            <div className="panel" style={{ padding: 0, overflow: 'hidden' }}>
              <iframe
                title="Map to Hothobs Cuisines"
                width="100%"
                height="280"
                style={{ border: 0, display: 'block' }}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                src={`https://maps.google.com/maps?q=${encodeURIComponent(contact.mapQuery)}&output=embed`}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
