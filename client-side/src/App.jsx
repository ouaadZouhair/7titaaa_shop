import { useState, useEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'motion/react'
import MainLayout from './layouts/MainLayout'
import Loader from './components/Loader'
import Home from './pages/Home'
import Shop from './pages/Shop'
import ProductDetails from './pages/ProductDetails'
import About from './pages/About'
import Contact from './pages/Contact'
import Checkout from './pages/Checkout'
import Login from './pages/Login'
import Register from './pages/Register'
import AdminLayout from './layouts/AdminLayout'
import Overview from './pages/admin/Overview'
import AdminProducts from './pages/admin/Products'
import AdminOrders from './pages/admin/Orders'
import Settings from './pages/admin/Settings'
import ProtectedRoute from './components/ProtectedRoute'

export default function App() {
  const [loading, setLoading] = useState(true)
  const location = useLocation()

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 4500)
    return () => clearTimeout(t)
  }, [])

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [location.pathname])

  if (loading) return <Loader />

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
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
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
    </AnimatePresence>
  )
}
