import { useState } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

export default function Login() {
  const { user, ready, login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from ?? '/account'

  const [form, setForm] = useState({ email: '', password: '' })
  const [errors, setErrors] = useState({})
  const [message, setMessage] = useState('')
  const [busy, setBusy] = useState(false)

  const set = (key) => (event) => setForm((s) => ({ ...s, [key]: event.target.value }))

  if (ready && user) return <Navigate to={from} replace />

  const submit = async (event) => {
    event.preventDefault()
    setBusy(true)
    setErrors({})
    setMessage('')
    try {
      await login(form)
      navigate(from, { replace: true })
    } catch (error) {
      setErrors(error.fields ?? {})
      setMessage(error.message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <section className="band band-cream">
      <div className="wrap">
        <div className="auth-card">
          <div className="head" style={{ marginBottom: '1.5rem' }}>
            <h1 style={{ fontSize: 'clamp(2rem, 5vw, 2.8rem)' }}>Welcome back</h1>
            <p>Sign in to reorder your favourites and see everything you have ordered from us.</p>
          </div>

          <form className="panel" onSubmit={submit} noValidate>
            {message && (
              <p className="form-error" role="alert">{message}</p>
            )}

            <div className="field" style={{ marginTop: 0 }}>
              <label className="field-label" htmlFor="login-email">Email address</label>
              <input
                id="login-email"
                type="email"
                autoComplete="email"
                value={form.email}
                onChange={set('email')}
                aria-invalid={Boolean(errors.email)}
                aria-describedby={errors.email ? 'login-email-error' : undefined}
              />
              {errors.email && <p className="field-error" id="login-email-error">{errors.email}</p>}
            </div>

            <div className="field">
              <label className="field-label" htmlFor="login-password">Password</label>
              <input
                id="login-password"
                type="password"
                autoComplete="current-password"
                value={form.password}
                onChange={set('password')}
                aria-invalid={Boolean(errors.password)}
                aria-describedby={errors.password ? 'login-password-error' : undefined}
              />
              {errors.password && <p className="field-error" id="login-password-error">{errors.password}</p>}
            </div>

            <button className="btn btn-gold btn-block" type="submit" disabled={busy}>
              {busy ? 'Signing in…' : 'Sign in'}
            </button>
          </form>

          <p className="note auth-alt">
            New to Hothobs?{' '}
            <Link className="link-gold" to="/register" state={{ from }}>Create an account</Link>
          </p>
        </div>
      </div>
    </section>
  )
}
