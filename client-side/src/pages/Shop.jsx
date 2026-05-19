import { useState, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'motion/react'
import { useProducts } from '../hooks/useProducts'
import vintageStore from '../assets/photos/clothes.jpg'
import ProductCard from '../components/ProductCard'
import SkeletonCard from '../components/SkeletonCard'

const ALL_CATEGORIES = ['All', 'Hoodies', 'Sneakers', 'Caps', 'Tees', 'Jackets', 'Bottoms']
const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest First' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'rating', label: 'Top Rated' },
]

export default function Shop() {
  const [searchParams, setSearchParams] = useSearchParams()
  const initCategory = searchParams.get('category') || 'All'

  const [activeCategory, setActiveCategory] = useState(initCategory)
  const [sort, setSort] = useState('newest')
  const [priceRange, setPriceRange] = useState([0, 300])
  const [filtersOpen, setFiltersOpen] = useState(false)

  const handleCategory = (cat) => {
    setActiveCategory(cat)
    if (cat !== 'All') setSearchParams({ category: cat })
    else setSearchParams({})
  }

  const { items, loading } = useProducts({
    category: activeCategory !== 'All' ? activeCategory : undefined,
    limit: 100,
  })

  const filtered = useMemo(() => {
    let list = [...items]
    list = list.filter(p => p.price >= priceRange[0] && p.price <= priceRange[1])
    if (sort === 'price-asc') list.sort((a, b) => a.price - b.price)
    else if (sort === 'price-desc') list.sort((a, b) => b.price - a.price)
    else if (sort === 'rating') list.sort((a, b) => b.rating - a.rating)
    else list.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0))
    return list
  }, [items, sort, priceRange])

  return (
    <div className="min-h-screen bg-white">
      {/* Page header */}
      <div className="relative py-24 px-6 overflow-hidden">
        {/* Background image */}
        <img
          src={vintageStore}
          alt="Vintage store"
          className="absolute inset-0 w-full h-full object-cover object-top"
        />
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black/60" />

        <div className="relative z-10 max-w-7xl mx-auto">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-mono text-[11px] tracking-[0.5em] text-primary-light uppercase mb-3"
          >
            Browse
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="font-display text-6xl md:text-7xl text-white tracking-wide"
          >
            THE SHOP
          </motion.h1>
          {/* <p className="text-white/40 mt-2 font-light">
            {filtered.length} {filtered.length === 1 ? 'item' : 'items'} found
          </p> */}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-10">
        {/* Filter bar */}
        <div className="flex flex-wrap items-center gap-3 mb-8">
          {/* Category pills */}
          <div className="flex flex-wrap gap-2 flex-1">
            {ALL_CATEGORIES.map(cat => (
              <motion.button
                key={cat}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => handleCategory(cat)}
                className={`px-4 py-2 rounded-sm font-mono text-[11px] tracking-widest uppercase transition-all duration-200 ${
                  activeCategory === cat
                    ? 'bg-street-black text-white'
                    : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                }`}
              >
                {cat}
              </motion.button>
            ))}
          </div>

          {/* Sort + Filter toggle */}
          <div className="flex items-center gap-3">
            <select
              value={sort}
              onChange={e => setSort(e.target.value)}
              className="appearance-none bg-gray-100 text-gray-700 text-xs font-mono tracking-wider px-4 py-2.5 rounded-sm cursor-pointer border-0 outline-none"
            >
              {SORT_OPTIONS.map(o => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>

            <button
              onClick={() => setFiltersOpen(o => !o)}
              className="flex items-center gap-2 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 rounded-sm font-mono text-[11px] tracking-widest uppercase transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 4h18M7 8h10M10 12h4" />
              </svg>
              Filters
            </button>
          </div>
        </div>

        {/* Expandable price filter */}
        <AnimatePresence>
          {filtersOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="bg-gray-50 rounded-sm p-6 mb-8 flex flex-wrap gap-8">
                <div>
                  <p className="font-mono text-[10px] tracking-widest text-gray-400 uppercase mb-3">
                    Price Range
                  </p>
                  <div className="flex items-center gap-4">
                    <span className="font-mono text-sm text-gray-600">${priceRange[0]}</span>
                    <input
                      type="range"
                      min={0}
                      max={300}
                      step={10}
                      value={priceRange[1]}
                      onChange={e => setPriceRange([priceRange[0], +e.target.value])}
                      className="w-40 accent-primary"
                    />
                    <span className="font-mono text-sm text-gray-600">${priceRange[1]}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Product grid */}
        <motion.div
          layout
          className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
        >
          {loading ? (
            Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)
          ) : (
            <AnimatePresence mode="popLayout">
              {filtered.length === 0 ? (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="col-span-full py-20 text-center"
                >
                  <p className="font-display text-4xl text-gray-200 mb-3">NO ITEMS FOUND</p>
                  <p className="text-gray-400 text-sm">Try adjusting your filters.</p>
                </motion.div>
              ) : (
                filtered.map((product, i) => (
                  <motion.div
                    key={product.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ delay: i * 0.05, duration: 0.4 }}
                  >
                    <ProductCard product={product} />
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          )}
        </motion.div>
      </div>
    </div>
  )
}
