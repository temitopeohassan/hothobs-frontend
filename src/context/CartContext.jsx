import { createContext, useContext, useMemo, useReducer, useState } from 'react'
import { getProduct, minQtyOf } from '../data/menu.js'

const CartContext = createContext(null)

/**
 * The order minimum for whatever this line is, straight from the menu.
 *
 * Looked up by slug rather than stored on the line, so a line built
 * somewhere that forgets to copy the minimum still gets it.
 */
const minFor = (slug) => minQtyOf(getProduct(slug) ?? {})

function reducer(state, action) {
  switch (action.type) {
    case 'add': {
      const min = minFor(action.line.slug)
      const existing = state.find((l) => l.key === action.line.key)
      if (existing) {
        return state.map((l) =>
          l.key === action.line.key ? { ...l, qty: Math.max(min, l.qty + action.line.qty) } : l
        )
      }
      return [...state, { ...action.line, qty: Math.max(min, action.line.qty) }]
    }
    case 'qty':
      // 0 still means remove — that is what the stepper's bottom end and the
      // Remove button both rely on. Anything above 0 is raised to the
      // product's minimum instead, so a Black Pack cannot sit in the cart at
      // five packs when Hothobs sells it in twenties. The server checks the
      // same floor at checkout.
      return state
        .map((l) =>
          l.key === action.key
            ? { ...l, qty: action.qty <= 0 ? 0 : Math.max(minFor(l.slug), action.qty) }
            : l
        )
        .filter((l) => l.qty > 0)
    case 'remove':
      return state.filter((l) => l.key !== action.key)
    case 'clear':
      return []
    default:
      return state
  }
}

export function CartProvider({ children }) {
  const [lines, dispatch] = useReducer(reducer, [])
  const [open, setOpen] = useState(false)

  const value = useMemo(() => {
    const count = lines.reduce((n, l) => n + l.qty, 0)
    const subtotal = lines.reduce((n, l) => n + l.unitPrice * l.qty, 0)
    return {
      lines,
      count,
      subtotal,
      open,
      openCart: () => setOpen(true),
      closeCart: () => setOpen(false),
      add: (line) => {
        dispatch({ type: 'add', line })
        setOpen(true)
      },
      setQty: (key, qty) => dispatch({ type: 'qty', key, qty }),
      // So the steppers can disable "−" at the floor rather than letting it
      // look broken when a decrement is silently clamped away.
      minFor,
      remove: (key) => dispatch({ type: 'remove', key }),
      clear: () => dispatch({ type: 'clear' }),
    }
  }, [lines, open])

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export const useCart = () => {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used inside CartProvider')
  return ctx
}
