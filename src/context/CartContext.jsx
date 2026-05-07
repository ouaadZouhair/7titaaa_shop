import { createContext, useContext, useState, useEffect } from 'react'

const CartContext = createContext(null)

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState(() => {
    try {
      const saved = localStorage.getItem('7titaaa_cart')
      return saved ? JSON.parse(saved) : []
    } catch {
      return []
    }
  })

  useEffect(() => {
    localStorage.setItem('7titaaa_cart', JSON.stringify(cartItems))
  }, [cartItems])

  const addToCart = (product, size = 'M', quantity = 1) => {
    setCartItems(prev => {
      const idx = prev.findIndex(i => i.id === product.id && i.size === size)
      if (idx >= 0) {
        const updated = [...prev]
        updated[idx] = { ...updated[idx], quantity: updated[idx].quantity + quantity }
        return updated
      }
      return [...prev, { ...product, size, quantity }]
    })
  }

  const removeFromCart = (id, size) =>
    setCartItems(prev => prev.filter(i => !(i.id === id && i.size === size)))

  const updateQuantity = (id, size, quantity) => {
    if (quantity <= 0) { removeFromCart(id, size); return }
    setCartItems(prev =>
      prev.map(i => (i.id === id && i.size === size ? { ...i, quantity } : i))
    )
  }

  const clearCart = () => setCartItems([])

  const cartCount = cartItems.reduce((s, i) => s + i.quantity, 0)
  const cartTotal = cartItems.reduce((s, i) => s + i.price * i.quantity, 0)

  return (
    <CartContext.Provider
      value={{ cartItems, addToCart, removeFromCart, updateQuantity, clearCart, cartCount, cartTotal }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}
