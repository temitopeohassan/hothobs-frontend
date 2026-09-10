import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <section className="band band-cream">
      <div className="wrap" style={{ maxWidth: '38rem' }}>
        <h1>This page is off the menu</h1>
        <p>The link you followed does not lead anywhere on this site. The menu is a good place to start again.</p>
        <Link className="btn btn-gold" to="/menu">Go to the menu</Link>
      </div>
    </section>
  )
}
