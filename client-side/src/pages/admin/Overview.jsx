import { useEffect, useState } from 'react'
import { motion } from 'motion/react'
import { Package, Sparkles, Star, Layers, ArrowUpRight, ShoppingBag, Mail, MailOpen } from 'lucide-react'
import { Link } from 'react-router-dom'
import api from '../../lib/api'
import { resolveImageUrl } from '../../lib/uploads'
import { useAdminCounts } from '../../context/AdminCountsContext'

const STATUS_STYLES = {
  pending:   'bg-yellow-100 text-yellow-700',
  confirmed: 'bg-blue-100 text-blue-700',
  shipped:   'bg-purple-100 text-purple-700',
  delivered: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
}

const StatCard = ({ icon: Icon, label, value, delta }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-white border border-gray-200 rounded-xl p-5"
  >
    <div className="flex items-center justify-between mb-4">
      <div className="w-9 h-9 rounded-lg bg-black text-white flex items-center justify-center">
        <Icon size={18} />
      </div>
      {delta && (
        <span className="font-mono text-[10px] tracking-widest uppercase text-emerald-600 flex items-center gap-1">
          <ArrowUpRight size={12} />
          {delta}
        </span>
      )}
    </div>
    <p className="font-mono text-[10px] tracking-widest uppercase text-gray-400 mb-1">{label}</p>
    <p className="text-3xl font-semibold tracking-tight">{value}</p>
  </motion.div>
)

export default function Overview() {
  const [data, setData] = useState({ products: { total: 0, featured: 0, new: 0, categories: 0 }, categories: [] })
  const [recentProducts, setRecentProducts] = useState([])
  const [recentOrders, setRecentOrders] = useState([])
  const [ordersTotal, setOrdersTotal] = useState(0)
  const [recentMessages, setRecentMessages] = useState([])
  const [loading, setLoading] = useState(true)
  const { counts: adminCounts, setMessages: setGlobalMessageCount } = useAdminCounts()
  const messagesUnread = adminCounts.messages

  useEffect(() => {
    Promise.all([
      api.get('/products/stats'),
      api.get('/products?limit=5'),
      api.get('/orders', { params: { limit: 5 } }),
      api.get('/messages', { params: { limit: 5 } }),
    ])
      .then(([s, r, o, m]) => {
        setData(s.data)
        setRecentProducts(r.data.items)
        setRecentOrders(o.data.orders)
        setOrdersTotal(o.data.total)
        setRecentMessages(m.data.items || [])
        setGlobalMessageCount(m.data.unread)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [setGlobalMessageCount])

  return (
    <div>
      <div className="mb-8">
        <p className="font-mono text-[10px] tracking-widest uppercase text-gray-400 mb-2">Dashboard</p>
        <h1 className="text-3xl font-semibold tracking-tight">Overview</h1>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        <StatCard icon={Package}     label="Total Products" value={loading ? '—' : data.products.total} />
        <StatCard icon={Sparkles}    label="New Drops"      value={loading ? '—' : data.products.new} />
        <StatCard icon={Star}        label="Featured"       value={loading ? '—' : data.products.featured} />
        <StatCard icon={Layers}      label="Categories"     value={loading ? '—' : data.products.categories} />
        <StatCard icon={ShoppingBag} label="Total Orders"   value={loading ? '—' : ordersTotal} />
      </div>

      {/* Bottom panels */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">

        {/* Recent products */}
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold">Recent products</h2>
            <Link to="/admin/products" className="font-mono text-[10px] tracking-widest uppercase text-gray-500 hover:text-black">
              View all →
            </Link>
          </div>
          <div className="divide-y divide-gray-100">
            {recentProducts.length === 0 && !loading && (
              <p className="text-sm text-gray-400 py-8 text-center">No products yet.</p>
            )}
            {recentProducts.map((p) => (
              <div key={p.id} className="flex items-center gap-4 py-3">
                <img src={resolveImageUrl(p.image)} alt={p.name} className="w-12 h-12 rounded-md object-cover bg-gray-100" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{p.name}</p>
                  <p className="font-mono text-[10px] tracking-widest uppercase text-gray-400">{p.category}</p>
                </div>
                <p className="text-sm font-semibold">{p.price.toFixed(2)} DH</p>
              </div>
            ))}
          </div>
        </div>

        {/* Recent orders */}
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold">Recent orders</h2>
            <Link to="/admin/orders" className="font-mono text-[10px] tracking-widest uppercase text-gray-500 hover:text-black">
              View all →
            </Link>
          </div>
          <div className="divide-y divide-gray-100">
            {recentOrders.length === 0 && !loading && (
              <p className="text-sm text-gray-400 py-8 text-center">No orders yet.</p>
            )}
            {recentOrders.map((o) => (
              <div key={o.id} className="flex items-center gap-3 py-3">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{o.firstName} {o.lastName}</p>
                  <p className="font-mono text-[10px] tracking-widest uppercase text-gray-400">{o.ref}</p>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span className="text-sm font-semibold">{Number(o.total).toFixed(2)} DH</span>
                  <span className={`font-mono text-[9px] tracking-widest uppercase px-2 py-0.5 rounded-full ${STATUS_STYLES[o.status]}`}>
                    {o.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent messages */}
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold flex items-center gap-2">
              Recent messages
              {messagesUnread > 0 && (
                <span className="inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full text-[10px] font-bold bg-red-500 text-white">
                  {messagesUnread}
                </span>
              )}
            </h2>
            <Link to="/admin/messages" className="font-mono text-[10px] tracking-widest uppercase text-gray-500 hover:text-black">
              View all →
            </Link>
          </div>
          <div className="divide-y divide-gray-100">
            {recentMessages.length === 0 && !loading && (
              <p className="text-sm text-gray-400 py-8 text-center">No messages yet.</p>
            )}
            {recentMessages.map((m) => (
              <div key={m.id} className="flex items-start gap-3 py-3">
                <div className={`shrink-0 mt-0.5 ${!m.isRead ? 'text-primary' : 'text-gray-300'}`}>
                  {m.isRead ? <MailOpen size={16} /> : <Mail size={16} />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm truncate ${!m.isRead ? 'font-semibold text-gray-900' : 'font-medium text-gray-600'}`}>
                    {m.firstName} {m.lastName}
                  </p>
                  <p className="text-xs text-gray-400 truncate">
                    {m.message?.substring(0, 60)}{(m.message?.length || 0) > 60 ? '…' : ''}
                  </p>
                </div>
                {!m.isRead && (
                  <span className="shrink-0 mt-1.5 w-2 h-2 rounded-full bg-red-500" />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Categories */}
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <h2 className="font-semibold mb-4">Categories</h2>
          <div className="space-y-3">
            {data.categories.length === 0 && !loading && (
              <p className="text-sm text-gray-400 py-4 text-center">No data.</p>
            )}
            {data.categories.map((c) => (
              <div key={c.category} className="flex items-center justify-between">
                <span className="text-sm">{c.category}</span>
                <span className="font-mono text-[11px] tracking-widest text-gray-400">{c.count}</span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}
