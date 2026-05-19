import { useState, useEffect, useRef } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useTranslation } from 'react-i18next'

const CATEGORIES = ['Hoodies', 'Sneakers', 'Caps', 'Tees', 'Jackets', 'Bottoms']

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [query, setQuery] = useState('')
  const inputRef = useRef(null)
  const { cartCount } = useCart()
  const { t, i18n } = useTranslation()
  const navigate = useNavigate()

  const isEN = i18n.language === 'en'

  const toggleLang = () => {
    const next = isEN ? 'fr' : 'en'
    i18n.changeLanguage(next)
    localStorage.setItem('7titaaa_lang', next)
  }

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  useEffect(() => {
    if (searchOpen) inputRef.current?.focus()
  }, [searchOpen])

  const closeSearch = () => {
    setSearchOpen(false)
    setQuery('')
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') { closeSearch(); return }
    if (e.key !== 'Enter') return
    const term = query.trim()
    if (!term) return
    closeSearch()
    const matched = CATEGORIES.find(c => c.toLowerCase() === term.toLowerCase())
    if (matched) {
      navigate(`/shop?category=${encodeURIComponent(matched)}`)
    } else {
      navigate(`/shop?search=${encodeURIComponent(term)}`)
    }
  }

  const links = [
    { to: '/', label: t('nav.home'), exact: true },
    { to: '/shop', label: t('nav.shop') },
    { to: '/contact', label: t('nav.contact') },
  ]

  return (
    <nav
      className={`fixed top-0 inset-x-0 z-50 transition-colors duration-300 hidden lg:block ${
        scrolled
          ? 'bg-street-black/95 backdrop-blur-md shadow-lg shadow-black/30'
          : 'bg-street-black'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">

        {/* LEFT — Nav links */}
        <div className="flex items-center gap-5">
          {links.map(({ to, label, exact }) => (
            <NavLink
              key={to}
              to={to}
              end={exact}
              className={({ isActive }) =>
                `font-mono text-xs tracking-widest uppercase transition-colors duration-200 ${
                  isActive ? 'text-primary-light' : 'text-white/60 hover:text-white'
                }`
              }
            >
              {label}
            </NavLink>
          ))}
        </div>

        {/* RIGHT */}
        <div className="flex items-center gap-5">

          {/* Language toggle pill */}
          <button
            onClick={toggleLang}
            aria-label="Toggle language"
            className="relative flex items-center h-6 rounded-full border border-white/20 bg-white/10 overflow-hidden"
            style={{ width: '3.75rem' }}
          >
            <span
              className="absolute top-0.5 bottom-0.5 w-[calc(50%-2px)] rounded-full bg-white transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]"
              style={{ left: isEN ? '2px' : 'calc(50%)' }}
            />
            <span className={`relative z-10 w-1/2 text-center font-mono text-[9px] tracking-widest uppercase transition-colors duration-200 ${isEN ? 'text-black' : 'text-white/50'}`}>
              EN
            </span>
            <span className={`relative z-10 w-1/2 text-center font-mono text-[9px] tracking-widest uppercase transition-colors duration-200 ${!isEN ? 'text-black' : 'text-white/50'}`}>
              FR
            </span>
          </button>

          {/* Search */}
          <div className="flex items-center gap-2">
            {searchOpen && (
              <>
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Search products, tags..."
                  className="w-52 bg-white/10 text-white placeholder-white/30 font-mono text-[11px] tracking-wider px-3 py-1.5 rounded-sm border border-white/20 outline-none focus:border-white/50 transition-all"
                />
                <button
                  onClick={closeSearch}
                  aria-label="Close search"
                  className="text-white/40 hover:text-white transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </>
            )}
            <button
              onClick={() => setSearchOpen(o => !o)}
              aria-label="Search"
              className="text-white/60 hover:text-white transition-colors"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
              </svg>
            </button>
          </div>

          {/* Cart */}
          <Link
            to="/checkout"
            className="relative flex items-center gap-2 text-white/70 hover:text-white transition-colors duration-200 hover:scale-105"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round"
                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-5 min-w-4.5 h-4.5 flex items-center justify-center rounded-full text-[10px] font-bold text-white bg-accent-red">
                {cartCount}
              </span>
            )}
          </Link>

        </div>
      </div>
    </nav>
  )
}
