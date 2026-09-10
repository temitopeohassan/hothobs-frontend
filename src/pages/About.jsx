import { Link } from 'react-router-dom'
import SteamRule from '../components/SteamRule.jsx'
import { gallery } from '../data/site.js'

const sections = [
  {
    title: 'Our approach to food',
    body: [
      'We cook Nigerian food as it is meant to be cooked, without shortcuts that show up on the plate. Stock is built from bones and time. Pepper is ground the morning it is used. Rice is cooked until the base catches, because that is where the flavour is.',
      'Nothing leaves the kitchen that we would not serve at our own table.',
    ],
  },
  {
    title: 'Quality and preparation',
    body: [
      'Produce is bought fresh and prepped daily, in quantities we can cook well rather than quantities that fill a fridge. Portions are weighed so the plate you get on Tuesday matches the one you got last month.',
      'Food is packed hot, sealed properly, and sent out in the order it was cooked.',
    ],
  },
  {
    title: 'Hospitality',
    body: [
      'Feeding people is the whole job. That means answering the phone, being straight about what is available, and getting food where it needs to be when it needs to be there.',
      'Hothobs Cuisines sits alongside Hothobs Culinary Academy — the same kitchen values, one cooking for you, one teaching the next set of cooks.',
    ],
  },
]

export default function About() {
  return (
    <>
      <section className="band band-deep" style={{ paddingBottom: '2rem' }}>
        <div className="wrap">
          <h1 style={{ color: 'var(--cream)' }}>From the pot to the table</h1>
          <p style={{ fontSize: '1.1rem', maxWidth: '48ch' }}>
            Hothobs Cuisines is a contemporary Nigerian food brand cooking for everyday dining, sharing
            and special occasions.
          </p>
        </div>
        <SteamRule color="var(--cream)" />
      </section>

      <section className="band band-cream" style={{ paddingTop: '2rem' }}>
        <div className="wrap grid grid-2" style={{ alignItems: 'center' }}>
          <div>
            <h2>Our story</h2>
            <p>
              Hothobs began with one pot and a short list of dishes cooked properly. Word moved the way it
              does with food — a plate shared at work, a tray at a family gathering — and the kitchen grew
              around the demand.
            </p>
            <p>
              Today we cook daily service, weekend specials and catering for events across Lagos, and the
              rule has not changed: cook it the way you would want it cooked for you.
            </p>
          </div>
          <div className="grid grid-2" style={{ gap: '0.85rem' }}>
            {gallery.items.slice(3, 7).map((g) => (
              <div key={g.id} className={`tile tone-${g.tone}`} aria-hidden="true" />
            ))}
          </div>
        </div>
      </section>

      {sections.map((s, i) => (
        <section key={s.title} className={`band ${i % 2 === 0 ? 'band-white' : 'band-cream'}`}>
          <div className="wrap">
            <h2>{s.title}</h2>
            {s.body.map((p, j) => <p key={j}>{p}</p>)}
          </div>
        </section>
      ))}

      <section className="band band-green" style={{ textAlign: 'center' }}>
        <div className="wrap">
          <h2>Come and eat</h2>
          <p style={{ margin: '0 auto 1.75rem' }}>The menu is open and the pots are on.</p>
          <Link className="btn btn-gold" to="/menu">Order now</Link>
        </div>
      </section>
    </>
  )
}
