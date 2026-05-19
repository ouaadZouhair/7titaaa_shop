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

  const addToCart = (product, size = 'M') => {
    setCartItems(prev => {
      const exists = prev.some(i => i.id === product.id && i.size === size)
      if (exists) return prev
      return [...prev, { ...product, size, quantity: 1 }]
    })
  }

  const removeFromCart = (id, size) =>
    setCartItems(prev => prev.filter(i => !(i.id === id && i.size === size)))

  const clearCart = () => setCartItems([])

  const cartCount = cartItems.length
  const cartTotal = cartItems.reduce((s, i) => s + i.price, 0)

  return (
    <CartContext.Provider
      value={{ cartItems, addToCart, removeFromCart, clearCart, cartCount, cartTotal }}
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
