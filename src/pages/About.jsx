import { Link } from 'react-router-dom'
import SteamRule from '../components/SteamRule.jsx'
import { gallery } from '../data/site.js'

/**
 * Who Hothobs is, in the brand's own words.
 *
 * The copy here comes from the About Us document supplied by Hothobs
 * (pdfs/AboutHothobs.pdf), with one addition confirmed separately by them:
 * the Culinary Academy, which the document does not mention. Nothing else
 * is invented — a claim Hothobs has not confirmed does not belong here.
 */

// "Our menu cuts across borders." The list is illustrative, not exhaustive,
// which is why it ends open.
const cuisines = ['Nigerian', 'French', 'Italian', 'Chinese', 'And more from around the world']

// The four things the brand says great cuisine is about, beyond hunger.
const values = [
  {
    title: 'Flavour',
    body: 'The first thing we get right and the last thing we compromise on.',
  },
  {
    title: 'Presentation',
    body: 'Food that is worth looking at before anyone picks up a fork.',
  },
  {
    title: 'Creativity',
    body: 'Different flavours, techniques and ingredients, explored rather than repeated.',
  },
  {
    title: 'Experience',
    body: 'Everything that comes with every bite, not just what is on the plate.',
  },
]

export default function About() {
  return (
    <>
      <section className="band band-deep" style={{ paddingBottom: '2rem' }}>
        <div className="wrap">
          <h1 style={{ color: 'var(--cream)' }}>About us</h1>
          <p style={{ fontSize: '1.1rem', maxWidth: '52ch' }}>
            Hothobs Cuisines is a culinary brand passionate about creating exceptional food inspired by
            the richness and diversity of global cuisine.
          </p>
        </div>
        <SteamRule color="var(--cream)" />
      </section>

      <section className="band band-cream" style={{ paddingTop: '2rem' }}>
        <div className="wrap grid grid-2" style={{ alignItems: 'center' }}>
          <div>
            <h2>A menu that cuts across borders</h2>
            <p>
              Our menu cuts across borders — from Nigerian, French, Italian, Chinese, and other cuisines
              from around the world.
            </p>
            <p style={{ fontSize: '1.15rem', fontWeight: 600 }}>You think it, we create it!</p>
            <div className="choices" style={{ marginTop: '1.25rem' }}>
              {cuisines.map((c) => (
                <span className="choice" key={c} style={{ cursor: 'default' }}>{c}</span>
              ))}
            </div>
          </div>
          <div className="grid grid-2" style={{ gap: '0.85rem' }}>
            {gallery.items.slice(3, 7).map((g) => (
              <div key={g.id} className={`tile tone-${g.tone}`} aria-hidden="true" />
            ))}
          </div>
        </div>
      </section>

      <section className="band band-white">
        <div className="wrap">
          <div className="head">
            <h2>More than satisfying hunger</h2>
            <p>
              We believe great cuisine is about more than simply satisfying hunger. It is about flavour,
              presentation, creativity, and the experience that comes with every bite.
            </p>
          </div>
          <div className="info">
            {values.map((v) => (
              <div key={v.title}>
                <strong>{v.title}</strong>
                <p>{v.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="band band-cream">
        <div className="wrap">
          <div className="head" style={{ marginBottom: 0 }}>
            <h2>Familiar yet exciting</h2>
            <p>
              At Hothobs Cuisines, we continually explore different flavours, techniques, and ingredients
              to create dishes that feel familiar yet exciting, traditional yet innovative.
            </p>
          </div>
        </div>
      </section>

     <section className="band band-green" style={{ textAlign: 'center' }}>
        <div className="wrap">
          <h2>Food, beautifully prepared</h2>
          <p style={{ margin: '0 auto 1.75rem', maxWidth: '44ch' }}>
            We create food for people who appreciate good cuisine, beautifully prepared.
          </p>
          <Link className="btn btn-gold" to="/menu">Order now</Link>
        </div>
      </section>
    </>
  )
}
