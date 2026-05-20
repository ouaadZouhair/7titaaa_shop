import { useState } from 'react'
import { NavLink, Outlet, Link, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard,
  Package,
  Settings,
  LogOut,
  Menu,
  X,
  ShoppingBag,
  MessageSquare,
} from 'lucide-react'
import logo from '../assets/7titaaa_logo2.png'
import { useAuth } from '../context/AuthContext'

const navItems = [
  { to: '/admin', label: 'Overview', icon: LayoutDashboard, end: true },
  { to: '/admin/products', label: 'Products', icon: Package },
  { to: '/admin/orders', label: 'Orders', icon: ShoppingBag },
  { to: '/admin/messages', label: 'Messages', icon: MessageSquare },
  { to: '/admin/settings', label: 'Settings', icon: Settings },
]

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login', { replace: true })
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-black text-white transform transition-transform duration-300
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}
      >
        <div className="h-20 flex items-center justify-center px-6 border-b border-white/10 relative">
          <Link to="/admin">
            <img src={logo} alt="7titaaa" className="h-14 w-auto" />
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-white/60 hover:text-white absolute right-4"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="px-3 py-6 space-y-1">
          <p className="px-3 mb-3 font-mono text-[10px] tracking-widest uppercase text-white/40">
            Menu
          </p>
          {navItems.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-md text-sm transition-colors ${
                  isActive
                    ? 'bg-white text-black font-medium'
                    : 'text-white/60 hover:text-white hover:bg-white/5'
                }`
              }
            >
              <Icon size={18} />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="absolute bottom-0 inset-x-0 p-4 border-t border-white/10">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center font-mono text-xs uppercase">
              {user?.name?.[0] || 'A'}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium truncate">{user?.name}</p>
              <p className="font-mono text-[10px] tracking-widest uppercase text-white/40">
                {user?.role}
              </p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 py-2 rounded-md border border-white/15 text-xs tracking-widest uppercase text-white/70 hover:bg-white/5 hover:text-white transition-colors"
          >
            <LogOut size={14} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="lg:pl-64">
        {/* Top navbar */}
        <header className="sticky top-0 z-20 bg-white/80 backdrop-blur border-b border-gray-200">
          <div className="h-16 flex items-center justify-between px-4 sm:px-6">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 rounded-md hover:bg-gray-100"
              >
                <Menu size={20} />
              </button>
            </div>

            <div className="flex items-center gap-2">
<Link
                to="/"
                className="font-mono text-[10px] tracking-widest uppercase px-4 py-2 rounded-md bg-black text-white hover:bg-gray-800 transition-colors"
              >
                View site
              </Link>
            </div>
          </div>
        </header>

        <main className="p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
