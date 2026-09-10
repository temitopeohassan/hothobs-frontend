import { useState } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

export default function Register() {
  const { user, ready, register } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from ?? '/account'

  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '' })
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
      await register(form)
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
            <h1 style={{ fontSize: 'clamp(2rem, 5vw, 2.8rem)' }}>Create your account</h1>
            <p>
              Save your details for faster checkout and keep every order you place with us in one
              place.
            </p>
          </div>

          <form className="panel" onSubmit={submit} noValidate>
            {message && <p className="form-error" role="alert">{message}</p>}

            <div className="field" style={{ marginTop: 0 }}>
              <label className="field-label" htmlFor="reg-name">Full name</label>
              <input
                id="reg-name"
                type="text"
                autoComplete="name"
                value={form.name}
                onChange={set('name')}
                aria-invalid={Boolean(errors.name)}
                aria-describedby={errors.name ? 'reg-name-error' : undefined}
              />
              {errors.name && <p className="field-error" id="reg-name-error">{errors.name}</p>}
            </div>

            <div className="field">
              <label className="field-label" htmlFor="reg-email">Email address</label>
              <input
                id="reg-email"
                type="email"
                autoComplete="email"
                value={form.email}
                onChange={set('email')}
                aria-invalid={Boolean(errors.email)}
                aria-describedby={errors.email ? 'reg-email-error' : undefined}
              />
              {errors.email && <p className="field-error" id="reg-email-error">{errors.email}</p>}
            </div>

            <div className="field">
              <label className="field-label" htmlFor="reg-phone">
                Phone <span className="field-hint">optional, but it helps us confirm orders faster</span>
              </label>
              <input
                id="reg-phone"
                type="tel"
                autoComplete="tel"
                value={form.phone}
                onChange={set('phone')}
                aria-invalid={Boolean(errors.phone)}
                aria-describedby={errors.phone ? 'reg-phone-error' : undefined}
              />
              {errors.phone && <p className="field-error" id="reg-phone-error">{errors.phone}</p>}
            </div>

            <div className="field">
              <label className="field-label" htmlFor="reg-password">Password</label>
              <input
                id="reg-password"
                type="password"
                autoComplete="new-password"
                value={form.password}
                onChange={set('password')}
                aria-invalid={Boolean(errors.password)}
                aria-describedby={errors.password ? 'reg-password-error' : 'reg-password-hint'}
              />
              {errors.password ? (
                <p className="field-error" id="reg-password-error">{errors.password}</p>
              ) : (
                <p className="note" id="reg-password-hint" style={{ marginTop: '0.5rem' }}>
                  At least 8 characters.
                </p>
              )}
            </div>

            <button className="btn btn-gold btn-block" type="submit" disabled={busy}>
              {busy ? 'Creating your account…' : 'Create account'}
            </button>
          </form>

          <p className="note auth-alt">
            Already have an account?{' '}
            <Link className="link-gold" to="/login" state={{ from }}>Sign in</Link>
          </p>
        </div>
      </div>
    </section>
  )
}
