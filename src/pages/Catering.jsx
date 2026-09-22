import { Link } from 'react-router-dom'
import SteamRule from '../components/SteamRule.jsx'
import { cateringServices, occasions, gallery, contact } from '../data/site.js'

/**
 * What we cater, and who we cater for.
 *
 * There is no enquiry form here on purpose: catering is enquired about in
 * one place, /catering/menu, where the form travels with the courses the
 * customer has chosen. Everything on this page leads there.
 */
export default function Catering() {
  return (
    <>
      <section className="band band-deep" style={{ paddingBottom: '2rem' }}>
        <div className="wrap">
          <h1 style={{ color: 'var(--cream)' }}>Catering and large orders</h1>
          <p style={{ fontSize: '1.1rem', maxWidth: '46ch' }}>
            Tell us the headcount, the date and where the food needs to be. We will come back with what
            we can cook and what it costs.
          </p>
          <p style={{ marginTop: '1.25rem' }}>
            <Link className="btn btn-gold" to="/catering/menu">See the catering menu</Link>
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
        <div className="wrap panel confirm">
          <h2 style={{ fontSize: '2rem' }}>Ready to talk about your event?</h2>
          <p>
            Build your spread on the catering menu — canapés, mini bowls, soups and the full
            Nigerian, Chinese and continental options — and send it to us with your date and
            headcount. We come back with a firm quote within one working day.
          </p>
          <div className="pdp-buy" style={{ justifyContent: 'center' }}>
            <Link className="btn btn-gold" to="/catering/menu">See the catering menu</Link>
            <a className="btn btn-outline-dark" href={`tel:${contact.phone.replace(/\s/g, '')}`}>
              Call {contact.phone}
            </a>
          </div>
          <p className="note" style={{ marginBottom: 0 }}>
            For anything happening in the next 48 hours, call us rather than sending an enquiry.
          </p>
        </div>
      </section>
    </>
  )
}
