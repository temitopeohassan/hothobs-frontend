import { createContext, useContext, useMemo, useReducer, useState } from 'react'

const CartContext = createContext(null)

function reducer(state, action) {
  switch (action.type) {
    case 'add': {
      const existing = state.find((l) => l.key === action.line.key)
      if (existing) {
        return state.map((l) =>
          l.key === action.line.key ? { ...l, qty: l.qty + action.line.qty } : l
        )
      }
      return [...state, action.line]
    }
    case 'qty':
      return state
        .map((l) => (l.key === action.key ? { ...l, qty: Math.max(0, action.qty) } : l))
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
