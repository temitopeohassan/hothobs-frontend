import { useState } from 'react'
import SteamRule from '../components/SteamRule.jsx'
import { cateringServices, occasions, gallery, contact } from '../data/site.js'
import { looksLikeEmail } from '../lib/email.js'

export default function Catering() {
  const [sent, setSent] = useState(false)
  const [form, setForm] = useState({
    name: '', phone: '', email: '', date: '', guests: '', occasion: '', details: '',
  })

  const set = (k) => (e) => setForm((s) => ({ ...s, [k]: e.target.value }))
  const enquiryReady = form.name && form.phone && looksLikeEmail(form.email)

  // TODO connect to Hothobs' preferred destination (email, CRM or WhatsApp handoff).
  const submit = () => setSent(true)

  return (
    <>
      <section className="band band-deep" style={{ paddingBottom: '2rem' }}>
        <div className="wrap">
          <h1 style={{ color: 'var(--cream)' }}>Catering and large orders</h1>
          <p style={{ fontSize: '1.1rem', maxWidth: '46ch' }}>
            Tell us the headcount, the date and where the food needs to be. We will come back with what
            we can cook and what it costs.
          </p>
        </div>
        <SteamRule color="var(--cream)" />
      </section>

      <section className="band band-cream" style={{ paddingTop: '2rem' }}>
        <div className="wrap">
          <div className="head">
            <h2>Occasions we serve</h2>
          </div>
          <div className="choices" style={{ marginBottom: '3rem' }}>
            {occasions.map((o) => (
              <span className="choice" key={o} style={{ cursor: 'default' }}>{o}</span>
            ))}
          </div>

          <div className="head">
            <h2>What we cater</h2>
          </div>
          <div className="info">
            {cateringServices.map((s) => (
              <div key={s.title}>
                <strong>{s.title}</strong>
                <p>{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="band band-white">
        <div className="wrap">
          <div className="head">
            <h2>From recent events</h2>
          </div>
          <div className="tiles">
            {gallery.items.filter((g) => g.category === 'Events' || g.category === 'Food').map((g) => (
              <div key={g.id} className={`tile tone-${g.tone}`}><span>{g.caption}</span></div>
            ))}
          </div>
        </div>
      </section>

      <section className="band band-cream">
        <div className="wrap" style={{ maxWidth: '760px' }}>
          <div className="head">
            <h2>Make a catering enquiry</h2>
            <p>We reply within one working day. For anything happening in the next 48 hours, call us instead.</p>
          </div>

          {sent ? (
            <div className="panel confirm">
              <div className="confirm-mark" aria-hidden="true">✓</div>
              <h3>Enquiry sent</h3>
              <p>
                Thank you, {form.name || 'friend'}. We have your details and will come back to you within one
                working day. If it is urgent, call {contact.phone}.
              </p>
              <button className="btn btn-outline-dark" onClick={() => { setSent(false); setForm({ name: '', phone: '', email: '', date: '', guests: '', occasion: '', details: '' }) }}>
                Send another enquiry
              </button>
            </div>
          ) : (
            <div className="panel">
              <div className="two">
                <div className="field" style={{ margin: 0 }}>
                  <label htmlFor="c-name" className="field-label">Your name</label>
                  <input id="c-name" type="text" value={form.name} onChange={set('name')} />
                </div>
                <div className="field" style={{ margin: 0 }}>
                  <label htmlFor="c-phone" className="field-label">Phone</label>
                  <input id="c-phone" type="tel" value={form.phone} onChange={set('phone')} />
                </div>
              </div>
              <div className="two" style={{ marginTop: '1rem' }}>
                <div className="field" style={{ margin: 0 }}>
                  <label htmlFor="c-email" className="field-label">Email</label>
                  <input id="c-email" type="email" value={form.email} onChange={set('email')} />
                </div>
                <div className="field" style={{ margin: 0 }}>
                  <label htmlFor="c-date" className="field-label">Date of the event</label>
                  <input id="c-date" type="text" placeholder="e.g. 14 December" value={form.date} onChange={set('date')} />
                </div>
              </div>
              <div className="two" style={{ marginTop: '1rem' }}>
                <div className="field" style={{ margin: 0 }}>
                  <label htmlFor="c-guests" className="field-label">How many people</label>
                  <input id="c-guests" type="text" value={form.guests} onChange={set('guests')} />
                </div>
                <div className="field" style={{ margin: 0 }}>
                  <label htmlFor="c-occasion" className="field-label">Occasion</label>
                  <select id="c-occasion" value={form.occasion} onChange={set('occasion')}>
                    <option value="">Choose one</option>
                    {occasions.map((o) => <option key={o}>{o}</option>)}
                    <option>Something else</option>
                  </select>
                </div>
              </div>
              <div className="field">
                <label htmlFor="c-details" className="field-label">What do you have in mind?</label>
                <textarea id="c-details" value={form.details} onChange={set('details')}
                  placeholder="Venue, serving time, dishes you already know you want." />
              </div>
              <button className="btn btn-gold" onClick={submit} disabled={!enquiryReady}>
                Send enquiry
              </button>
              {!enquiryReady && (
                <p className="note" style={{ marginTop: '0.75rem' }}>
                  Add your name, phone number and email address so we can reach you.
                </p>
              )}
            </div>
          )}
        </div>
      </section>
    </>
  )
}
