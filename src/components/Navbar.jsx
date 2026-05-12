import { useState, useEffect } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { useCart } from '../context/CartContext'

const links = [
  { to: '/', label: 'Home', exact: true },
  { to: '/shop', label: 'Shop' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const { cartCount } = useCart()

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  return (
    <nav
      className={`fixed top-0 inset-x-0 z-50 transition-colors duration-300 hidden lg:block ${
        scrolled
          ? 'bg-street-black/95 backdrop-blur-md shadow-lg shadow-black/30'
          : 'bg-street-black'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">

        {/* LEFT — Nav links (desktop only) */}
        <div className="hidden lg:flex items-center gap-5">
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
        {/* Spacer on mobile/tablet to balance the logo centering */}
        <div className="lg:hidden w-6" />

        {/* RIGHT — Cart (desktop only) */}
        <Link
          to="/checkout"
          className="relative hidden lg:flex items-center gap-2 text-white/70 hover:text-white transition-colors duration-200 hover:scale-105"
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
    </nav>
  )
}
