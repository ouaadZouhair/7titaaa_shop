import { useEffect, useState } from 'react'
import { motion } from 'motion/react'
import { Package, Sparkles, Star, Layers, ArrowUpRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import api from '../../lib/api'
import { resolveImageUrl } from '../../lib/uploads'

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
  const [recent, setRecent] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([api.get('/products/stats'), api.get('/products?limit=5')])
      .then(([s, r]) => {
        setData(s.data)
        setRecent(r.data.items)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  return (
    <div>
      <div className="mb-8">
        <p className="font-mono text-[10px] tracking-widest uppercase text-gray-400 mb-2">Dashboard</p>
        <h1 className="text-3xl font-semibold tracking-tight">Overview</h1>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard icon={Package} label="Total Products" value={loading ? '—' : data.products.total} />
        <StatCard icon={Sparkles} label="New Drops" value={loading ? '—' : data.products.new} />
        <StatCard icon={Star} label="Featured" value={loading ? '—' : data.products.featured} />
        <StatCard icon={Layers} label="Categories" value={loading ? '—' : data.products.categories} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 bg-white border border-gray-200 rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold">Recent products</h2>
            <Link
              to="/admin/products"
              className="font-mono text-[10px] tracking-widest uppercase text-gray-500 hover:text-black"
            >
              View all →
            </Link>
          </div>
          <div className="divide-y divide-gray-100">
            {recent.length === 0 && !loading && (
              <p className="text-sm text-gray-400 py-8 text-center">No products yet.</p>
            )}
            {recent.map((p) => (
              <div key={p.id} className="flex items-center gap-4 py-3">
                <img src={resolveImageUrl(p.image)} alt={p.name} className="w-12 h-12 rounded-md object-cover bg-gray-100" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{p.name}</p>
                  <p className="font-mono text-[10px] tracking-widest uppercase text-gray-400">{p.category}</p>
                </div>
                <p className="text-sm font-semibold">${p.price.toFixed(2)}</p>
              </div>
            ))}
          </div>
        </div>

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
