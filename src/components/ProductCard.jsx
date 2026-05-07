import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'motion/react'
import { useCart } from '../context/CartContext'

export default function ProductCard({ product }) {
  const { addToCart } = useCart()
  const [hovered, setHovered] = useState(false)
  const [added, setAdded] = useState(false)

  const handleAdd = (e) => {
    e.preventDefault()
    addToCart(product, product.sizes[2] || product.sizes[0])
    setAdded(true)
    setTimeout(() => setAdded(false), 1400)
  }

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : null

  return (
    <motion.div
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      whileHover={{ y: -6 }}
      transition={{ type: 'spring', stiffness: 300, damping: 22 }}
      className="group relative flex flex-col bg-white rounded-sm overflow-hidden shadow-sm hover:shadow-xl hover:shadow-black/10 transition-shadow duration-300"
    >
      <Link to={`/product/${product.id}`} className="block">
        {/* Image wrapper */}
        <div className="relative overflow-hidden aspect-[3/4] bg-gray-100">
          <motion.img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover"
            animate={{ scale: hovered ? 1.08 : 1 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            loading="lazy"
          />

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5">
            {product.isNew && (
              <span className="bg-primary text-white text-[10px] font-mono font-bold px-2 py-1 rounded-sm tracking-wider uppercase">
                NEW
              </span>
            )}
            {discount && (
              <span className="bg-accent-red text-white text-[10px] font-mono font-bold px-2 py-1 rounded-sm tracking-wider uppercase">
                -{discount}%
              </span>
            )}
          </div>

          {/* Hover overlay */}
          <AnimatePresence>
            {hovered && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="absolute inset-0 bg-black/20"
              />
            )}
          </AnimatePresence>

          {/* Add to cart slide-up */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: hovered ? 0 : '100%' }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            className="absolute bottom-0 inset-x-0"
          >
            <button
              onClick={handleAdd}
              className="w-full py-3.5 font-semibold text-sm tracking-widest uppercase text-white transition-all duration-200"
              style={{
                background: added
                  ? '#16a34a'
                  : 'linear-gradient(90deg,#0a0a0a 0%,#1a1a1a 100%)',
              }}
            >
              {added ? '✓ Added' : 'Add to Cart'}
            </button>
          </motion.div>
        </div>

        {/* Info */}
        <div className="p-4">
          <p className="font-mono text-[10px] text-gray-400 uppercase tracking-widest mb-1">
            {product.category}
          </p>
          <h3 className="font-semibold text-sm text-street-black leading-tight mb-2 line-clamp-1">
            {product.name}
          </h3>
          <div className="flex items-center gap-2">
            <span className="font-bold text-street-black">${product.price}</span>
            {product.originalPrice && (
              <span className="text-gray-400 text-sm line-through">
                ${product.originalPrice}
              </span>
            )}
          </div>
          {/* Rating */}
          <div className="flex items-center gap-1 mt-2">
            <div className="flex">
              {[1, 2, 3, 4, 5].map(s => (
                <svg
                  key={s}
                  className={`w-3 h-3 ${s <= Math.round(product.rating) ? 'text-accent-orange' : 'text-gray-200'}`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <span className="text-[10px] text-gray-400 font-mono">({product.reviews})</span>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}
