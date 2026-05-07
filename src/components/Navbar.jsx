import { useState, useEffect } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import logo from '../assets/7titaaa_logo2.png'

const links = [
  { to: '/', label: 'Home', exact: true },
  { to: '/shop', label: 'Shop' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const { cartCount } = useCart()
  const location = useLocation()

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  useEffect(() => {
    setMenuOpen(false)
  }, [location])

  return (
    <>
      <nav
        className={`fixed top-0 inset-x-0 z-50 transition-colors duration-300 ${
          scrolled
            ? 'bg-street-black/95 backdrop-blur-md shadow-lg shadow-black/30'
            : 'bg-street-black'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">

          {/* LEFT — Nav links */}
          <div className="hidden md:flex items-center gap-7">
            {links.map(({ to, label, exact }) => (
              <NavLink
                key={to}
                to={to}
                end={exact}
                className={({ isActive }) =>
                  `font-mono text-sm tracking-widest uppercase transition-colors duration-200 ${
                    isActive ? 'text-primary-light' : 'text-white/60 hover:text-white'
                  }`
                }
              >
                {label}
              </NavLink>
            ))}
          </div>

          {/* CENTER — Logo */}
          <Link
            to="/"
            className="absolute left-1/2 -translate-x-1/2 flex items-center"
          >
            <img src={logo} alt="7titaaa" className="h-16 w-auto" />
          </Link>

          {/* RIGHT — Cart + Mobile hamburger */}
          <div className="flex items-center gap-4">
            <Link
              to="/checkout"
              className="relative hidden md:flex items-center gap-2 text-white/70 hover:text-white transition-colors duration-200 hover:scale-105"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round"
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              {/* <span className="font-mono text-sm tracking-wider uppercase">Cart</span> */}
              {cartCount > 0 && (
                <span
                  className="absolute -top-2 -right-5 min-w-4.5 h-4.5 flex items-center justify-center rounded-full text-[10px] font-bold text-white bg-accent-red"
                  // style={{ background: 'linear-gradient(135deg,#16a34a,#f97316)' }}
                >
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Mobile hamburger */}
            <button
              className="md:hidden flex flex-col gap-1.5 p-2 text-white"
              onClick={() => setMenuOpen(o => !o)}
              aria-label="Toggle menu"
            >
              <span className={`block w-5 h-[1.5px] bg-white origin-center transition-transform duration-200 ${menuOpen ? 'rotate-45 translate-y-2' : ''}`} />
              <span className={`block w-5 h-[1.5px] bg-white transition-opacity duration-200 ${menuOpen ? 'opacity-0' : ''}`} />
              <span className={`block w-5 h-[1.5px] bg-white origin-center transition-transform duration-200 ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile drawer */}
      {menuOpen && (
        <div className="fixed top-16 right-0 bottom-0 w-72 bg-street-black z-40 flex flex-col pt-10 px-8 border-l border-white/5">
          <div className="space-y-1">
            {links.map(({ to, label, exact }) => (
              <NavLink
                key={to}
                to={to}
                end={exact}
                className={({ isActive }) =>
                  `block font-display text-4xl tracking-wider py-2 transition-colors ${
                    isActive ? 'text-primary-light' : 'text-white/70 hover:text-white'
                  }`
                }
              >
                {label}
              </NavLink>
            ))}
          </div>

          <div className="mt-auto pb-12">
            <Link
              to="/checkout"
              className="flex items-center gap-3 text-white/50 hover:text-white font-mono text-xs tracking-widest uppercase transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round"
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              Cart
              {cartCount > 0 && (
                <span className="bg-primary text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>
          </div>
        </div>
      )}

      {/* Mobile overlay */}
      {menuOpen && (
        <div
          onClick={() => setMenuOpen(false)}
          className="fixed inset-0 top-16 bg-black/60 z-30 md:hidden"
        />
      )}
    </>
  )
}
