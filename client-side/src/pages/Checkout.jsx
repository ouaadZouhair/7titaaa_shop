import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'motion/react'
import { useForm } from 'react-hook-form'
import { useCart } from '../context/CartContext'
import AnimatedButton from '../components/AnimatedButton'
import api from '../lib/api'
import { resolveImageUrl } from '../lib/uploads'

const WHATSAPP_NUMBER = '212704634570'

const MOROCCO_CITIES = [
  'Casablanca', 'Rabat', 'Marrakech', 'Fès', 'Tanger', 'Agadir', 'Meknès',
  'Oujda', 'Kénitra', 'Tétouan', 'Salé', 'Mohammedia', 'Khouribga',
  'Beni Mellal', 'El Jadida', 'Nador', 'Taza', 'Settat', 'Larache',
  'Khémisset', 'Guelmim', 'Berrechid', 'Khénifra', 'Taourirt', 'Tiznit',
  'Safi', 'Essaouira', 'Errachidia', 'Ouarzazate', 'Laâyoune',
]

export default function Checkout() {
  const { cartItems, removeFromCart, cartTotal, cartCount, clearCart } = useCart()
  const [step, setStep] = useState('cart') // 'cart' | 'shipping' | 'whatsapp' | 'confirmed'
  const [shippingData, setShippingData] = useState(null)
  const [orderRef, setOrderRef] = useState('')
  const [sending, setSending] = useState(false)
  const navigate = useNavigate()

  const { register, handleSubmit } = useForm()

  const shipping = 35
  const total = cartTotal + shipping

  const handleShipping = (data) => {
    setShippingData(data)
    setStep('whatsapp')
  }

  const handleSendWhatsApp = async () => {
    setSending(true)
    try {
      const { data } = await api.post('/orders', {
        firstName: shippingData.firstName,
        lastName: shippingData.lastName,
        phone: shippingData.phone,
        email: shippingData.email,
        address: shippingData.address,
        city: shippingData.city,
        subtotal: cartTotal,
        shipping,
        total,
        items: cartItems.map(item => ({
          id: item.id,
          name: item.name,
          price: item.price,
          image: item.image,
          category: item.category,
          size: item.size,
          type: item.type,
        })),
      })
      setOrderRef(data.order.ref)
    } catch {
      // order save failed — still proceed with WhatsApp
      setOrderRef(`7T-${Math.floor(Math.random() * 90000 + 10000)}`)
    }

    const itemLines = cartItems.map(item =>
      `• ${item.name} (${item.size}) — {item.price.toFixed(2)} DH DH\n  🖼️ ${item.image}`
    ).join('\n\n')

    const message = [
      '🛍️ NEW ORDER — 7titaaa',
      '',
      '👤 CLIENT:',
      `${shippingData.firstName} ${shippingData.lastName}`,
      `📞 ${shippingData.phone}`,
      shippingData.email,
      `📍 ${shippingData.address}, ${shippingData.city}`,
      '',
      '🛒 ITEMS:',
      itemLines,
      '',
      `💰 Subtotal: ${cartTotal.toFixed(2)} DH`,
      `🚚 Shipping: ${shipping.toFixed(2)} DH`,
      `✅ TOTAL: ${total.toFixed(2)} DH`,
    ].join('\n')

    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`
    window.open(url, '_blank')
    clearCart()
    setSending(false)
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
          <h2 className="font-display text-5xl text-street-black tracking-wide mb-4">ORDER SENT</h2>
          <p className="text-gray-500 text-sm leading-relaxed mb-2">
            Your order was sent via WhatsApp. We'll confirm it and get back to you shortly.
          </p>
          <p className="font-mono text-[10px] text-gray-400 tracking-widest uppercase mb-8">
            Ref #{orderRef}
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
          <div className="flex items-center gap-3 mt-4">
            {['Cart', 'Shipping', 'WhatsApp'].map((s, i) => {
              const stepKey = ['cart', 'shipping', 'whatsapp'][i]
              const isActive = step === stepKey
              const isDone = ['cart', 'shipping', 'whatsapp'].indexOf(step) > i
              return (
                <div key={s} className="flex items-center gap-3">
                  <span className={`font-mono text-[10px] tracking-widest uppercase ${
                    isActive ? 'text-primary-light' : isDone ? 'text-white/40 line-through' : 'text-white/20'
                  }`}>
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
        {/* LEFT PANEL */}
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
                            src={resolveImageUrl(item.image)}
                            alt={item.name}
                            className="w-20 h-24 object-cover rounded-sm shrink-0"
                          />
                        </Link>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <p className="font-mono text-[10px] tracking-widest text-gray-400 uppercase mb-1">
                                {item.category}
                              </p>
                              <h3 className="font-semibold text-sm text-street-black leading-tight">{item.name}</h3>
                              <p className="font-mono text-[10px] text-gray-400 mt-1 uppercase">
                                Size: {item.size}{item.type ? ` · ${item.type}` : ''}
                              </p>
                            </div>
                            <button
                              onClick={() => removeFromCart(item.id, item.size)}
                              className="text-gray-300 hover:text-accent-red transition-colors shrink-0"
                            >
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          </div>
                          <div className="flex items-center justify-end mt-3">
                            <span className="font-bold text-street-black">{item.price.toFixed(2)} DH</span>
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
                      <input {...register('firstName', { required: true })} placeholder="Yassine" className={inputClass} />
                    </div>
                    <div>
                      <label className="font-mono text-[10px] tracking-widest uppercase text-gray-500 block mb-2">Last Name</label>
                      <input {...register('lastName', { required: true })} placeholder="Alami" className={inputClass} />
                    </div>
                  </div>
                  <div>
                    <label className="font-mono text-[10px] tracking-widest uppercase text-gray-500 block mb-2">Phone</label>
                    <input
                      {...register('phone', { required: true })}
                      type="tel"
                      placeholder="+212 6XX XXX XXX"
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className="font-mono text-[10px] tracking-widest uppercase text-gray-500 block mb-2">Email</label>
                    <input {...register('email', { required: true })} type="email" placeholder="you@example.com" className={inputClass} />
                  </div>
                  <div>
                    <label className="font-mono text-[10px] tracking-widest uppercase text-gray-500 block mb-2">Address</label>
                    <input {...register('address', { required: true })} placeholder="123 Rue Mohammed V" className={inputClass} />
                  </div>
                  <div>
                    <label className="font-mono text-[10px] tracking-widest uppercase text-gray-500 block mb-2">City</label>
                    <select {...register('city', { required: true })} className={inputClass}>
                      <option value="">— Select your city —</option>
                      {MOROCCO_CITIES.map(city => (
                        <option key={city} value={city}>{city}</option>
                      ))}
                    </select>
                  </div>
                  <AnimatedButton type="submit" variant="dark" fullWidth className="py-4 mt-2">
                    Review & Send via WhatsApp →
                  </AnimatedButton>
                </form>
              </motion.div>
            )}

            {/* WHATSAPP STEP */}
            {step === 'whatsapp' && (
              <motion.div
                key="whatsapp"
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
                <h2 className="font-display text-3xl text-street-black tracking-wide mb-6">CONFIRM ORDER</h2>

                {shippingData && (
                  <div className="bg-white rounded-sm p-5 mb-4">
                    <p className="font-mono text-[10px] tracking-widest text-gray-400 uppercase mb-3">Shipping to</p>
                    <p className="text-sm font-semibold text-street-black">{shippingData.firstName} {shippingData.lastName}</p>
                    <p className="text-sm text-gray-500">{shippingData.phone}</p>
                    <p className="text-sm text-gray-500">{shippingData.email}</p>
                    <p className="text-sm text-gray-500">{shippingData.address}, {shippingData.city}</p>
                  </div>
                )}

                <div className="bg-white rounded-sm p-5 mb-4 space-y-4">
                  <p className="font-mono text-[10px] tracking-widest text-gray-400 uppercase">Items ({cartCount})</p>
                  {cartItems.map(item => (
                    <div key={`${item.id}-${item.size}`} className="flex gap-4 items-center">
                      <img src={resolveImageUrl(item.image)} alt={item.name} className="w-16 h-20 object-cover rounded-sm shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-street-black leading-tight">{item.name}</p>
                        <p className="font-mono text-[10px] text-gray-400 mt-1 uppercase">
                          Size: {item.size}{item.type ? ` · ${item.type}` : ''}
                        </p>
                      </div>
                      <span className="text-sm font-bold text-street-black">{item.price.toFixed(2)} DH</span>
                    </div>
                  ))}
                </div>

                <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-sm mb-5">
                  <svg className="w-4 h-4 text-green-600 shrink-0" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                    <path d="M12 0C5.373 0 0 5.373 0 12c0 2.126.553 4.122 1.523 5.854L.057 23.886a.5.5 0 00.606.63l6.257-1.641A11.93 11.93 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.9a9.876 9.876 0 01-5.031-1.373l-.36-.214-3.733.979 1.003-3.628-.235-.374A9.86 9.86 0 012.1 12C2.1 6.533 6.533 2.1 12 2.1S21.9 6.533 21.9 12 17.467 21.9 12 21.9z"/>
                  </svg>
                  <p className="font-mono text-[10px] tracking-widest text-green-700 uppercase">
                    Clicking below opens WhatsApp with your full order details
                  </p>
                </div>

                <AnimatedButton
                  variant="gradient"
                  onClick={handleSendWhatsApp}
                  fullWidth
                  className="py-4 text-base"
                  disabled={sending}
                >
                  {sending ? 'Saving…' : `Send Order on WhatsApp — ${total.toFixed(2)} DH`}
                </AnimatedButton>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ORDER SUMMARY */}
        <div>
          <div className="bg-white rounded-sm p-6 sticky top-24">
            <h3 className="font-display text-2xl text-street-black tracking-wide mb-5">ORDER SUMMARY</h3>

            <div className="space-y-3 mb-5">
              {cartItems.map(item => (
                <div key={`${item.id}-${item.size}`} className="flex gap-3 items-center">
                  <img src={resolveImageUrl(item.image)} alt={item.name} className="w-12 h-14 object-cover rounded-sm shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-street-black truncate">{item.name}</p>
                    <p className="font-mono text-[10px] text-gray-400 uppercase">
                      {item.size}{item.type ? ` · ${item.type}` : ''}
                    </p>
                  </div>
                  <span className="text-sm font-semibold shrink-0">{item.price.toFixed(2)} DH</span>
                </div>
              ))}
            </div>

            <div className="border-t border-gray-100 pt-4 space-y-2">
              {[
                { label: 'Subtotal', value: `${cartTotal.toFixed(2)} DH` },
                { label: 'Shipping', value: `${shipping.toFixed(2)} DH` },
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
                <span className="font-display text-2xl text-street-black">{total.toFixed(2)} DH</span>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}
