import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { useCart } from '../context/CartContext.jsx'
import { api } from '../lib/api.js'
import { naira } from '../data/menu.js'

/** SQLite stores timestamps as UTC 'YYYY-MM-DD HH:MM:SS' with no zone marker. */
const placedOn = (value) => {
  const date = new Date(`${value.replace(' ', 'T')}Z`)
  if (Number.isNaN(date.getTime())) return value
  return date.toLocaleDateString(undefined, {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

const statusLabels = {
  placed: 'Placed — we will call to confirm',
  confirmed: 'Confirmed',
  cooking: 'In the kitchen',
  ready: 'Ready',
  out: 'Out for delivery',
  completed: 'Completed',
  cancelled: 'Cancelled',
}

function OrderCard({ order, onReorder }) {
  const [open, setOpen] = useState(false)
  const itemCount = order.items.reduce((n, i) => n + i.qty, 0)

  return (
    <div className="panel order-card">
      <div className="order-head">
        <div>
          <strong className="order-ref">{order.reference}</strong>
          <p className="note" style={{ margin: '0.15rem 0 0' }}>
            {placedOn(order.placedAt)} · {itemCount} item{itemCount === 1 ? '' : 's'} ·{' '}
            {order.fulfilment === 'pickup' ? 'Pickup' : order.zone.label}
          </p>
        </div>
        <div className="order-head-right">
          <span className="price">{naira(order.total)}</span>
          <span className={`badge badge-${order.status}`}>
            {statusLabels[order.status] ?? order.status}
          </span>
        </div>
      </div>

      <div className="order-actions">
        <button className="btn btn-outline-dark btn-sm" onClick={() => setOpen((v) => !v)} aria-expanded={open}>
          {open ? 'Hide details' : 'View details'}
        </button>
        <button className="btn btn-gold btn-sm" onClick={() => onReorder(order)}>
          Order this again
        </button>
      </div>

      {open && (
        <div className="order-detail">
          {order.items.map((item, index) => (
            <div className="line" key={`${item.slug}-${index}`}>
              <div className={`line-thumb tone-${item.tone}`} aria-hidden="true" />
              <div>
                <strong>{item.name}</strong>
                <small>
                  {[item.portionLabel, ...item.optionLabels].filter(Boolean).join(' · ') || '—'}
                </small>
                {item.notes && <small style={{ display: 'block' }}>Note: {item.notes}</small>}
                <small style={{ display: 'block' }}>Quantity: {item.qty}</small>
              </div>
              <div className="line-price">{naira(item.unitPrice * item.qty)}</div>
            </div>
          ))}

          <div className="summary-row" style={{ marginTop: '1rem' }}>
            <span>Subtotal</span>
            <span>{naira(order.subtotal)}</span>
          </div>
          <div className="summary-row">
            <span>{order.fulfilment === 'pickup' ? 'Pickup' : 'Delivery'}</span>
            <span>{order.deliveryFee === null ? 'Quoted on the call' : naira(order.deliveryFee)}</span>
          </div>
          <div className="summary-total">
            <span>Total</span>
            <span className="price">{naira(order.total)}</span>
          </div>

          <div className="info" style={{ marginTop: '1.5rem' }}>
            {order.address && (
              <div>
                <strong>Delivered to</strong>
                <p className="note">{order.address}</p>
              </div>
            )}
            {order.wantedFor && (
              <div>
                <strong>Wanted for</strong>
                <p className="note">{order.wantedFor}</p>
              </div>
            )}
            <div>
              <strong>Payment</strong>
              <p className="note">
                {order.paymentMethod === 'transfer' ? 'Bank transfer on confirmation' : 'Pay on delivery or pickup'}
              </p>
            </div>
            {order.notes && (
              <div>
                <strong>Your notes</strong>
                <p className="note">{order.notes}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

function OrderHistory() {
  const { add } = useCart()
  const [orders, setOrders] = useState([])
  const [state, setState] = useState('loading')
  const [error, setError] = useState('')

  useEffect(() => {
    const controller = new AbortController()

    api
      .get('/orders', { signal: controller.signal })
      .then((data) => {
        setOrders(data.orders)
        setState('ready')
      })
      .catch((err) => {
        if (err?.name === 'AbortError') return
        setError(err.message)
        setState('error')
      })

    return () => controller.abort()
  }, [])

  const reorder = (order) => {
    for (const item of order.items) {
      add({
        key: `${item.slug}|${item.portionLabel ?? ''}|${item.optionLabels.join('-')}|${item.notes ?? ''}`,
        slug: item.slug,
        name: item.name,
        portionLabel: item.portionLabel ?? '',
        optionLabels: item.optionLabels,
        notes: item.notes ?? '',
        unitPrice: item.unitPrice,
        qty: item.qty,
        tone: item.tone,
      })
    }
  }

  if (state === 'loading') return <p className="note" role="status">Loading your orders…</p>

  if (state === 'error') {
    return <p className="form-error" role="alert">{error}</p>
  }

  if (orders.length === 0) {
    return (
      <div className="panel empty">
        <h3>No orders yet</h3>
        <p className="note">
          Once you place an order it will appear here, with everything you chose and what it cost.
        </p>
        <Link className="btn btn-gold" to="/menu" style={{ marginTop: '0.5rem' }}>
          Browse the menu
        </Link>
      </div>
    )
  }

  return (
    <div className="order-list">
      {orders.map((order) => (
        <OrderCard key={order.reference} order={order} onReorder={reorder} />
      ))}
    </div>
  )
}

function ProfileForm() {
  const { user, updateProfile } = useAuth()
  const [form, setForm] = useState({ name: user.name, phone: user.phone })
  const [errors, setErrors] = useState({})
  const [message, setMessage] = useState('')
  const [saved, setSaved] = useState(false)
  const [busy, setBusy] = useState(false)

  const set = (key) => (event) => {
    setSaved(false)
    setForm((s) => ({ ...s, [key]: event.target.value }))
  }

  const submit = async (event) => {
    event.preventDefault()
    setBusy(true)
    setErrors({})
    setMessage('')
    try {
      await updateProfile(form)
      setSaved(true)
    } catch (error) {
      setErrors(error.fields ?? {})
      setMessage(error.message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <form className="panel" onSubmit={submit} noValidate>
      <h3>Your details</h3>
      {message && <p className="form-error" role="alert">{message}</p>}
      {saved && <p className="form-ok" role="status">Saved.</p>}

      <div className="field">
        <label className="field-label" htmlFor="acc-name">Full name</label>
        <input
          id="acc-name"
          type="text"
          autoComplete="name"
          value={form.name}
          onChange={set('name')}
          aria-invalid={Boolean(errors.name)}
        />
        {errors.name && <p className="field-error">{errors.name}</p>}
      </div>

      <div className="field">
        <label className="field-label" htmlFor="acc-phone">Phone</label>
        <input
          id="acc-phone"
          type="tel"
          autoComplete="tel"
          value={form.phone}
          onChange={set('phone')}
          aria-invalid={Boolean(errors.phone)}
        />
        {errors.phone && <p className="field-error">{errors.phone}</p>}
      </div>

      <p className="note">
        Email address: <strong>{user.email}</strong> — call us on the number on our contact page if
        you need this changed.
      </p>

      <button className="btn btn-outline-dark" type="submit" disabled={busy}>
        {busy ? 'Saving…' : 'Save details'}
      </button>
    </form>
  )
}

function PasswordForm() {
  const { changePassword } = useAuth()
  const [form, setForm] = useState({ currentPassword: '', newPassword: '' })
  const [errors, setErrors] = useState({})
  const [message, setMessage] = useState('')
  const [saved, setSaved] = useState(false)
  const [busy, setBusy] = useState(false)

  const set = (key) => (event) => {
    setSaved(false)
    setForm((s) => ({ ...s, [key]: event.target.value }))
  }

  const submit = async (event) => {
    event.preventDefault()
    setBusy(true)
    setErrors({})
    setMessage('')
    try {
      await changePassword(form)
      setForm({ currentPassword: '', newPassword: '' })
      setSaved(true)
    } catch (error) {
      setErrors(error.fields ?? {})
      setMessage(error.message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <form className="panel" onSubmit={submit} noValidate>
      <h3>Password</h3>
      {message && <p className="form-error" role="alert">{message}</p>}
      {saved && <p className="form-ok" role="status">Your password has been changed.</p>}

      <div className="field">
        <label className="field-label" htmlFor="acc-current">Current password</label>
        <input
          id="acc-current"
          type="password"
          autoComplete="current-password"
          value={form.currentPassword}
          onChange={set('currentPassword')}
          aria-invalid={Boolean(errors.currentPassword)}
        />
        {errors.currentPassword && <p className="field-error">{errors.currentPassword}</p>}
      </div>

      <div className="field">
        <label className="field-label" htmlFor="acc-new">New password</label>
        <input
          id="acc-new"
          type="password"
          autoComplete="new-password"
          value={form.newPassword}
          onChange={set('newPassword')}
          aria-invalid={Boolean(errors.newPassword)}
        />
        {errors.newPassword && <p className="field-error">{errors.newPassword}</p>}
      </div>

      <button className="btn btn-outline-dark" type="submit" disabled={busy}>
        {busy ? 'Changing…' : 'Change password'}
      </button>
    </form>
  )
}

export default function Account() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const signOut = async () => {
    await logout()
    navigate('/')
  }

  return (
    <section className="band band-cream">
      <div className="wrap">
        <div className="account-head">
          <div className="head" style={{ marginBottom: 0 }}>
            <h1 style={{ fontSize: 'clamp(2.2rem, 5vw, 3.2rem)' }}>Your account</h1>
            <p>
              Signed in as <strong>{user.name}</strong> ({user.email}).
            </p>
          </div>
          <button className="btn btn-outline-dark btn-sm" onClick={signOut}>Sign out</button>
        </div>

        <div className="account-layout">
          <div>
            <h2 style={{ fontSize: '1.6rem' }}>Order history</h2>
            <OrderHistory />
          </div>
          <div>
            <ProfileForm />
            <PasswordForm />
          </div>
        </div>
      </div>
    </section>
  )
}
