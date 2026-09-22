import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useCart } from '../context/CartContext.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import { api } from '../lib/api.js'
import { guestOrderHeaders } from '../lib/guestOrders.js'
import { naira } from '../data/menu.js'
import { contact } from '../data/site.js'

/**
 * Where Paystack sends the customer back to.
 *
 * The reference in the URL only says which order to ask about — it is not
 * proof of anything. The server checks with Paystack and tells us what
 * really happened, so a hand-typed reference cannot talk us into showing a
 * confirmation for an order nobody paid for.
 *
 * Reached signed in or not: a guest order is identified by the claim token
 * we stored when we placed it, which the server matches to this one
 * reference (see src/lib/guestOrders.js).
 */
export default function OrderComplete() {
  const [params] = useSearchParams()
  const { clear } = useCart()
  const { user } = useAuth()
  // Paystack sends `reference`; `trxref` is the same value under its older name.
  const reference = params.get('reference') || params.get('trxref') || ''

  const [state, setState] = useState(reference ? 'checking' : 'missing')
  const [order, setOrder] = useState(null)
  const [message, setMessage] = useState('')
  const cleared = useRef(false)

  // Whether we can speak for this order at all. A guest is only recognised
  // by the token stored when the order was placed, so if that is gone —
  // blocked site data, or they finished paying in another browser — the
  // server rightly refuses us, and we must not read that refusal as a
  // failed payment.
  const unclaimable = useMemo(
    () => Boolean(reference) && !user && !guestOrderHeaders(reference),
    [reference, user]
  )

  useEffect(() => {
    if (!reference) return undefined
    const controller = new AbortController()
    let live = true

    // Ignored by the server when the order belongs to an account.
    const headers = guestOrderHeaders(reference)

    ;(async () => {
      try {
        const { status } = await api.post(
          '/payments/verify',
          { reference },
          { signal: controller.signal, headers }
        )
        if (!live) return
        setState(status === 'paid' ? 'paid' : status)

        if (status === 'paid' && !cleared.current) {
          cleared.current = true
          clear()
        }

        // Pull the order itself so we can show what was actually charged.
        try {
          const { order: full } = await api.get(`/orders/${encodeURIComponent(reference)}`, {
            signal: controller.signal,
            headers,
          })
          if (live) setOrder(full)
        } catch {
          // The status is the part that matters; the summary is a bonus.
        }
      } catch (error) {
        if (!live || controller.signal.aborted) return
        setState('error')
        setMessage(error.message)
      }
    })()

    return () => {
      live = false
      controller.abort()
    }
    // `clear` is stable enough for this one-shot check, and re-running it
    // would ask Paystack the same question twice.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reference])

  const panel = (children) => (
    <section className="band band-cream">
      <div className="wrap panel confirm">{children}</div>
    </section>
  )

  // A guest has no order history to send them to, so the second button
  // becomes the thing that is actually useful to them.
  const secondaryLink = user ? (
    <Link className="btn btn-outline-dark" to="/account">View your orders</Link>
  ) : (
    <Link className="btn btn-outline-dark" to="/contact">Contact the kitchen</Link>
  )

  if (state === 'missing') {
    return panel(
      <>
        <h1 style={{ fontSize: '2rem' }}>We are missing a payment reference</h1>
        <p>
          If you have just paid, your order is safe — {user ? 'check your account for it, or call' : 'call'} us
          on {contact.phone} and we will find it.
        </p>
        <div className="pdp-buy" style={{ justifyContent: 'center' }}>
          {user && <Link className="btn btn-gold" to="/account">View your orders</Link>}
          <Link className={user ? 'btn btn-outline-dark' : 'btn btn-gold'} to="/menu">
            Back to the menu
          </Link>
        </div>
      </>
    )
  }

  // The payment may well have gone through; we simply cannot see it from
  // here. Say exactly that rather than guessing either way.
  if (state === 'error' && unclaimable) {
    return panel(
      <>
        <h1 style={{ fontSize: '2rem' }}>We cannot check this order from this browser</h1>
        <p>
          You ordered as a guest, so this order is only recognised on the browser you placed it
          from — and we do not have it here. <strong>Your payment is not affected.</strong>
        </p>
        <p className="note">
          Reference <strong>{reference}</strong>. Call us on {contact.phone} with that reference
          and we will confirm it for you — or reopen this page in the browser you ordered from.
        </p>
        <div className="pdp-buy" style={{ justifyContent: 'center' }}>
          <Link className="btn btn-gold" to="/contact">Contact the kitchen</Link>
          <Link className="btn btn-outline-dark" to="/menu">Back to the menu</Link>
        </div>
      </>
    )
  }

  if (state === 'checking') {
    return panel(
      <p className="note" role="status">
        Confirming your payment with Paystack…
      </p>
    )
  }

  if (state === 'paid') {
    return panel(
      <>
        <div className="confirm-mark" aria-hidden="true">✓</div>
        <h1 style={{ fontSize: '2rem' }}>Payment received</h1>
        <p>
          Thank you{order ? `, ${order.customer.name}` : ''}. Your reference is{' '}
          <strong>{reference}</strong>
          {order && <> and we have taken <strong>{naira(order.total)}</strong></>}.
        </p>
        <p>
          Your order is confirmed and the kitchen has it. We will call you
          {order?.customer?.phone ? ` on ${order.customer.phone}` : ''} to agree timing.
        </p>
        <p className="note">
          A receipt is on its way from Paystack
          {user
            ? ', and this order is saved to your account.'
            : `. You ordered as a guest, so keep that reference — quote it if you need to reach us about this order.`}
        </p>
        <div className="pdp-buy" style={{ justifyContent: 'center' }}>
          <Link className="btn btn-gold" to="/menu">Order something else</Link>
          {secondaryLink}
        </div>
      </>
    )
  }

  // pending, failed, abandoned or an error reaching us — in every one of these
  // the food has not been paid for, so say so plainly and keep the cart.
  const stillWaiting = state === 'pending'
  return panel(
    <>
      <h1 style={{ fontSize: '2rem' }}>
        {stillWaiting ? 'Your payment is still processing' : 'That payment did not go through'}
      </h1>
      <p>
        {stillWaiting
          ? `Paystack has not confirmed it yet. Give it a minute and ${
              user ? 'check your account' : 'reload this page'
            } — if the money left your bank, the order will confirm itself.`
          : 'Nothing has been charged and your cart is still here, so you can try again whenever you are ready.'}
      </p>
      {message && <p className="form-error" role="alert">{message}</p>}
      <p className="note">
        Reference <strong>{reference}</strong>. If anything looks wrong, call us on {contact.phone}.
      </p>
      <div className="pdp-buy" style={{ justifyContent: 'center' }}>
        <Link className="btn btn-gold" to="/order">Back to checkout</Link>
        {secondaryLink}
      </div>
    </>
  )
}
