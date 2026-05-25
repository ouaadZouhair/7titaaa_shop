import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'motion/react'
import { useCart } from '../context/CartContext'
import { useTranslation } from 'react-i18next'
import { resolveImageUrl } from '../lib/uploads'

export default function ProductCard({ product }) {
  const { addToCart } = useCart()
  const navigate = useNavigate()
  const { t } = useTranslation()
  const [hovered, setHovered] = useState(false)
  const [added, setAdded] = useState(false)

  const defaultSize = product.size || product.sizes?.[0] || 'M'

  const handleAdd = (e) => {
    e.preventDefault()
    addToCart(product, defaultSize)
    setAdded(true)
    setTimeout(() => setAdded(false), 1400)
  }

  const handleBuyNow = (e) => {
    e.preventDefault()
    addToCart(product, defaultSize)
    navigate('/checkout')
  }

  const isAvailable = product.isAvailable !== false

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : null

  return (
    <motion.div
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      className="group relative flex flex-col bg-transparent overflow-hidden"
    >
      <Link to={`/product/${product.id}`} className="block">

        {/* ── Image ── */}
        <div className="relative overflow-hidden aspect-[3/4]">
          <motion.img
            src={resolveImageUrl(product.image)}
            alt={product.name}
            className="w-full h-full object-cover"
            animate={{ scale: hovered ? 1.06 : 1 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            loading="lazy"
          />

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col items-start gap-1.5 z-10">
            {!isAvailable ? (
              <span className="bg-gray-700 text-white text-[9px] font-mono font-bold px-2.5 py-1 tracking-[0.25em] uppercase">
                Sold out
              </span>
            ) : (
              <>
                {product.isNew && (
                  <span className="bg-red-600 text-white text-[9px] font-mono font-bold px-2.5 py-1 tracking-[0.25em] uppercase">
                    {t('product.new')}
                  </span>
                )}
                {discount && (
                  <span className="bg-green-600 text-white text-[9px] font-mono font-bold px-2.5 py-1 tracking-[0.25em] uppercase">
                    -{discount}%
                  </span>
                )}
              </>
            )}
          </div>

          {/* Hover overlay — hidden when sold out */}
          <AnimatePresence>
            {hovered && isAvailable && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.22 }}
                className="absolute inset-0 z-10 flex flex-col items-center justify-end px-4 pb-5 gap-2.5"
                style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.18) 60%, transparent 100%)' }}
              >
                {/* Add to Cart */}
                <motion.button
                  initial={{ y: 14, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.04, duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                  onClick={handleAdd}
                  className="w-full py-3 text-[10px] font-mono tracking-[0.35em] uppercase font-bold transition-colors duration-200"
                  style={{
                    background: added ? '#4ade80' : '#ffffff',
                    color: added ? '#000' : '#000',
                  }}
                >
                  {added ? t('product.added') : t('product.addToCart')}
                </motion.button>

                {/* Buy Now */}
                <motion.button
                  initial={{ y: 14, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.1, duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                  onClick={handleBuyNow}
                  className="w-full py-3 text-[10px] font-mono tracking-[0.35em] uppercase font-bold border border-white/60 text-white hover:bg-white hover:text-black transition-colors duration-200"
                >
                  {t('product.buyNow')}
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ── Info ── */}
        <div className="px-3 pt-3 pb-4 flex items-start justify-between gap-3">
          <h3 className="font-mono text-xs tracking-[0.2em] uppercase text-neutral-900 leading-snug line-clamp-2 flex-1 font-bold">
            {product.name}
          </h3>
          <div className="flex flex-col items-end shrink-0">
            <span className="font-bold text-[13px] text-neutral-900 leading-tight">
              {product.price} DH
            </span>
            {product.originalPrice && (
              <span className="font-mono text-xs text-neutral-400 line-through leading-tight">
                {product.originalPrice} DH
              </span>
            )}
          </div>
        </div>

      </Link>
    </motion.div>
  )
}
