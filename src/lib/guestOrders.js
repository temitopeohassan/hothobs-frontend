/**
 * Claim tokens for orders placed without an account.
 *
 * A guest has no session, so once Paystack sends them back to
 * /order/complete the only thing that proves the order is theirs is the
 * token the server handed us when we placed it. Keep it in localStorage,
 * not sessionStorage: paying can mean leaving the browser for a bank app
 * and coming back to a tab the phone has since discarded.
 *
 * Every read and write is wrapped — private mode and blocked site data
 * make these throw — and a missing token is not fatal, it only means the
 * confirmation page has to ask the customer to sign in or call us.
 */
const KEY = 'hothobs.guestOrders'
// Plenty for one person's recent orders, and the server expires the tokens
// after three days anyway.
const KEEP = 10

const read = () => {
  try {
    const parsed = JSON.parse(window.localStorage.getItem(KEY) ?? '[]')
    return Array.isArray(parsed) ? parsed.filter((e) => e?.reference && e?.token) : []
  } catch {
    return []
  }
}

const write = (entries) => {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(entries.slice(0, KEEP)))
  } catch {
    // Nothing to do — the order is placed either way.
  }
}

export function rememberGuestOrder(reference, token) {
  if (!reference || !token) return
  write([{ reference, token }, ...read().filter((e) => e.reference !== reference)])
}

/**
 * The header the API expects, or nothing when we hold no token for this
 * order — which is the normal case for a signed-in customer, whose session
 * cookie speaks for them instead.
 *
 * Tokens are left in place rather than cleared once an order settles: the
 * customer may well reload the confirmation, and the server expires them on
 * its own.
 */
export const guestOrderHeaders = (reference) => {
  const token = read().find((e) => e.reference === reference)?.token
  return token ? { 'X-Order-Token': token } : undefined
}
