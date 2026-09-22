import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import { api } from '../lib/api.js'
import { rememberGuestOrder } from '../lib/guestOrders.js'
import { naira } from '../data/menu.js'
import { orderingInfo } from '../data/site.js'

// Mirrors the server's list so the form renders before /zones responds; the
// server is the authority on fees and re-sends them below.
const defaultZones = [
  { id: 'pickup', label: 'Pickup from our kitchen', fee: 0 },
  { id: 'mainland', label: 'Delivery — Mainland', fee: 3000 },
  { id: 'island', label: 'Delivery — Island', fee: 4500 },
  { id: 'outside', label: 'Delivery — outside Lagos', fee: null },
]

export default function Order() {
  const { lines, subtotal, setQty, remove } = useCart()
  const { user, ready, login } = useAuth()

  const [zones, setZones] = useState(defaultZones)
  const [zone, setZone] = useState('mainland')
  // Set once the customer chooses to check out without an account. Signing
  // in later clears it, so their details come from the account instead.
  const [asGuest, setAsGuest] = useState(false)
  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    when: '',
    notes: '',
  })
  const [errors, setErrors] = useState({})
  const [message, setMessage] = useState('')
  const [placing, setPlacing] = useState(false)

  // The sign-in form on the gate below. Kept on this page rather than
  // sending them to /login and back, so the cart and the order they were
  // about to place stay put underneath.
  const [credentials, setCredentials] = useState({ email: '', password: '' })
  const [signInErrors, setSignInErrors] = useState({})
  const [signInMessage, setSignInMessage] = useState('')
  const [signingIn, setSigningIn] = useState(false)

  useEffect(() => {
    const controller = new AbortController()
    api
      .get('/zones', { signal: controller.signal })
      .then((data) => setZones(data.zones))
      .catch(() => {
        // Keep the defaults; placing the order will surface any real problem.
      })
    return () => controller.abort()
  }, [])

  // Fill in what we already know about a signed-in customer.
  useEffect(() => {
    if (!user) return
    setAsGuest(false)
    setForm((s) => ({
      ...s,
      name: s.name || user.name,
      phone: s.phone || user.phone,
    }))
  }, [user])

  const set = (key) => (event) => setForm((s) => ({ ...s, [key]: event.target.value }))
  const setCredential = (key) => (event) =>
    setCredentials((s) => ({ ...s, [key]: event.target.value }))

  /**
   * Signs in without leaving checkout. There is no redirect on success:
   * `user` arrives from the context and this same page re-renders as the
   * checkout form, cart intact and their name and phone already filled in.
   */
  const signIn = async (event) => {
    event.preventDefault()
    setSigningIn(true)
    setSignInErrors({})
    setSignInMessage('')
    try {
      await login(credentials)
    } catch (error) {
      setSignInErrors(error.fields ?? {})
      setSignInMessage(error.message)
    } finally {
      setSigningIn(false)
    }
  }

  const selectedZone = zones.find((z) => z.id === zone)
  const fee = selectedZone?.fee ?? 0
  const total = subtotal + fee
  const isPickup = zone === 'pickup'
  // A guest has no account to reach them through, so the details the kitchen
  // needs have to come from the form. The server checks all of this again.
  const guest = !user
  const canPlace =
    form.name &&
    (isPickup || form.address) &&
    (!guest || (form.email && form.phone)) &&
    lines.length > 0

  /**
   * Places the order and hands the customer to Paystack.
   *
   * We send what was chosen, never what it costs — the server prices every
   * line from its own catalogue, so the total shown here is a quote and the
   * amount charged is the server's. The cart is deliberately NOT cleared:
   * the customer has not paid yet, and if they abandon the Paystack page
   * they should come back to a cart that still has their food in it.
   * /order/complete clears it once the payment is confirmed.
   */
  const payWithPaystack = async () => {
    setPlacing(true)
    setErrors({})
    setMessage('')
    try {
      const { payment, orderToken } = await api.post('/orders', {
        name: form.name,
        phone: form.phone,
        // The server takes a signed-in customer's email from their account
        // and ignores anything we send, so only a guest needs to supply it.
        ...(guest ? { email: form.email } : {}),
        zone,
        payment: 'paystack',
        address: isPickup ? '' : form.address,
        wantedFor: form.when,
        notes: form.notes,
        items: lines.map((l) => ({
          slug: l.slug,
          portionId: l.portionId,
          options: l.options ?? {},
          notes: l.notes,
          qty: l.qty,
        })),
      })
      if (!payment?.authorizationUrl) {
        throw new Error('Paystack did not give us a checkout link. Please try again.')
      }
      // A guest order has no account behind it, so this token is the only
      // way /order/complete can read it back. Store it before we leave.
      if (orderToken) rememberGuestOrder(payment.reference, orderToken)
      // Leaves the site. Nothing after this runs.
      window.location.assign(payment.authorizationUrl)
    } catch (error) {
      setErrors(error.fields ?? {})
      setMessage(error.message)
      setPlacing(false)
    }
  }

  if (lines.length === 0) {
    return (
      <section className="band band-cream">
        <div className="wrap panel confirm">
          <h1 style={{ fontSize: '2rem' }}>Your cart is empty</h1>
          <p>Pick a few dishes and they will show up here, ready to check out.</p>
          <Link className="btn btn-gold" to="/menu">Browse the menu</Link>
        </div>
      </section>
    )
  }

  // How we address the customer depends on whether they are signed in, so
  // hold here until we know — otherwise the page flashes the sign-in choice
  // at someone who never needed to make it.
  if (!ready) {
    return (
      <section className="band band-cream">
        <div className="wrap panel confirm">
          <p className="note" role="status">Checking your account…</p>
        </div>
      </section>
    )
  }

  // Offered once, before the form: signing in and checking out as a guest
  // sit side by side, so neither reads as the only way through. Nothing
  // here blocks the order — it only asks how they would like to place it.
  if (guest && !asGuest) {
    return (
      <section className="band band-cream">
        <div className="wrap">
          <div className="head">
            <h1 style={{ fontSize: 'clamp(2rem, 5vw, 2.8rem)' }}>How would you like to check out?</h1>
            <p>
              Your cart is safe either way. Sign in and we keep this order in your history and fill
              your details in next time — or check out as a guest and order in a couple of minutes.
            </p>
          </div>

          <div className="gate">
            <form className="panel" onSubmit={signIn} noValidate>
              <h3>Sign in</h3>
              {signInMessage && <p className="form-error" role="alert">{signInMessage}</p>}

              <div className="field">
                <label className="field-label" htmlFor="gate-email">Email address</label>
                <input id="gate-email" type="email" autoComplete="email"
                  value={credentials.email} onChange={setCredential('email')}
                  aria-invalid={Boolean(signInErrors.email)}
                  aria-describedby={signInErrors.email ? 'gate-email-error' : undefined} />
                {signInErrors.email && (
                  <p className="field-error" id="gate-email-error">{signInErrors.email}</p>
                )}
              </div>

              <div className="field">
                <label className="field-label" htmlFor="gate-password">Password</label>
                <input id="gate-password" type="password" autoComplete="current-password"
                  value={credentials.password} onChange={setCredential('password')}
                  aria-invalid={Boolean(signInErrors.password)}
                  aria-describedby={signInErrors.password ? 'gate-password-error' : undefined} />
                {signInErrors.password && (
                  <p className="field-error" id="gate-password-error">{signInErrors.password}</p>
                )}
              </div>

              <button className="btn btn-gold btn-block" type="submit" disabled={signingIn}>
                {signingIn ? 'Signing in…' : 'Sign in and check out'}
              </button>

              <div className="gate-foot">
                <p className="note" style={{ textAlign: 'center' }}>
                  Don&rsquo;t have an account?{' '}
                  <Link className="link-gold" to="/register" state={{ from: '/order' }}>
                    Create an account now
                  </Link>
                </p>
              </div>
            </form>

            <div className="panel">
              <h3>Check out as a guest</h3>
              <p>
                No account and no password — just the details the kitchen needs to cook your order
                and reach you about it.
              </p>
              <p className="note">
                A guest order still gets a reference and a receipt by email. It will not be saved to
                an account, so keep that email.
              </p>
              <div className="gate-foot">
                <button type="button" className="btn btn-outline-dark btn-block"
                  onClick={() => setAsGuest(true)}>
                  Continue as a guest
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="band band-cream">
      <div className="wrap">
        <div className="head">
          <h1 style={{ fontSize: 'clamp(2.2rem, 5vw, 3.2rem)' }}>Check out</h1>
          <div className="steps">
            <span className="on">Your order</span>
            <span className="on">Your details</span>
            <span className="on">Delivery or pickup</span>
            <span className="on">Payment</span>
            <span>Confirmation</span>
          </div>
        </div>

        <div className="checkout">
          <div>
            <div className="panel">
              <h3>Your details</h3>
              {guest && (
                <p className="note" style={{ marginTop: '-0.4rem', marginBottom: '1rem' }}>
                  Checking out as a guest.{' '}
                  <Link to="/login" state={{ from: '/order' }}>Sign in instead</Link> to save this
                  order to an account.
                </p>
              )}
              <div className="two">
                <div className="field" style={{ margin: 0 }}>
                  <label htmlFor="o-name" className="field-label">Full name</label>
                  <input id="o-name" type="text" autoComplete="name" value={form.name}
                    onChange={set('name')} aria-invalid={Boolean(errors.name)} />
                  {errors.name && <p className="field-error">{errors.name}</p>}
                </div>
                <div className="field" style={{ margin: 0 }}>
                  <label htmlFor="o-phone" className="field-label">
                    Phone{' '}
                    <span className="field-hint">
                      {guest
                        ? 'so we can call you about this order'
                        : 'optional, but it is the fastest way to reach you'}
                    </span>
                  </label>
                  <input id="o-phone" type="tel" autoComplete="tel" value={form.phone}
                    onChange={set('phone')} aria-invalid={Boolean(errors.phone)} />
                  {errors.phone && <p className="field-error">{errors.phone}</p>}
                </div>
              </div>

              {/* A signed-in customer's receipt goes to their account email.
                  For a guest this is the only address we have. */}
              {guest && (
                <div className="field" style={{ marginBottom: 0 }}>
                  <label htmlFor="o-email" className="field-label">
                    Email <span className="field-hint">your receipt and order reference go here</span>
                  </label>
                  <input id="o-email" type="email" autoComplete="email" value={form.email}
                    onChange={set('email')} aria-invalid={Boolean(errors.email)} />
                  {errors.email && <p className="field-error">{errors.email}</p>}
                </div>
              )}
            </div>

            <div className="panel">
              <h3>Delivery or pickup</h3>
              <div className="choices" role="radiogroup" aria-label="Delivery or pickup">
                {zones.map((z) => (
                  <label key={z.id} className={`choice ${zone === z.id ? 'on' : ''}`}>
                    <input type="radio" name="zone" checked={zone === z.id} onChange={() => setZone(z.id)} />
                    {z.label}
                    {z.fee > 0 && ` · ${naira(z.fee)}`}
                    {z.fee === null && ' · we will quote'}
                  </label>
                ))}
              </div>

              {!isPickup && (
                <div className="field">
                  <label htmlFor="o-address" className="field-label">Delivery address</label>
                  <textarea id="o-address" value={form.address} onChange={set('address')}
                    aria-invalid={Boolean(errors.address)}
                    placeholder="Street, area, landmark and anything a rider needs to find you." />
                  {errors.address && <p className="field-error">{errors.address}</p>}
                </div>
              )}

              <div className="field">
                <label htmlFor="o-when" className="field-label">When do you need it?</label>
                <input id="o-when" type="text" value={form.when} onChange={set('when')}
                  placeholder="e.g. today by 5pm, or Saturday morning" />
              </div>

              <div className="field" style={{ marginBottom: 0 }}>
                <label htmlFor="o-notes" className="field-label">Order notes</label>
                <textarea id="o-notes" value={form.notes} onChange={set('notes')}
                  placeholder="Anything else about this order." />
              </div>
            </div>

            <div className="panel">
              <h3>Payment</h3>
              {/* Paystack is the only method — so this states what happens
                  next rather than asking the customer to choose. */}
              <p style={{ marginBottom: '0.6rem' }}>
                <strong>Pay securely with Paystack.</strong>
              </p>
              <p className="note" style={{ marginBottom: '0.6rem' }}>
                Card, bank transfer or USSD. Choosing <em>Pay with Paystack</em> takes you
                to Paystack&rsquo;s secure page to finish — your card details never touch
                our site.
              </p>
              <p className="note" style={{ marginBottom: 0 }}>
                Your order is confirmed the moment payment goes through, and we call you
                to agree timing.
              </p>
            </div>
          </div>

          <div>
            <div className="panel">
              <h3>Your order</h3>
              {lines.map((l) => (
                <div className="line" key={l.key}>
                  <div className={`line-thumb tone-${l.tone}`} aria-hidden="true" />
                  <div>
                    <strong>{l.name}</strong>
                    <small>{[l.portionLabel, ...l.optionLabels].filter(Boolean).join(' · ')}</small>
                    {l.notes && <small style={{ display: 'block' }}>Note: {l.notes}</small>}
                    <div className="qty" style={{ marginTop: '0.5rem', transform: 'scale(0.8)', transformOrigin: 'left' }}>
                      <button onClick={() => setQty(l.key, l.qty - 1)} aria-label={`Reduce ${l.name}`}>−</button>
                      <span>{l.qty}</span>
                      <button onClick={() => setQty(l.key, l.qty + 1)} aria-label={`Add another ${l.name}`}>+</button>
                    </div>
                  </div>
                  <div className="line-price">
                    {naira(l.unitPrice * l.qty)}
                    <div><button className="remove" onClick={() => remove(l.key)}>Remove</button></div>
                  </div>
                </div>
              ))}

              <div className="summary-row" style={{ marginTop: '1rem' }}>
                <span>Subtotal</span><span>{naira(subtotal)}</span>
              </div>
              <div className="summary-row">
                <span>{isPickup ? 'Pickup' : 'Delivery'}</span>
                <span>{selectedZone?.fee === null ? 'Quoted after we call' : naira(fee)}</span>
              </div>
              <div className="summary-total">
                <span>Total</span>
                <span className="price">{naira(total)}</span>
              </div>

              {message && <p className="form-error" role="alert" style={{ marginTop: '1rem' }}>{message}</p>}

              <button className="btn btn-gold btn-block" style={{ marginTop: '1.25rem' }}
                onClick={payWithPaystack} disabled={!canPlace || placing}>
                {placing ? 'Taking you to Paystack…' : `Pay ${naira(total)} with Paystack`}
              </button>
              {!canPlace && (
                <p className="note" style={{ marginTop: '0.75rem' }}>
                  Add your{' '}
                  {[
                    !form.name && 'name',
                    guest && !form.email && 'email',
                    guest && !form.phone && 'phone number',
                    !isPickup && !form.address && 'delivery address',
                  ]
                    .filter(Boolean)
                    .join(', ')
                    .replace(/, ([^,]*)$/, ' and $1')}{' '}
                  to place this order.
                </p>
              )}
            </div>

            <div className="panel">
              <h3>Before you order</h3>
              {orderingInfo.slice(0, 3).map((o) => (
                <p key={o.title} className="note" style={{ marginBottom: '0.6rem' }}>
                  <strong>{o.title}:</strong> {o.body}
                </p>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
