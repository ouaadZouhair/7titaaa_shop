import { useState, useEffect, useCallback } from 'react'
import api from '../../lib/api'

const STATUS_OPTIONS = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled']

const STATUS_STYLES = {
  pending:   'bg-yellow-100 text-yellow-800',
  confirmed: 'bg-blue-100 text-blue-800',
  shipped:   'bg-purple-100 text-purple-800',
  delivered: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
}

export default function Orders() {
  const [orders, setOrders] = useState([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [filterStatus, setFilterStatus] = useState('')
  const [expanded, setExpanded] = useState(null)
  const [updating, setUpdating] = useState(null)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const params = filterStatus ? { status: filterStatus } : {}
      const { data } = await api.get('/orders', { params })
      setOrders(data.orders)
      setTotal(data.total)
    } finally {
      setLoading(false)
    }
  }, [filterStatus])

  useEffect(() => { load() }, [load])

  const handleStatusChange = async (orderId, newStatus) => {
    setUpdating(orderId)
    try {
      const { data } = await api.patch(`/orders/${orderId}/status`, { status: newStatus })
      setOrders(prev => prev.map(o => o.id === orderId ? data.order : o))
    } finally {
      setUpdating(null)
    }
  }

  return (
    <div>
      {/* Page header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Orders</h1>
          <p className="text-sm text-gray-500 mt-0.5">{total} total order{total !== 1 ? 's' : ''}</p>
        </div>
        <button
          onClick={load}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium border border-gray-200 rounded-md hover:bg-gray-50 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Refresh
        </button>
      </div>

      {/* Status filter */}
      <div className="flex flex-wrap gap-2 mb-6">
        <button
          onClick={() => setFilterStatus('')}
          className={`px-4 py-1.5 rounded-full text-xs font-mono tracking-widest uppercase transition-colors ${
            filterStatus === '' ? 'bg-black text-white' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
          }`}
        >
          All
        </button>
        {STATUS_OPTIONS.map(s => (
          <button
            key={s}
            onClick={() => setFilterStatus(s)}
            className={`px-4 py-1.5 rounded-full text-xs font-mono tracking-widest uppercase transition-colors ${
              filterStatus === s ? 'bg-black text-white' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="py-20 text-center text-gray-400 text-sm">Loading orders…</div>
        ) : orders.length === 0 ? (
          <div className="py-20 text-center">
            <p className="text-gray-300 text-2xl font-semibold mb-2">No orders yet</p>
            <p className="text-gray-400 text-sm">Orders placed via checkout will appear here.</p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="text-left px-4 py-3 font-mono text-[10px] tracking-widest uppercase text-gray-400">Ref</th>
                <th className="text-left px-4 py-3 font-mono text-[10px] tracking-widest uppercase text-gray-400">Customer</th>
                <th className="text-left px-4 py-3 font-mono text-[10px] tracking-widest uppercase text-gray-400 hidden md:table-cell">City</th>
                <th className="text-left px-4 py-3 font-mono text-[10px] tracking-widest uppercase text-gray-400 hidden lg:table-cell">Items</th>
                <th className="text-right px-4 py-3 font-mono text-[10px] tracking-widest uppercase text-gray-400">Total</th>
                <th className="text-left px-4 py-3 font-mono text-[10px] tracking-widest uppercase text-gray-400">Status</th>
                <th className="text-left px-4 py-3 font-mono text-[10px] tracking-widest uppercase text-gray-400 hidden sm:table-cell">Date</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {orders.map(order => (
                <>
                  <tr
                    key={order.id}
                    className="hover:bg-gray-50 transition-colors cursor-pointer"
                    onClick={() => setExpanded(expanded === order.id ? null : order.id)}
                  >
                    <td className="px-4 py-3 font-mono text-xs text-gray-600">{order.ref}</td>
                    <td className="px-4 py-3">
                      <p className="font-medium text-gray-900">{order.firstName} {order.lastName}</p>
                      <p className="text-xs text-gray-400">{order.phone}</p>
                    </td>
                    <td className="px-4 py-3 text-gray-600 hidden md:table-cell">{order.city}</td>
                    <td className="px-4 py-3 text-gray-500 hidden lg:table-cell">
                      {order.items?.length ?? 0} item{(order.items?.length ?? 0) !== 1 ? 's' : ''}
                    </td>
                    <td className="px-4 py-3 text-right font-semibold text-gray-900">
                      {Number(order.total).toFixed(2)} DH
                    </td>
                    <td className="px-4 py-3" onClick={e => e.stopPropagation()}>
                      <select
                        value={order.status}
                        disabled={updating === order.id}
                        onChange={e => handleStatusChange(order.id, e.target.value)}
                        className={`text-xs font-mono rounded-full px-3 py-1 border-0 outline-none cursor-pointer appearance-none ${STATUS_STYLES[order.status]}`}
                      >
                        {STATUS_OPTIONS.map(s => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-400 hidden sm:table-cell">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 text-gray-400">
                      <svg
                        className={`w-4 h-4 transition-transform ${expanded === order.id ? 'rotate-180' : ''}`}
                        fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                      </svg>
                    </td>
                  </tr>

                  {/* Expanded row — items detail */}
                  {expanded === order.id && (
                    <tr key={`${order.id}-detail`} className="bg-gray-50">
                      <td colSpan={8} className="px-6 py-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                          {/* Shipping info */}
                          <div>
                            <p className="font-mono text-[10px] tracking-widest uppercase text-gray-400 mb-2">Shipping Info</p>
                            <p className="text-sm text-gray-700">{order.firstName} {order.lastName}</p>
                            <p className="text-sm text-gray-500">{order.phone}</p>
                            <p className="text-sm text-gray-500">{order.email}</p>
                            <p className="text-sm text-gray-500">{order.address}, {order.city}</p>
                            <div className="mt-2 flex gap-4 text-xs text-gray-400 font-mono">
                              <span>Subtotal: {Number(order.subtotal).toFixed(2)} DH</span>
                              <span>Shipping: {Number(order.shipping).toFixed(2)} DH</span>
                              <span className="font-semibold text-gray-600">Total: {Number(order.total).toFixed(2)} DH</span>
                            </div>
                          </div>

                          {/* Items */}
                          <div>
                            <p className="font-mono text-[10px] tracking-widest uppercase text-gray-400 mb-2">Items</p>
                            <div className="space-y-2">
                              {(order.items || []).map((item, i) => (
                                <div key={i} className="flex items-center gap-3">
                                  {item.image && (
                                    <img
                                      src={item.image}
                                      alt={item.name}
                                      className="w-10 h-12 object-cover rounded-sm shrink-0"
                                    />
                                  )}
                                  <div className="min-w-0">
                                    <p className="text-sm font-medium text-gray-800 truncate">{item.name}</p>
                                    <p className="font-mono text-[10px] text-gray-400 uppercase">
                                      {item.category} · Size {item.size}
                                    </p>
                                  </div>
                                  <span className="ml-auto text-sm font-semibold text-gray-700 shrink-0">
                                    {Number(item.price).toFixed(2)} DH
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
