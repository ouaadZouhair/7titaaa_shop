import { useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'motion/react'
import { useProduct, useProducts } from '../hooks/useProducts'
import { useCart } from '../context/CartContext'
import ProductCard from '../components/ProductCard'
import AnimatedButton from '../components/AnimatedButton'
import { resolveImageUrl } from '../lib/uploads'

export default function ProductDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { addToCart } = useCart()

  const { product, loading } = useProduct(id)
  const { items: relatedAll } = useProducts({
    category: product?.category,
    limit: 8,
  })

  const [activeImg, setActiveImg] = useState(0)
  const [added, setAdded] = useState(false)
  const [zoom, setZoom] = useState({ active: false, x: 50, y: 50 })

  const handleZoomMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100
    setZoom({ active: true, x, y })
  }
  const handleZoomLeave = () => setZoom((z) => ({ ...z, active: false }))

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="font-mono text-[10px] tracking-widest uppercase text-gray-400">Loading…</p>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="font-display text-5xl text-gray-200">PRODUCT NOT FOUND</p>
        <Link to="/shop" className="text-primary underline text-sm">Back to Shop</Link>
      </div>
    )
  }

  const related = relatedAll.filter(p => p.id !== product.id).slice(0, 4)
  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : null
  const defaultSize = product.size || 'M'
  const gallery = product.images?.length ? product.images : [product.image]

  const handleAddToCart = () => {
    addToCart(product, defaultSize, 1)
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-6 pt-8 pb-2">
        <nav className="flex items-center gap-2 font-mono text-[10px] tracking-widest uppercase text-gray-400">
          <Link to="/" className="hover:text-primary transition-colors">Home</Link>
          <span>/</span>
          <Link to="/shop" className="hover:text-primary transition-colors">Shop</Link>
          <span>/</span>
          <span className="text-street-black">{product.name}</span>
        </nav>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        {/* ─── IMAGE GALLERY ─── */}
        <div className="flex flex-col-reverse sm:flex-row gap-4">
          {/* Thumbnails */}
          <div className="flex sm:flex-col gap-2 overflow-x-auto sm:overflow-y-auto">
            {gallery.map((img, i) => (
              <motion.button
                key={i}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setActiveImg(i)}
                className={`flex-shrink-0 w-16 h-20 sm:w-20 sm:h-24 rounded-sm overflow-hidden border-2 transition-colors ${
                  activeImg === i ? 'border-primary' : 'border-transparent'
                }`}
              >
                <img src={resolveImageUrl(img)} alt="" className="w-full h-full object-cover" />
              </motion.button>
            ))}
          </div>

          {/* Main image */}
          <div
            className="flex-1 relative rounded-sm overflow-hidden aspect-[4/5] bg-gray-100 cursor-zoom-in"
            onMouseMove={handleZoomMove}
            onMouseLeave={handleZoomLeave}
          >
            <AnimatePresence mode="wait">
              <motion.img
                key={activeImg}
                src={resolveImageUrl(gallery[activeImg])}
                alt={product.name}
                className="w-full h-full object-cover transition-transform duration-200 ease-out will-change-transform pointer-events-none"
                style={{
                  transformOrigin: `${zoom.x}% ${zoom.y}%`,
                  transform: zoom.active ? 'scale(2.4)' : 'scale(1)',
                }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.35 }}
              />
            </AnimatePresence>

            {/* Zoom hint */}
            <div
              className={`absolute bottom-3 right-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-sm text-white font-mono text-[9px] tracking-widest uppercase pointer-events-none transition-opacity duration-200 ${
                zoom.active ? 'opacity-0' : 'opacity-100'
              }`}
            >
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M10 18a8 8 0 100-16 8 8 0 000 16zm-3-8h6m-3-3v6" />
              </svg>
              Hover to zoom
            </div>

            {/* Badges */}
            <div className="absolute top-4 left-4 flex flex-col gap-2">
              {product.isNew && (
                <span className="bg-primary text-white text-[10px] font-mono font-bold px-2.5 py-1.5 rounded-sm tracking-wider uppercase">
                  NEW
                </span>
              )}
              {discount && (
                <span className="bg-accent-red text-white text-[10px] font-mono font-bold px-2.5 py-1.5 rounded-sm tracking-wider uppercase">
                  -{discount}%
                </span>
              )}
            </div>
          </div>
        </div>

        {/* ─── PRODUCT INFO ─── */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <p className="font-mono text-[10px] tracking-[0.4em] text-primary uppercase mb-2">
            {product.category}
          </p>
          <h1 className="font-display text-4xl md:text-5xl text-street-black tracking-wide mb-4">
            {product.name.toUpperCase()}
          </h1>

          {/* Quality */}
          <div className="flex items-center gap-2 mb-6">
            <span className="font-mono text-[10px] tracking-widest uppercase text-gray-400">Quality</span>
            <span className="font-mono text-[10px] tracking-widest uppercase text-primary font-bold">
              — 10/10
            </span>
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-3 mb-6">
            <span className="font-display text-4xl text-street-black">${product.price}</span>
            {product.originalPrice && (
              <span className="text-gray-400 text-lg line-through">${product.originalPrice}</span>
            )}
          </div>

          {/* Description */}
          <p className="text-gray-500 leading-relaxed mb-8 text-sm">{product.description}</p>

          {/* Size & Quantity — fixed */}
          <div className="flex gap-6 mb-8">
            <div>
              <p className="font-mono text-[10px] tracking-widest uppercase text-gray-400 mb-2">Size</p>
              <span className="inline-block px-4 py-2 border border-gray-200 rounded-sm font-mono text-xs text-street-black bg-gray-50">
                {defaultSize}
              </span>
            </div>
            <div>
              <p className="font-mono text-[10px] tracking-widest uppercase text-gray-400 mb-2">Quantity</p>
              <span className="inline-block px-4 py-2 border border-gray-200 rounded-sm font-mono text-xs text-street-black bg-gray-50">
                1
              </span>
            </div>
          </div>

          {/* CTA buttons */}
          <div className="flex flex-col sm:flex-row gap-3 mb-8">
            <AnimatedButton
              variant={added ? 'primary' : 'dark'}
              onClick={handleAddToCart}
              fullWidth
              className="py-4"
            >
              {added ? '✓ Added to Cart!' : 'Add to Cart'}
            </AnimatedButton>
            <AnimatedButton
              variant="gradient"
              onClick={() => { handleAddToCart(); navigate('/checkout') }}
              fullWidth
              className="py-4"
            >
              Buy Now
            </AnimatedButton>
          </div>

          {/* Meta */}
          <div className="border-t border-gray-100 pt-6 space-y-2">
            {[
              { label: 'Category', value: product.category },
              { label: 'Tags', value: (product.tags || []).join(', ') },
            ]
              .filter((m) => m.value)
              .map(({ label, value }) => (
                <div key={label} className="flex gap-2 text-sm">
                  <span className="font-mono text-[10px] tracking-widest uppercase text-gray-400 w-20 pt-0.5">
                    {label}
                  </span>
                  <span className="text-gray-600 flex-1">{value}</span>
                </div>
              ))}
          </div>
        </motion.div>
      </div>

      {/* ─── RELATED PRODUCTS ─── */}
      {related.length > 0 && (
        <section className="py-16 px-6 bg-gray-50">
          <div className="max-w-7xl mx-auto">
            <div className="mb-8">
              <p className="font-mono text-[10px] tracking-[0.5em] text-primary uppercase mb-2">You May Also Like</p>
              <h2 className="font-display text-4xl text-street-black tracking-wide">RELATED PIECES</h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {related.map((p, i) => (
                <motion.div
                  key={p.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                >
                  <ProductCard product={p} />
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  )
}
