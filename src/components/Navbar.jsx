import { useState, useEffect } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useTranslation } from 'react-i18next'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const { cartCount } = useCart()
  const { t, i18n } = useTranslation()

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

  const links = [
    { to: '/', label: t('nav.home'), exact: true },
    { to: '/shop', label: t('nav.shop') },
    { to: '/about', label: t('nav.about') },
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

        {/* RIGHT — Language toggle + Cart */}
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
