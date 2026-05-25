import { useCallback, useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'motion/react'
import { Plus, Search, Pencil, Trash2, ChevronLeft, ChevronRight, Star, Sparkles } from 'lucide-react'
import api from '../../lib/api'
import { resolveImageUrl } from '../../lib/uploads'
import ProductFormModal from '../../components/admin/ProductFormModal'

const PAGE_SIZE = 8

export default function Products() {
  const [items, setItems] = useState([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('all')
  const [page, setPage] = useState(1)
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(null)

  const fetchProducts = useCallback(async () => {
    setLoading(true)
    try {
      const { data } = await api.get('/products', {
        params: {
          search: search || undefined,
          category: category !== 'all' ? category : undefined,
          limit: PAGE_SIZE,
          offset: (page - 1) * PAGE_SIZE,
        },
      })
      setItems(data.items)
      setTotal(data.total)
    } finally {
      setLoading(false)
    }
  }, [search, category, page])

  useEffect(() => {
    const t = setTimeout(fetchProducts, 200)
    return () => clearTimeout(t)
  }, [fetchProducts])

  const categories = useMemo(() => {
    const set = new Set(items.map((p) => p.category))
    return ['all', ...Array.from(set)]
  }, [items])

  const handleSubmit = async (values) => {
    setSubmitting(true)
    try {
      if (editing?.id) {
        await api.put(`/products/${editing.id}`, values)
      } else {
        await api.post('/products', values)
      }
      setModalOpen(false)
      setEditing(null)
      fetchProducts()
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (id) => {
    await api.delete(`/products/${id}`)
    setConfirmDelete(null)
    fetchProducts()
  }

  const handleToggleAvailability = async (e, p) => {
    e.stopPropagation()
    await api.patch(`/products/${p.id}/availability`, { isAvailable: !p.isAvailable })
    setItems((prev) => prev.map((x) => x.id === p.id ? { ...x, isAvailable: !p.isAvailable } : x))
  }

  const navigate = useNavigate()
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE))

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6">
        <div>
          <p className="font-mono text-[10px] tracking-widest uppercase text-gray-400 mb-2">Catalog</p>
          <h1 className="text-3xl font-semibold tracking-tight">Products</h1>
        </div>
        <button
          onClick={() => { setEditing(null); setModalOpen(true) }}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-md bg-black text-white text-sm font-medium hover:bg-gray-800 self-start sm:self-auto"
        >
          <Plus size={16} /> New product
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="flex items-center gap-2 px-3 py-2 rounded-md bg-white border border-gray-200 flex-1">
          <Search size={16} className="text-gray-400" />
          <input
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1) }}
            placeholder="Search by name or description…"
            className="bg-transparent text-sm outline-none w-full"
          />
        </div>
        <select
          value={category}
          onChange={(e) => { setCategory(e.target.value); setPage(1) }}
          className="px-3 py-2 rounded-md bg-white border border-gray-200 text-sm"
        >
          {categories.map((c) => (
            <option key={c} value={c}>
              {c === 'all' ? 'All categories' : c}
            </option>
          ))}
        </select>
      </div>

      {/* Table */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-white border border-gray-200 rounded-xl overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr className="text-left">
                <th className="font-mono text-[10px] tracking-widest uppercase text-gray-500 px-4 py-3">Product</th>
                <th className="font-mono text-[10px] tracking-widest uppercase text-gray-500 px-4 py-3">Category</th>
                <th className="font-mono text-[10px] tracking-widest uppercase text-gray-500 px-4 py-3">Price</th>
                <th className="font-mono text-[10px] tracking-widest uppercase text-gray-500 px-4 py-3">Flags</th>
                <th className="font-mono text-[10px] tracking-widest uppercase text-gray-500 px-4 py-3 text-center">Available</th>
                <th className="font-mono text-[10px] tracking-widest uppercase text-gray-500 px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading && (
                <tr><td colSpan={5} className="px-4 py-12 text-center text-gray-400 text-sm">Loading…</td></tr>
              )}
              {!loading && items.length === 0 && (
                <tr><td colSpan={5} className="px-4 py-12 text-center text-gray-400 text-sm">No products found.</td></tr>
              )}
              {!loading && items.map((p) => (
                <tr
                  key={p.id}
                  onClick={() => navigate(`/product/${p.id}`)}
                  className="hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <img src={resolveImageUrl(p.image)} alt={p.name} className="w-10 h-10 rounded-md object-cover bg-gray-100" />
                      <div className="min-w-0">
                        <p className="font-medium truncate max-w-[260px]">{p.name}</p>
                        <p className="font-mono text-[10px] tracking-widest uppercase text-gray-400">#{p.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-600">{p.category}</td>
                  <td className="px-4 py-3">
                    <span className="font-semibold">{p.price.toFixed(2)} DH</span>
                    {p.originalPrice && (
                      <span className="ml-2 text-xs text-gray-400 line-through">{p.originalPrice.toFixed(2)} DH</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5">
                      {p.isFeatured && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 text-[10px] font-medium">
                          <Star size={10} fill="currentColor" /> Featured
                        </span>
                      )}
                      {p.isNew && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-medium">
                          <Sparkles size={10} /> New
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-center" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={(e) => handleToggleAvailability(e, p)}
                      title={p.isAvailable ? 'Mark as sold out' : 'Mark as available'}
                      className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors duration-200 focus:outline-none ${p.isAvailable ? 'bg-black' : 'bg-gray-300'}`}
                    >
                      <span className={`inline-block h-3.5 w-3.5 rounded-full bg-white shadow transition-transform duration-200 ${p.isAvailable ? 'translate-x-4' : 'translate-x-1'}`} />
                    </button>
                  </td>
                  <td className="px-4 py-3 text-right" onClick={(e) => e.stopPropagation()}>
                    <div className="inline-flex items-center gap-1">
                      <button
                        onClick={() => { setEditing(p); setModalOpen(true) }}
                        className="p-2 rounded-md hover:bg-gray-100 text-gray-600"
                        title="Edit"
                      >
                        <Pencil size={15} />
                      </button>
                      <button
                        onClick={() => setConfirmDelete(p)}
                        className="p-2 rounded-md hover:bg-red-50 text-red-600"
                        title="Delete"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100">
          <p className="font-mono text-[10px] tracking-widest uppercase text-gray-400">
            {total} item{total === 1 ? '' : 's'}
          </p>
          <div className="flex items-center gap-2">
            <button
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
              className="p-1.5 rounded-md hover:bg-gray-100 disabled:opacity-40"
            >
              <ChevronLeft size={16} />
            </button>
            <span className="text-sm text-gray-600">
              {page} / {totalPages}
            </span>
            <button
              disabled={page >= totalPages}
              onClick={() => setPage((p) => p + 1)}
              className="p-1.5 rounded-md hover:bg-gray-100 disabled:opacity-40"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </motion.div>

      <ProductFormModal
        open={modalOpen}
        initial={editing}
        submitting={submitting}
        onClose={() => { setModalOpen(false); setEditing(null) }}
        onSubmit={handleSubmit}
      />

      {/* Confirm delete */}
      {confirmDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={() => setConfirmDelete(null)}>
          <div className="bg-white rounded-xl p-6 w-full max-w-sm" onClick={(e) => e.stopPropagation()}>
            <h3 className="font-semibold mb-2">Delete product?</h3>
            <p className="text-sm text-gray-500 mb-5">
              <span className="font-medium text-gray-800">{confirmDelete.name}</span> will be permanently removed.
            </p>
            <div className="flex justify-end gap-2">
              <button onClick={() => setConfirmDelete(null)} className="px-4 py-2 text-sm rounded-md hover:bg-gray-100">Cancel</button>
              <button
                onClick={() => handleDelete(confirmDelete.id)}
                className="px-4 py-2 text-sm rounded-md bg-red-600 text-white hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
