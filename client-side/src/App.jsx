import { lazy, Suspense, useState, useEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'motion/react'
import MainLayout from './layouts/MainLayout'
import AdminLayout from './layouts/AdminLayout'
import Loader from './components/Loader'
import ProtectedRoute from './components/ProtectedRoute'
import SkeletonCard from './components/SkeletonCard'

/* ─── Lazy-loaded pages (code-split per route) ─── */
const Home           = lazy(() => import('./pages/Home'))
const Shop           = lazy(() => import('./pages/Shop'))
const ProductDetails = lazy(() => import('./pages/ProductDetails'))
const Contact        = lazy(() => import('./pages/Contact'))
const Checkout       = lazy(() => import('./pages/Checkout'))
const Login          = lazy(() => import('./pages/Login'))
const ComingSoon     = lazy(() => import('./pages/ComingSoon'))

/* Admin pages — only loaded when /admin is visited */
const Overview       = lazy(() => import('./pages/admin/Overview'))
const AdminProducts  = lazy(() => import('./pages/admin/Products'))
const AdminOrders    = lazy(() => import('./pages/admin/Orders'))
const AdminMessages  = lazy(() => import('./pages/admin/Messages'))
const Settings       = lazy(() => import('./pages/admin/Settings'))

/* Minimal inline fallback — avoids layout shift */
function PageFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="flex gap-2">
        {[0, 1, 2].map(i => (
          <span
            key={i}
            className="w-1.5 h-1.5 rounded-full bg-primary"
            style={{
              animation: `pulse 1.2s ease-in-out ${i * 0.2}s infinite`,
              opacity: 0.6,
            }}
          />
        ))}
      </div>
    </div>
  )
}

export default function App() {
  const [loading, setLoading] = useState(true)
  const location = useLocation()

  useEffect(() => {           
    const t = setTimeout(() => setLoading(false), 5000)
    return () => clearTimeout(t)
  }, [])

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [location.pathname])

  if (loading) return <Loader />

  return (
    <AnimatePresence mode="wait">
      <Suspense fallback={<PageFallback />}>
        <Routes location={location} key={location.pathname}>
          {/* Standalone full-screen page — no navbar/footer */}
          {/* <Route index element={<ComingSoon />} /> */}

          <Route element={<MainLayout />}>
            <Route index element={<Home />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/product/:id" element={<ProductDetails />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/login" element={<Login />} />
          </Route>

          <Route
            path="/admin"
            element={
              <ProtectedRoute role="admin">
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Overview />} />
            <Route path="products" element={<AdminProducts />} />
            <Route path="orders" element={<AdminOrders />} />
            <Route path="messages" element={<AdminMessages />} />
            <Route path="settings" element={<Settings />} />
          </Route>
        </Routes>
      </Suspense>
    </AnimatePresence>
  )
}
