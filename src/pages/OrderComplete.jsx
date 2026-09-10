import { useEffect, useRef, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useCart } from '../context/CartContext.jsx'
import { api } from '../lib/api.js'
import { naira } from '../data/menu.js'
import { contact } from '../data/site.js'

/**
 * Where Paystack sends the customer back to.
 *
 * The reference in the URL only says which order to ask about — it is not
 * proof of anything. The server checks with Paystack and tells us what
 * really happened, so a hand-typed reference cannot talk us into showing a
 * confirmation for an order nobody paid for.
 */
export default function OrderComplete() {
  const [params] = useSearchParams()
  const { clear } = useCart()
  // Paystack sends `reference`; `trxref` is the same value under its older name.
  const reference = params.get('reference') || params.get('trxref') || ''

  const [state, setState] = useState(reference ? 'checking' : 'missing')
  const [order, setOrder] = useState(null)
  const [message, setMessage] = useState('')
  const cleared = useRef(false)

  useEffect(() => {
    if (!reference) return undefined
    const controller = new AbortController()
    let live = true

    ;(async () => {
      try {
        const { status } = await api.post(
          '/payments/verify',
          { reference },
          { signal: controller.signal }
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

  if (state === 'missing') {
    return panel(
      <>
        <h1 style={{ fontSize: '2rem' }}>We are missing a payment reference</h1>
        <p>
          If you have just paid, your order is safe — check your account for it, or call us
          on {contact.phone} and we will find it.
        </p>
        <div className="pdp-buy" style={{ justifyContent: 'center' }}>
          <Link className="btn btn-gold" to="/account">View your orders</Link>
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
        <p className="note">A receipt is on its way from Paystack, and this order is saved to your account.</p>
        <div className="pdp-buy" style={{ justifyContent: 'center' }}>
          <Link className="btn btn-gold" to="/menu">Order something else</Link>
          <Link className="btn btn-outline-dark" to="/account">View your orders</Link>
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
          ? 'Paystack has not confirmed it yet. Give it a minute and check your account — if the money left your bank, the order will confirm itself.'
          : 'Nothing has been charged and your cart is still here, so you can try again whenever you are ready.'}
      </p>
      {message && <p className="form-error" role="alert">{message}</p>}
      <p className="note">
        Reference <strong>{reference}</strong>. If anything looks wrong, call us on {contact.phone}.
      </p>
      <div className="pdp-buy" style={{ justifyContent: 'center' }}>
        <Link className="btn btn-gold" to="/order">Back to checkout</Link>
        <Link className="btn btn-outline-dark" to="/account">View your orders</Link>
      </div>
    </>
  )
}
