import { useState, useMemo, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'motion/react'
import { useTranslation } from 'react-i18next'
import { useProducts } from '../hooks/useProducts'
import { categories } from '../data/products'
import vintageStore from '../assets/photos/clothes.jpg'
import ProductCard from '../components/ProductCard'
import SkeletonCard from '../components/SkeletonCard'

const ALL_CATEGORIES = ['All', ...categories.map(c => c.name)]
const SORT_OPTIONS = [
  { value: 'newest', labelKey: 'shop.sort.newest' },
  { value: 'price-asc', labelKey: 'shop.sort.priceAsc' },
  { value: 'price-desc', labelKey: 'shop.sort.priceDesc' },
  { value: 'rating', labelKey: 'shop.sort.rating' },
]

export default function Shop() {
  const { t } = useTranslation()
  const [searchParams, setSearchParams] = useSearchParams()

  const [activeCategory, setActiveCategory] = useState(searchParams.get('category') || 'All')
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '')
  const [sort, setSort] = useState('newest')
  const [priceRange, setPriceRange] = useState([0, 3000])
  const [qualityFilter, setQualityFilter] = useState(0) // 0 = all, 1-5 = minimum stars
  const [filtersOpen, setFiltersOpen] = useState(false)

  useEffect(() => {
    const cat = searchParams.get('category') || 'All'
    const q = searchParams.get('search') || ''
    setActiveCategory(cat)
    setSearchQuery(q)
  }, [searchParams])

  const handleCategory = (cat) => {
    setActiveCategory(cat)
    setSearchQuery('')
    if (cat !== 'All') setSearchParams({ category: cat })
    else setSearchParams({})
  }

  const clearSearch = () => {
    setSearchQuery('')
    setSearchParams({})
  }

  const { items, loading } = useProducts({
    category: searchQuery ? undefined : (activeCategory !== 'All' ? activeCategory : undefined),
    search: searchQuery || undefined,
    limit: 100,
  })

  const filtered = useMemo(() => {
    let list = [...items]
    list = list.filter(p => p.price >= priceRange[0] && p.price <= priceRange[1])
    if (qualityFilter > 0) list = list.filter(p => (p.quality ?? 5) === qualityFilter)
    if (sort === 'price-asc') list.sort((a, b) => a.price - b.price)
    else if (sort === 'price-desc') list.sort((a, b) => b.price - a.price)
    else if (sort === 'rating') list.sort((a, b) => b.rating - a.rating)
    else list.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0))
    return list
  }, [items, sort, priceRange, qualityFilter])

  return (
    <div className="min-h-screen bg-white">
      {/* Page header */}
      <div className="relative py-24 px-6 overflow-hidden">
        <img
          src={vintageStore}
          alt="Vintage store"
          className="absolute inset-0 w-full h-full object-cover object-top"
        />
        <div className="absolute inset-0 bg-black/60" />
        <div className="relative z-10 max-w-7xl mx-auto">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-mono text-[11px] tracking-[0.5em] text-primary-light uppercase mb-3"
          >
            {t('shop.browse')}
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="font-display text-6xl md:text-7xl text-white tracking-wide"
          >
            {t('shop.title')}
          </motion.h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-10">

        {/* Search results indicator */}
        {searchQuery && (
          <div className="flex items-center gap-3 mb-6">
            <span className="font-mono text-xs tracking-widest text-gray-400 uppercase">
              {t('shop.resultsFor')}
            </span>
            <span className="font-mono text-xs tracking-widest uppercase bg-street-black text-white px-3 py-1 rounded-sm">
              "{searchQuery}"
            </span>
            <button
              onClick={clearSearch}
              aria-label={t('shop.clearSearch')}
              className="text-gray-400 hover:text-gray-700 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}

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
                  !searchQuery && activeCategory === cat
                    ? 'bg-street-black text-white'
                    : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                }`}
              >
                {t(`shop.categories.${cat}`)}
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
                <option key={o.value} value={o.value}>{t(o.labelKey)}</option>
              ))}
            </select>

            <button
              onClick={() => setFiltersOpen(o => !o)}
              className="flex items-center gap-2 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 rounded-sm font-mono text-[11px] tracking-widest uppercase transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 4h18M7 8h10M10 12h4" />
              </svg>
              {t('shop.filters')}
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
              <div className="bg-gray-50 rounded-sm p-6 mb-8 flex flex-wrap gap-10">
                {/* Price range */}
                <div>
                  <p className="font-mono text-[10px] tracking-widest text-gray-400 uppercase mb-3">
                    {t('shop.priceRange')}
                  </p>
                  <div className="flex items-center gap-4">
                    <span className="font-mono text-sm text-gray-600">{priceRange[0]} DH</span>
                    <input
                      type="range"
                      min={0}
                      max={3000}
                      step={50}
                      value={priceRange[1]}
                      onChange={e => setPriceRange([priceRange[0], +e.target.value])}
                      className="w-40 accent-primary"
                    />
                    <span className="font-mono text-sm text-gray-600">{priceRange[1]} DH</span>
                  </div>
                </div>

                {/* Quality filter */}
                <div>
                  <p className="font-mono text-[10px] tracking-widest text-gray-400 uppercase mb-3">
                    {t('shop.minQuality')}
                  </p>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map(star => (
                      <button
                        key={star}
                        onClick={() => setQualityFilter(qualityFilter === star ? 0 : star)}
                        className="p-0.5 transition-transform hover:scale-110 focus:outline-none"
                        aria-label={`Filter by ${star} star minimum`}
                      >
                        <svg
                          className={`w-6 h-6 transition-colors ${star <= qualityFilter ? 'text-amber-400' : 'text-gray-300 hover:text-amber-200'}`}
                          viewBox="0 0 24 24"
                          fill="currentColor"
                        >
                          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                        </svg>
                      </button>
                    ))}
                    {qualityFilter > 0 && (
                      <button
                        onClick={() => setQualityFilter(0)}
                        className="ml-2 font-mono text-[10px] tracking-widest text-gray-400 hover:text-gray-700 uppercase transition-colors"
                      >
                        {t('shop.clear')}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Product grid */}
        <motion.div
          layout
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
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
                  <p className="font-display text-4xl text-gray-200 mb-3">{t('shop.noItems')}</p>
                  <p className="text-gray-400 text-sm">{t('shop.tryAdjusting')}</p>
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
