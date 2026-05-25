import { NavLink } from 'react-router-dom'
import { useCart } from '../context/CartContext'

const tabs = [
  {
    to: '/',
    label: 'Home',
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
    label: 'Shop',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round"
          d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
      </svg>
    ),
  },
  {
    to: '/contact',
    label: 'Contact',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round"
          d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    to: '/checkout',
    label: 'Cart',
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

  return (
    <nav className="lg:hidden fixed bottom-0 inset-x-0 z-50 bg-street-black border-t border-white/10">
      <div className="flex items-stretch h-16">
        {tabs.map(({ to, label, exact, icon, isCart }) => (
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
            <span className="font-mono text-[9px] tracking-widest uppercase">{label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  )
}
