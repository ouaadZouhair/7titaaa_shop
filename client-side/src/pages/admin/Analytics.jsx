import { useEffect, useState } from 'react'
import { motion } from 'motion/react'
import { TrendingUp, Package } from 'lucide-react'
import api from '../../lib/api'

export default function Analytics() {
  const [data, setData] = useState({ products: {}, categories: [] })

  useEffect(() => {
    api.get('/products/stats').then((res) => setData(res.data)).catch(() => {})
  }, [])

  const max = Math.max(1, ...data.categories.map((c) => c.count))

  return (
    <div>
      <div className="mb-8">
        <p className="font-mono text-[10px] tracking-widest uppercase text-gray-400 mb-2">Insights</p>
        <h1 className="text-3xl font-semibold tracking-tight">Analytics</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white border border-gray-200 rounded-xl p-5"
        >
          <div className="flex items-center gap-2 mb-4">
            <Package size={18} className="text-gray-500" />
            <h2 className="font-semibold">Catalog distribution</h2>
          </div>
          <div className="space-y-3">
            {data.categories.length === 0 && (
              <p className="text-sm text-gray-400">No data yet.</p>
            )}
            {data.categories.map((c) => (
              <div key={c.category}>
                <div className="flex items-center justify-between text-sm mb-1">
                  <span>{c.category}</span>
                  <span className="font-mono text-[11px] text-gray-400">{c.count}</span>
                </div>
                <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-black rounded-full transition-all duration-500"
                    style={{ width: `${(c.count / max) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="bg-white border border-gray-200 rounded-xl p-5"
        >
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp size={18} className="text-gray-500" />
            <h2 className="font-semibold">Quick stats</h2>
          </div>
          <dl className="grid grid-cols-2 gap-4">
            <div>
              <dt className="font-mono text-[10px] tracking-widest uppercase text-gray-400">Total</dt>
              <dd className="text-2xl font-semibold tracking-tight">{data.products.total || 0}</dd>
            </div>
            <div>
              <dt className="font-mono text-[10px] tracking-widest uppercase text-gray-400">Featured</dt>
              <dd className="text-2xl font-semibold tracking-tight">{data.products.featured || 0}</dd>
            </div>
            <div>
              <dt className="font-mono text-[10px] tracking-widest uppercase text-gray-400">New</dt>
              <dd className="text-2xl font-semibold tracking-tight">{data.products.new || 0}</dd>
            </div>
            <div>
              <dt className="font-mono text-[10px] tracking-widest uppercase text-gray-400">Categories</dt>
              <dd className="text-2xl font-semibold tracking-tight">{data.products.categories || 0}</dd>
            </div>
          </dl>
        </motion.div>
      </div>
    </div>
  )
}
