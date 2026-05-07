import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'motion/react'
import { useForm } from 'react-hook-form'
import { useCart } from '../context/CartContext'
import AnimatedButton from '../components/AnimatedButton'

export default function Checkout() {
  const { cartItems, removeFromCart, updateQuantity, cartTotal, cartCount, clearCart } = useCart()
  const [step, setStep] = useState('cart') // 'cart' | 'shipping' | 'payment' | 'confirmed'
  const [shippingData, setShippingData] = useState(null)
  const navigate = useNavigate()

  const { register, handleSubmit, formState: { errors } } = useForm()

  const shipping = cartTotal >= 100 ? 0 : 9.99
  const tax = cartTotal * 0.08
  const total = cartTotal + shipping + tax

  const handleShipping = (data) => {
    setShippingData(data)
    setStep('payment')
  }

  const handleOrder = () => {
    clearCart()
    setStep('confirmed')
  }

  const inputClass =
    'w-full bg-gray-50 border border-gray-200 rounded-sm px-4 py-3.5 text-sm text-street-black placeholder-gray-400 focus:outline-none focus:border-primary focus:bg-white transition-all'

  if (step === 'confirmed') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="max-w-md"
        >
          <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="font-display text-5xl text-street-black tracking-wide mb-4">ORDER CONFIRMED</h2>
          <p className="text-gray-500 text-sm leading-relaxed mb-2">
            Your order has been placed. You'll receive a confirmation email shortly.
          </p>
          <p className="font-mono text-[10px] text-gray-400 tracking-widest uppercase mb-8">
            Order #7T-{Math.floor(Math.random() * 90000 + 10000)}
          </p>
          <AnimatedButton variant="dark" onClick={() => navigate('/shop')} className="mx-auto">
            Continue Shopping
          </AnimatedButton>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-street-black py-12 px-6">
        <div className="max-w-6xl mx-auto">
          <h1 className="font-display text-5xl text-white tracking-wide">CHECKOUT</h1>
          {/* Step indicator */}
          <div className="flex items-center gap-3 mt-4">
            {['Cart', 'Shipping', 'Payment'].map((s, i) => {
              const stepKey = ['cart', 'shipping', 'payment'][i]
              const isActive = step === stepKey
              const isDone = ['cart', 'shipping', 'payment'].indexOf(step) > i
              return (
                <div key={s} className="flex items-center gap-3">
                  <span
                    className={`font-mono text-[10px] tracking-widest uppercase ${
                      isActive ? 'text-primary-light' : isDone ? 'text-white/40 line-through' : 'text-white/20'
                    }`}
                  >
                    {s}
                  </span>
                  {i < 2 && <span className="text-white/20">→</span>}
                </div>
              )
            })}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-10 grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* ─── LEFT PANEL ─── */}
        <div className="lg:col-span-2">
          <AnimatePresence mode="wait">

            {/* CART STEP */}
            {step === 'cart' && (
              <motion.div
                key="cart"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
              >
                <h2 className="font-display text-3xl text-street-black tracking-wide mb-6">
                  YOUR BAG ({cartCount})
                </h2>

                {cartItems.length === 0 ? (
                  <div className="bg-white rounded-sm p-12 text-center">
                    <p className="font-display text-4xl text-gray-200 mb-3">YOUR BAG IS EMPTY</p>
                    <Link to="/shop">
                      <AnimatedButton variant="dark" className="mt-4 mx-auto">Browse Shop</AnimatedButton>
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {cartItems.map(item => (
                      <motion.div
                        key={`${item.id}-${item.size}`}
                        layout
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: -30 }}
                        className="bg-white rounded-sm p-4 flex gap-4 items-start"
                      >
                        <Link to={`/product/${item.id}`}>
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-20 h-24 object-cover rounded-sm flex-shrink-0"
                          />
                        </Link>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <p className="font-mono text-[10px] tracking-widest text-gray-400 uppercase mb-1">
                                {item.category}
                              </p>
                              <h3 className="font-semibold text-sm text-street-black leading-tight">{item.name}</h3>
                              <p className="font-mono text-xs text-gray-400 mt-1">Size: {item.size}</p>
                            </div>
                            <button
                              onClick={() => removeFromCart(item.id, item.size)}
                              className="text-gray-300 hover:text-accent-red transition-colors flex-shrink-0"
                            >
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          </div>
                          <div className="flex items-center justify-between mt-3">
                            <div className="inline-flex items-center border border-gray-200 rounded-sm">
                              <button
                                onClick={() => updateQuantity(item.id, item.size, item.quantity - 1)}
                                className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-street-black transition-colors"
                              >
                                −
                              </button>
                              <span className="w-8 text-center font-mono text-xs">{item.quantity}</span>
                              <button
                                onClick={() => updateQuantity(item.id, item.size, item.quantity + 1)}
                                className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-street-black transition-colors"
                              >
                                +
                              </button>
                            </div>
                            <span className="font-bold text-street-black">
                              ${(item.price * item.quantity).toFixed(2)}
                            </span>
                          </div>
                        </div>
                      </motion.div>
                    ))}

                    <div className="pt-4">
                      <AnimatedButton
                        variant="dark"
                        onClick={() => setStep('shipping')}
                        fullWidth
                        className="py-4"
                        disabled={cartItems.length === 0}
                      >
                        Proceed to Shipping →
                      </AnimatedButton>
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {/* SHIPPING STEP */}
            {step === 'shipping' && (
              <motion.div
                key="shipping"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <button
                  onClick={() => setStep('cart')}
                  className="flex items-center gap-2 text-gray-400 hover:text-street-black font-mono text-[11px] tracking-widest uppercase mb-6 transition-colors"
                >
                  ← Back to Cart
                </button>
                <h2 className="font-display text-3xl text-street-black tracking-wide mb-6">SHIPPING INFO</h2>

                <form onSubmit={handleSubmit(handleShipping)} className="space-y-5">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="font-mono text-[10px] tracking-widest uppercase text-gray-500 block mb-2">First Name</label>
                      <input {...register('firstName', { required: true })} placeholder="Jordan" className={inputClass} />
                    </div>
                    <div>
                      <label className="font-mono text-[10px] tracking-widest uppercase text-gray-500 block mb-2">Last Name</label>
                      <input {...register('lastName', { required: true })} placeholder="Williams" className={inputClass} />
                    </div>
                  </div>
                  <div>
                    <label className="font-mono text-[10px] tracking-widest uppercase text-gray-500 block mb-2">Email</label>
                    <input {...register('email', { required: true })} type="email" placeholder="you@example.com" className={inputClass} />
                  </div>
                  <div>
                    <label className="font-mono text-[10px] tracking-widest uppercase text-gray-500 block mb-2">Address</label>
                    <input {...register('address', { required: true })} placeholder="123 Street Ave" className={inputClass} />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="font-mono text-[10px] tracking-widest uppercase text-gray-500 block mb-2">City</label>
                      <input {...register('city', { required: true })} placeholder="New York" className={inputClass} />
                    </div>
                    <div>
                      <label className="font-mono text-[10px] tracking-widest uppercase text-gray-500 block mb-2">ZIP Code</label>
                      <input {...register('zip', { required: true })} placeholder="10001" className={inputClass} />
                    </div>
                  </div>
                  <div>
                    <label className="font-mono text-[10px] tracking-widest uppercase text-gray-500 block mb-2">Country</label>
                    <select {...register('country')} className={inputClass}>
                      <option value="US">United States</option>
                      <option value="UK">United Kingdom</option>
                      <option value="FR">France</option>
                      <option value="MA">Morocco</option>
                      <option value="OTHER">Other</option>
                    </select>
                  </div>
                  <AnimatedButton type="submit" variant="dark" fullWidth className="py-4 mt-2">
                    Continue to Payment →
                  </AnimatedButton>
                </form>
              </motion.div>
            )}

            {/* PAYMENT STEP */}
            {step === 'payment' && (
              <motion.div
                key="payment"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <button
                  onClick={() => setStep('shipping')}
                  className="flex items-center gap-2 text-gray-400 hover:text-street-black font-mono text-[11px] tracking-widest uppercase mb-6 transition-colors"
                >
                  ← Back to Shipping
                </button>
                <h2 className="font-display text-3xl text-street-black tracking-wide mb-6">PAYMENT</h2>

                <div className="bg-white rounded-sm p-6 space-y-5">
                  <div className="flex items-center gap-2 p-3 bg-primary/5 border border-primary/20 rounded-sm">
                    <svg className="w-4 h-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    <p className="font-mono text-[10px] tracking-widest text-primary uppercase">Secure Payment</p>
                  </div>

                  <div>
                    <label className="font-mono text-[10px] tracking-widest uppercase text-gray-500 block mb-2">Card Number</label>
                    <input placeholder="•••• •••• •••• ••••" className={inputClass} maxLength={19} />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="font-mono text-[10px] tracking-widest uppercase text-gray-500 block mb-2">Expiry</label>
                      <input placeholder="MM / YY" className={inputClass} maxLength={7} />
                    </div>
                    <div>
                      <label className="font-mono text-[10px] tracking-widest uppercase text-gray-500 block mb-2">CVV</label>
                      <input placeholder="•••" className={inputClass} maxLength={4} type="password" />
                    </div>
                  </div>
                  <div>
                    <label className="font-mono text-[10px] tracking-widest uppercase text-gray-500 block mb-2">Name on Card</label>
                    <input placeholder="Jordan Williams" className={inputClass} />
                  </div>
                </div>

                <AnimatedButton
                  variant="gradient"
                  onClick={handleOrder}
                  fullWidth
                  className="py-4 mt-6 text-base"
                >
                  Place Order — ${total.toFixed(2)}
                </AnimatedButton>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ─── ORDER SUMMARY ─── */}
        <div>
          <div className="bg-white rounded-sm p-6 sticky top-24">
            <h3 className="font-display text-2xl text-street-black tracking-wide mb-5">ORDER SUMMARY</h3>

            {/* Items */}
            <div className="space-y-3 mb-5">
              {cartItems.map(item => (
                <div key={`${item.id}-${item.size}`} className="flex gap-3 items-center">
                  <img src={item.image} alt={item.name} className="w-12 h-14 object-cover rounded-sm flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-street-black truncate">{item.name}</p>
                    <p className="font-mono text-[10px] text-gray-400">× {item.quantity} · {item.size}</p>
                  </div>
                  <span className="text-sm font-semibold flex-shrink-0">${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>

            {/* Divider */}
            <div className="border-t border-gray-100 pt-4 space-y-2">
              {[
                { label: 'Subtotal', value: `$${cartTotal.toFixed(2)}` },
                { label: 'Shipping', value: shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}` },
                { label: 'Tax (8%)', value: `$${tax.toFixed(2)}` },
              ].map(({ label, value }) => (
                <div key={label} className="flex justify-between text-sm">
                  <span className="text-gray-500">{label}</span>
                  <span className={`font-mono ${value === 'FREE' ? 'text-primary font-bold' : 'text-street-black'}`}>
                    {value}
                  </span>
                </div>
              ))}
              <div className="border-t border-gray-100 pt-3 flex justify-between items-center">
                <span className="font-semibold text-street-black">Total</span>
                <span className="font-display text-2xl text-street-black">${total.toFixed(2)}</span>
              </div>
            </div>

            {shipping === 0 && (
              <p className="font-mono text-[10px] text-primary tracking-widest uppercase mt-3 text-center">
                ✓ Free shipping applied
              </p>
            )}
            {shipping > 0 && (
              <p className="font-mono text-[10px] text-gray-400 tracking-widest mt-3 text-center">
                Add ${(100 - cartTotal).toFixed(2)} more for free shipping
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
