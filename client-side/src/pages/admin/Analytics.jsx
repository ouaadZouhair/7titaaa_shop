import { useEffect, useState } from 'react'
import { motion } from 'motion/react'
import { TrendingUp, Package, ShoppingBag } from 'lucide-react'
import api from '../../lib/api'

const STATUS_COLORS = {
  pending:   'bg-yellow-400',
  confirmed: 'bg-blue-400',
  shipped:   'bg-purple-400',
  delivered: 'bg-green-400',
  cancelled: 'bg-red-400',
}

export default function Analytics() {
  const [catalog, setCatalog] = useState({ products: {}, categories: [] })
  const [orders, setOrders] = useState([])
  const [ordersTotal, setOrdersTotal] = useState(0)

  useEffect(() => {
    api.get('/products/stats').then((res) => setCatalog(res.data)).catch(() => {})
    api.get('/orders', { params: { limit: 200 } })
      .then((res) => { setOrders(res.data.orders); setOrdersTotal(res.data.total) })
      .catch(() => {})
  }, [])

  const catalogMax = Math.max(1, ...catalog.categories.map((c) => c.count))

  const revenue = orders.reduce((s, o) => s + Number(o.total), 0)
  const avgOrder = orders.length ? revenue / orders.length : 0

  const statusCounts = orders.reduce((acc, o) => {
    acc[o.status] = (acc[o.status] || 0) + 1
    return acc
  }, {})
  const statusMax = Math.max(1, ...Object.values(statusCounts))

  return (
    <div>
      <div className="mb-8">
        <p className="font-mono text-[10px] tracking-widest uppercase text-gray-400 mb-2">Insights</p>
        <h1 className="text-3xl font-semibold tracking-tight">Analytics</h1>
      </div>

      {/* Order analytics */}
      <p className="font-mono text-[10px] tracking-widest uppercase text-gray-400 mb-3">Orders</p>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white border border-gray-200 rounded-xl p-5"
        >
          <div className="flex items-center gap-2 mb-4">
            <ShoppingBag size={18} className="text-gray-500" />
            <h2 className="font-semibold">Order stats</h2>
          </div>
          <dl className="grid grid-cols-2 gap-4">
            <div>
              <dt className="font-mono text-[10px] tracking-widest uppercase text-gray-400">Total orders</dt>
              <dd className="text-2xl font-semibold tracking-tight">{ordersTotal}</dd>
            </div>
            <div>
              <dt className="font-mono text-[10px] tracking-widest uppercase text-gray-400">Revenue</dt>
              <dd className="text-2xl font-semibold tracking-tight">{revenue.toFixed(2)} DH</dd>
            </div>
            <div>
              <dt className="font-mono text-[10px] tracking-widest uppercase text-gray-400">Avg. order</dt>
              <dd className="text-2xl font-semibold tracking-tight">{avgOrder.toFixed(2)} DH</dd>
            </div>
            <div>
              <dt className="font-mono text-[10px] tracking-widest uppercase text-gray-400">Delivered</dt>
              <dd className="text-2xl font-semibold tracking-tight">{statusCounts.delivered || 0}</dd>
            </div>
          </dl>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="bg-white border border-gray-200 rounded-xl p-5"
        >
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp size={18} className="text-gray-500" />
            <h2 className="font-semibold">Orders by status</h2>
          </div>
          <div className="space-y-3">
            {Object.keys(STATUS_COLORS).map((status) => (
              <div key={status}>
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="capitalize">{status}</span>
                  <span className="font-mono text-[11px] text-gray-400">{statusCounts[status] || 0}</span>
                </div>
                <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${STATUS_COLORS[status]}`}
                    style={{ width: `${((statusCounts[status] || 0) / statusMax) * 100}%` }}
                  />
                </div>
              </div>
            ))}
            {orders.length === 0 && (
              <p className="text-sm text-gray-400">No orders yet.</p>
            )}
          </div>
        </motion.div>
      </div>

      {/* Catalog analytics */}
      <p className="font-mono text-[10px] tracking-widest uppercase text-gray-400 mb-3">Catalog</p>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white border border-gray-200 rounded-xl p-5"
        >
          <div className="flex items-center gap-2 mb-4">
            <Package size={18} className="text-gray-500" />
            <h2 className="font-semibold">Catalog distribution</h2>
          </div>
          <div className="space-y-3">
            {catalog.categories.length === 0 && (
              <p className="text-sm text-gray-400">No data yet.</p>
            )}
            {catalog.categories.map((c) => (
              <div key={c.category}>
                <div className="flex items-center justify-between text-sm mb-1">
                  <span>{c.category}</span>
                  <span className="font-mono text-[11px] text-gray-400">{c.count}</span>
                </div>
                <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-black rounded-full transition-all duration-500"
                    style={{ width: `${(c.count / catalogMax) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="bg-white border border-gray-200 rounded-xl p-5"
        >
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp size={18} className="text-gray-500" />
            <h2 className="font-semibold">Quick stats</h2>
          </div>
          <dl className="grid grid-cols-2 gap-4">
            <div>
              <dt className="font-mono text-[10px] tracking-widest uppercase text-gray-400">Total</dt>
              <dd className="text-2xl font-semibold tracking-tight">{catalog.products.total || 0}</dd>
            </div>
            <div>
              <dt className="font-mono text-[10px] tracking-widest uppercase text-gray-400">Featured</dt>
              <dd className="text-2xl font-semibold tracking-tight">{catalog.products.featured || 0}</dd>
            </div>
            <div>
              <dt className="font-mono text-[10px] tracking-widest uppercase text-gray-400">New</dt>
              <dd className="text-2xl font-semibold tracking-tight">{catalog.products.new || 0}</dd>
            </div>
            <div>
              <dt className="font-mono text-[10px] tracking-widest uppercase text-gray-400">Categories</dt>
              <dd className="text-2xl font-semibold tracking-tight">{catalog.products.categories || 0}</dd>
            </div>
          </dl>
        </motion.div>
      </div>
    </div>
  )
}
