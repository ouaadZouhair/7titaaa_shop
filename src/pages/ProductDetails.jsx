import { useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'motion/react'
import { products } from '../data/products'
import { useCart } from '../context/CartContext'
import ProductCard from '../components/ProductCard'
import AnimatedButton from '../components/AnimatedButton'

export default function ProductDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { addToCart } = useCart()

  const product = products.find(p => p.id === parseInt(id))

  const [activeImg, setActiveImg] = useState(0)
  const [selectedSize, setSelectedSize] = useState(null)
  const [quantity, setQuantity] = useState(1)
  const [added, setAdded] = useState(false)
  const [sizeError, setSizeError] = useState(false)

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="font-display text-5xl text-gray-200">PRODUCT NOT FOUND</p>
        <Link to="/shop" className="text-primary underline text-sm">Back to Shop</Link>
      </div>
    )
  }

  const related = products.filter(p => p.category === product.category && p.id !== product.id).slice(0, 4)
  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : null

  const handleAddToCart = () => {
    if (!selectedSize) { setSizeError(true); return }
    setSizeError(false)
    addToCart(product, selectedSize, quantity)
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
            {product.images.map((img, i) => (
              <motion.button
                key={i}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setActiveImg(i)}
                className={`flex-shrink-0 w-16 h-20 sm:w-20 sm:h-24 rounded-sm overflow-hidden border-2 transition-colors ${
                  activeImg === i ? 'border-primary' : 'border-transparent'
                }`}
              >
                <img src={img} alt="" className="w-full h-full object-cover" />
              </motion.button>
            ))}
          </div>

          {/* Main image */}
          <div className="flex-1 relative rounded-sm overflow-hidden aspect-[4/5] bg-gray-100">
            <AnimatePresence mode="wait">
              <motion.img
                key={activeImg}
                src={product.images[activeImg]}
                alt={product.name}
                className="w-full h-full object-cover"
                initial={{ opacity: 0, scale: 1.03 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.35 }}
              />
            </AnimatePresence>

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

          {/* Rating */}
          <div className="flex items-center gap-2 mb-6">
            <div className="flex">
              {[1, 2, 3, 4, 5].map(s => (
                <svg
                  key={s}
                  className={`w-4 h-4 ${s <= Math.round(product.rating) ? 'text-accent-orange' : 'text-gray-200'}`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <span className="font-mono text-xs text-gray-400">
              {product.rating} ({product.reviews} reviews)
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

          {/* Size selector */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <p className="font-mono text-[10px] tracking-widest uppercase text-gray-500">
                Size {selectedSize && `— ${selectedSize}`}
              </p>
              {sizeError && (
                <motion.p
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="font-mono text-[10px] text-accent-red tracking-wider"
                >
                  Please select a size
                </motion.p>
              )}
            </div>
            <div className="flex flex-wrap gap-2">
              {product.sizes.map(size => (
                <motion.button
                  key={size}
                  whileHover={{ scale: 1.06 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => { setSelectedSize(size); setSizeError(false) }}
                  className={`min-w-[48px] px-3 py-2.5 rounded-sm border font-mono text-xs tracking-wider transition-all duration-200 ${
                    selectedSize === size
                      ? 'bg-street-black text-white border-street-black'
                      : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400'
                  }`}
                >
                  {size}
                </motion.button>
              ))}
            </div>
          </div>

          {/* Quantity */}
          <div className="mb-8">
            <p className="font-mono text-[10px] tracking-widest uppercase text-gray-500 mb-3">Quantity</p>
            <div className="inline-flex items-center border border-gray-200 rounded-sm">
              <button
                onClick={() => setQuantity(q => Math.max(1, q - 1))}
                className="w-10 h-10 flex items-center justify-center text-gray-500 hover:text-street-black hover:bg-gray-50 transition-colors"
              >
                −
              </button>
              <span className="w-12 text-center font-mono text-sm">{quantity}</span>
              <button
                onClick={() => setQuantity(q => q + 1)}
                className="w-10 h-10 flex items-center justify-center text-gray-500 hover:text-street-black hover:bg-gray-50 transition-colors"
              >
                +
              </button>
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
              { label: 'Colors', value: product.colors.join(', ') },
              { label: 'Category', value: product.category },
              { label: 'Tags', value: product.tags.join(', ') },
            ].map(({ label, value }) => (
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
