import { useState, useEffect, useRef, useMemo } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { AnimatePresence, motion } from 'motion/react'
import { useCart } from '../context/CartContext'
import api from '../lib/api'

const searchIcon = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-6 h-6">
    <path strokeLinecap="round" strokeLinejoin="round"
      d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
  </svg>
)

const tabs = [
  {
    to: '/',
    labelKey: 'nav.home',
    exact: true,
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round"
          d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    ),
  },
  {
    to: '/shop',
    labelKey: 'nav.shop',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round"
          d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
      </svg>
    ),
  },
  {
    to: '/contact',
    labelKey: 'nav.contact',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round"
          d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    to: '/checkout',
    labelKey: 'nav.cart',
    isCart: true,
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round"
          d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
  },
]

export default function BottomNav() {
  const { cartCount } = useCart()
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [searchOpen, setSearchOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [products, setProducts] = useState([])
  const [loaded, setLoaded] = useState(false)
  const inputRef = useRef(null)

  useEffect(() => {
    if (searchOpen) inputRef.current?.focus()
  }, [searchOpen])

  // Fetch products once, the first time the search overlay is opened.
  useEffect(() => {
    if (!searchOpen || loaded) return
    let cancelled = false
    api.get('/products', { params: { limit: 200 } }).then(
      ({ data }) => {
        if (cancelled) return
        setProducts(Array.isArray(data?.items) ? data.items : [])
        setLoaded(true)
      },
      () => { if (!cancelled) setLoaded(true) }
    )
    return () => { cancelled = true }
  }, [searchOpen, loaded])

  // Unique, available categories and tags derived from the live products.
  const { categories, tags } = useMemo(() => {
    const catSet = new Set()
    const tagSet = new Set()
    for (const p of products) {
      if (p.isAvailable === false) continue
      if (p.category) catSet.add(p.category)
      if (Array.isArray(p.tags)) {
        for (const tag of p.tags) {
          const clean = String(tag).trim()
          if (clean) tagSet.add(clean)
        }
      }
    }
    return {
      categories: [...catSet].sort((a, b) => a.localeCompare(b)),
      tags: [...tagSet].sort((a, b) => a.localeCompare(b)),
    }
  }, [products])

  const closeSearch = () => {
    setSearchOpen(false)
    setQuery('')
  }

  const submitSearch = () => {
    const term = query.trim()
    if (!term) return
    closeSearch()
    const matched = categories.find(c => c.toLowerCase() === term.toLowerCase())
    if (matched) {
      navigate(`/shop?category=${encodeURIComponent(matched)}`)
    } else {
      navigate(`/shop?search=${encodeURIComponent(term)}`)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') closeSearch()
    if (e.key === 'Enter') submitSearch()
  }

  return (
    <>
      {/* Mobile search overlay */}
      <AnimatePresence>
        {searchOpen && (
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 24 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="lg:hidden fixed inset-0 z-[60] bg-street-black/95 backdrop-blur-md flex flex-col"
        >
          <div className="flex items-center gap-3 px-4 pt-6 pb-4 border-b border-white/10">
            <div className="flex-1 flex items-center gap-2 bg-white/10 rounded-sm border border-white/20 px-3 focus-within:border-white/50 transition-colors">
              <span className="text-white/40">{searchIcon}</span>
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={e => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={t('common.search')}
                className="flex-1 bg-transparent text-white placeholder-white/30 font-mono text-sm tracking-wider py-3 outline-none"
              />
              {query && (
                <button
                  onClick={() => setQuery('')}
                  aria-label={t('common.clear')}
                  className="text-white/40 hover:text-white transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
            <button
              onClick={closeSearch}
              className="font-mono text-[10px] tracking-widest uppercase text-white/60 hover:text-white transition-colors"
            >
              {t('common.close')}
            </button>
          </div>

          {/* Available categories & tags */}
          <div className="flex-1 overflow-y-auto px-4 py-5 space-y-6">
            {/* Categories */}
            {categories.length > 0 && (
              <div>
                <p className="font-mono text-[9px] tracking-widest uppercase text-white/30 mb-3">
                  {t('common.categories')}
                </p>
                <div className="flex flex-wrap gap-2">
                  {categories.map(cat => (
                    <button
                      key={cat}
                      onClick={() => {
                        closeSearch()
                        navigate(`/shop?category=${encodeURIComponent(cat)}`)
                      }}
                      className="font-mono text-[11px] tracking-wider uppercase text-white/70 bg-white/5 hover:bg-white/15 border border-white/10 rounded-sm px-3 py-2 transition-colors"
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Tags */}
            {tags.length > 0 && (
              <div>
                <p className="font-mono text-[9px] tracking-widest uppercase text-white/30 mb-3">
                  {t('common.tags')}
                </p>
                <div className="flex flex-wrap gap-2">
                  {tags.map(tag => (
                    <button
                      key={tag}
                      onClick={() => {
                        closeSearch()
                        navigate(`/shop?search=${encodeURIComponent(tag)}`)
                      }}
                      className="font-mono text-[11px] tracking-wider text-white/60 bg-transparent hover:bg-white/10 border border-white/10 rounded-full px-3 py-1.5 transition-colors"
                    >
                      #{tag}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {loaded && categories.length === 0 && tags.length === 0 && (
              <p className="font-mono text-[11px] tracking-wider text-white/30">
                {t('shop.noItems')}
              </p>
            )}
          </div>
        </motion.div>
        )}
      </AnimatePresence>

      <nav className="lg:hidden fixed bottom-0 inset-x-0 z-50 bg-street-black border-t border-white/10">
        <div className="flex items-stretch h-16">
          {tabs.map(({ to, labelKey, exact, icon, isCart }) => (
            <NavLink
              key={to}
              to={to}
              end={exact}
              className={({ isActive }) =>
                `flex-1 flex flex-col items-center justify-center gap-0.5 transition-colors duration-200 ${
                  isActive ? 'text-primary-light' : 'text-white/40 hover:text-white/70'
                }`
              }
            >
              <span className="relative">
                {icon}
                {isCart && cartCount > 0 && (
                  <span
                    className="absolute -top-1.5 -right-1.5 min-w-[16px] h-4 flex items-center justify-center rounded-full text-[9px] font-bold text-white px-0.5"
                    style={{ background: 'linear-gradient(135deg,#16a34a,#f97316)' }}
                  >
                    {cartCount}
                  </span>
                )}
              </span>
              <span className="font-mono text-[9px] tracking-widest uppercase">{t(labelKey)}</span>
            </NavLink>
          ))}

          {/* Search tab */}
          <button
            onClick={() => setSearchOpen(true)}
            className={`flex-1 flex flex-col items-center justify-center gap-0.5 transition-colors duration-200 ${
              searchOpen ? 'text-primary-light' : 'text-white/40 hover:text-white/70'
            }`}
          >
            <span className="relative">{searchIcon}</span>
            <span className="font-mono text-[9px] tracking-widest uppercase">{t('common.searchTab')}</span>
          </button>
        </div>
      </nav>
    </>
  )
}
