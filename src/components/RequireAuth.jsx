import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

/** Wraps a route so only signed-in customers reach it. */
export default function RequireAuth({ children }) {
  const { user, ready } = useAuth()
  const location = useLocation()

  if (!ready) {
    return (
      <section className="band band-cream">
        <div className="wrap">
          <p className="note" role="status">Checking your account…</p>
        </div>
      </section>
    )
  }

  if (!user) {
    // Remember where they were headed so signing in returns them to it.
    return <Navigate to="/login" state={{ from: location.pathname }} replace />
  }

  return children
}
