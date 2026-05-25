import { useRef, useState } from 'react'
import { categories, sizes, types } from '../../data/products'
import { motion, AnimatePresence } from 'motion/react'
import { X, Upload, Plus, Trash2, Loader2, ImagePlus } from 'lucide-react'
import { uploadImage, resolveImageUrl } from '../../lib/uploads'

const emptyProduct = {
  name: '',
  price: '',
  originalPrice: '',
  category: '',
  image: '',
  images: [],
  description: '',
  size: '',
  type: 'Normal',
  isNew: false,
  isFeatured: false,
  rating: 0,
  reviews: 0,
  tags: [],
  quality: 5,
}

const SectionTitle = ({ children }) => (
  <p className="font-mono text-[10px] tracking-widest uppercase text-gray-400 pb-2 border-b border-gray-100">
    {children}
  </p>
)

function ProductForm({ initial, onClose, onSubmit, submitting }) {
  // The actual (base) price lives in `originalPrice`. On edit, normalize it:
  // if the product has no struck-through original, its sell price IS the base.
  const [form, setForm] = useState(() => {
    if (!initial) return emptyProduct
    const base = initial.originalPrice ?? initial.price ?? ''
    return { ...emptyProduct, ...initial, originalPrice: base }
  })
  const [tagInput, setTagInput] = useState('')
  const [error, setError] = useState('')
  const [mainUploading, setMainUploading] = useState(false)
  const [extraUploading, setExtraUploading] = useState(false)
  const [priceMode, setPriceMode] = useState('pct') // 'dh' (amount off) | 'pct' (percent off)

  const initialDiscounted =
    initial?.originalPrice != null &&
    initial?.price != null &&
    Number(initial.price) < Number(initial.originalPrice)
  const [pctInput, setPctInput] = useState(() =>
    initialDiscounted
      ? String(Math.round(((initial.originalPrice - initial.price) / initial.originalPrice) * 100))
      : ''
  )
  const [dhInput, setDhInput] = useState(() =>
    initialDiscounted
      ? String(Math.round((initial.originalPrice - initial.price) * 100) / 100)
      : ''
  )
  const mainFileRef = useRef(null)
  const extraFileRef = useRef(null)

  const update = (key, value) => setForm((f) => ({ ...f, [key]: value }))

  // Sell price = actual price minus the discount (percent off, or fixed DH amount off).
  const computedSalePrice = (() => {
    const orig = Number(form.originalPrice)
    if (!orig || orig <= 0) return null
    if (priceMode === 'pct') {
      const pct = Number(pctInput)
      if (!pct || pct <= 0 || pct >= 100) return null
      return Math.round(orig * (1 - pct / 100) * 100) / 100
    }
    const amt = Number(dhInput)
    if (!amt || amt <= 0 || amt >= orig) return null
    return Math.round((orig - amt) * 100) / 100
  })()

  const handleMainFile = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setError('')
    setMainUploading(true)
    try {
      const url = await uploadImage(file)
      update('image', url)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to upload image')
    } finally {
      setMainUploading(false)
      if (mainFileRef.current) mainFileRef.current.value = ''
    }
  }

  const handleExtraFiles = async (e) => {
    const files = Array.from(e.target.files || [])
    if (files.length === 0) return
    setError('')
    setExtraUploading(true)
    try {
      const uploaded = []
      for (const file of files) {
        const url = await uploadImage(file)
        uploaded.push(url)
      }
      update('images', [...(form.images || []), ...uploaded])
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to upload image')
    } finally {
      setExtraUploading(false)
      if (extraFileRef.current) extraFileRef.current.value = ''
    }
  }

  const removeImage = (i) =>
    update('images', form.images.filter((_, idx) => idx !== i))

  const addTag = () => {
    const t = tagInput.trim()
    if (!t) return
    update('tags', [...(form.tags || []), t])
    setTagInput('')
  }
  const removeTag = (i) => update('tags', form.tags.filter((_, idx) => idx !== i))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (!form.image) { setError('Please upload a main image'); return }

    const base = form.originalPrice === '' || form.originalPrice == null ? null : Number(form.originalPrice)
    if (base == null || base <= 0) { setError('Please enter the price'); return }

    // With a valid discount, sell price = computed sale and the base shows struck-through.
    // Without one, there's no discount: sell price = base and nothing is struck-through.
    const hasDiscount = computedSalePrice != null && computedSalePrice < base

    try {
      await onSubmit({
        ...form,
        price: hasDiscount ? computedSalePrice : base,
        originalPrice: hasDiscount ? base : null,
        rating: Number(form.rating) || 0,
        reviews: Number(form.reviews) || 0,
      })
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save')
    }
  }

  const input =
    'w-full bg-gray-50 border border-gray-200 rounded-md px-3 py-2.5 text-sm placeholder-gray-400 focus:outline-none focus:border-black focus:bg-white transition-colors'
  const lbl = 'font-mono text-[10px] tracking-widest uppercase text-gray-500 block mb-1.5'

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.97 }}
        transition={{ duration: 0.2 }}
        className="relative bg-white rounded-xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 shrink-0">
          <div>
            <p className="font-mono text-[10px] tracking-widest uppercase text-gray-400">
              {initial?.id ? 'Edit' : 'New'}
            </p>
            <h2 className="text-lg font-semibold">
              {initial?.id ? 'Edit product' : 'Add product'}
            </h2>
          </div>
          <button onClick={onClose} className="p-2 rounded-md hover:bg-gray-100 text-gray-500">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="overflow-y-auto p-6 space-y-6">
          {error && (
            <div className="border border-red-200 bg-red-50 rounded-md px-3 py-2 text-sm text-red-700">
              {error}
            </div>
          )}

          {/* ── Basic info ── */}
          <div className="space-y-4">
            <SectionTitle>Basic info</SectionTitle>
            <div>
              <label className={lbl}>Name</label>
              <input
                required
                value={form.name}
                onChange={(e) => update('name', e.target.value)}
                placeholder="7titaaa OG Hoodie"
                className={input}
              />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className={lbl}>Category</label>
                <select
                  required
                  value={form.category}
                  onChange={(e) => update('category', e.target.value)}
                  className={input}
                >
                  <option value="">— Select —</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.name}>{c.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className={lbl}>Size</label>
                <select
                  value={form.size}
                  onChange={(e) => update('size', e.target.value)}
                  className={input}
                >
                  <option value="">— Select —</option>
                  {sizes.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className={lbl}>Type</label>
                <select
                  value={form.type}
                  onChange={(e) => update('type', e.target.value)}
                  className={input}
                >
                  {types.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* ── Pricing ── */}
          <div className="space-y-3">
            <SectionTitle>Pricing</SectionTitle>

            <div className="flex gap-4 items-end">
              {/* Actual price (the base price; struck-through when discounted) */}
              <div className="flex-1">
                <label className={lbl}>Actual price (DH)</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={form.originalPrice ?? ''}
                  onChange={(e) => update('originalPrice', e.target.value)}
                  placeholder="200.00"
                  className={input}
                />
              </div>

              {/* Discount — percent off or fixed DH amount off */}
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1.5">
                  <label className={lbl} style={{ marginBottom: 0 }}>Discount (optional)</label>
                  <div className="flex rounded-md overflow-hidden border border-gray-200 text-[10px] font-mono tracking-widest">
                    <button
                      type="button"
                      onClick={() => setPriceMode('dh')}
                      className={`px-2.5 py-1 uppercase transition-colors ${priceMode === 'dh' ? 'bg-black text-white' : 'bg-white text-gray-400 hover:text-gray-700'}`}
                    >
                      DH
                    </button>
                    <button
                      type="button"
                      onClick={() => setPriceMode('pct')}
                      className={`px-2.5 py-1 uppercase transition-colors ${priceMode === 'pct' ? 'bg-black text-white' : 'bg-white text-gray-400 hover:text-gray-700'}`}
                    >
                      %
                    </button>
                  </div>
                </div>

                {priceMode === 'dh' ? (
                  <div className="relative">
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={dhInput}
                      onChange={(e) => setDhInput(e.target.value)}
                      placeholder="40.00"
                      className={input + ' pr-10'}
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm pointer-events-none">DH</span>
                  </div>
                ) : (
                  <div className="relative">
                    <input
                      type="number"
                      step="1"
                      min="1"
                      max="99"
                      value={pctInput}
                      onChange={(e) => setPctInput(e.target.value)}
                      placeholder="20"
                      className={input + ' pr-8'}
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm pointer-events-none">%</span>
                  </div>
                )}
              </div>
            </div>

            {/* Computed sell price shown below both inputs */}
            <div className="flex justify-end">
              {computedSalePrice != null ? (
                <span className="inline-flex items-center gap-1.5 font-mono text-[10px] tracking-widest">
                  <span className="text-gray-400">Sell price →</span>
                  <span className="bg-black text-white px-2 py-0.5 rounded-md font-semibold">
                    {computedSalePrice.toFixed(2)} DH
                  </span>
                </span>
              ) : (
                <p className="font-mono text-[9px] tracking-widest text-gray-400">
                  No discount — sells at the actual price
                </p>
              )}
            </div>
          </div>

          {/* ── Images ── */}
          <div className="space-y-4">
            <SectionTitle>Images</SectionTitle>

            {/* Main image */}
            <div>
              <label className={lbl}>Main image</label>
              <input ref={mainFileRef} type="file" accept="image/*" onChange={handleMainFile} className="hidden" />
              <div className="flex items-start gap-3">
                {form.image ? (
                  <div className="relative group shrink-0">
                    <img
                      src={resolveImageUrl(form.image)}
                      alt="preview"
                      className="w-28 h-28 object-cover rounded-md bg-gray-100 border border-gray-200"
                    />
                    <button
                      type="button"
                      onClick={() => update('image', '')}
                      className="absolute -top-1.5 -right-1.5 bg-black text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X size={11} />
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => mainFileRef.current?.click()}
                    className="w-28 h-28 shrink-0 rounded-md border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100 hover:border-gray-400 flex flex-col items-center justify-center gap-1.5 text-gray-500 transition-colors"
                  >
                    {mainUploading ? <Loader2 size={22} className="animate-spin" /> : (
                      <><ImagePlus size={22} /><span className="font-mono text-[9px] tracking-widest uppercase">Upload</span></>
                    )}
                  </button>
                )}
                <div className="flex-1 pt-1 text-xs text-gray-500 space-y-1">
                  <p>JPG, PNG, WEBP, GIF or AVIF — max 5 MB.</p>
                  {form.image && (
                    <button
                      type="button"
                      onClick={() => mainFileRef.current?.click()}
                      disabled={mainUploading}
                      className="inline-flex items-center gap-1.5 text-xs font-medium text-black hover:underline disabled:opacity-50"
                    >
                      {mainUploading ? <Loader2 size={12} className="animate-spin" /> : <Upload size={12} />}
                      {mainUploading ? 'Uploading…' : 'Replace image'}
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Extra images */}
            <div>
              <label className={lbl}>Additional images</label>
              <input ref={extraFileRef} type="file" accept="image/*" multiple onChange={handleExtraFiles} className="hidden" />
              <div className="flex flex-wrap gap-2">
                {form.images?.map((url, i) => (
                  <div key={i} className="relative group">
                    <img src={resolveImageUrl(url)} alt="" className="w-20 h-20 object-cover rounded-md bg-gray-100 border border-gray-200" />
                    <button
                      type="button"
                      onClick={() => removeImage(i)}
                      className="absolute -top-1.5 -right-1.5 bg-black text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X size={11} />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => extraFileRef.current?.click()}
                  disabled={extraUploading}
                  className="w-20 h-20 rounded-md border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100 hover:border-gray-400 flex flex-col items-center justify-center gap-1 text-gray-500 transition-colors disabled:opacity-50"
                >
                  {extraUploading ? <Loader2 size={18} className="animate-spin" /> : (
                    <><Plus size={18} /><span className="font-mono text-[8px] tracking-widest uppercase">Add</span></>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* ── Details ── */}
          <div className="space-y-4">
            <SectionTitle>Details</SectionTitle>

            <div>
              <label className={lbl}>Description</label>
              <textarea
                rows={3}
                value={form.description}
                onChange={(e) => update('description', e.target.value)}
                placeholder="The signature 7titaaa hoodie…"
                className={input}
              />
            </div>

            <div>
              <label className={lbl}>Tags</label>
              <div className="flex gap-2">
                <input
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                  placeholder="streetwear"
                  className={input}
                />
                <button
                  type="button"
                  onClick={addTag}
                  className="px-3 rounded-md bg-black text-white text-sm flex items-center gap-1.5 hover:bg-gray-800 shrink-0"
                >
                  <Plus size={14} /> Add
                </button>
              </div>
              {form.tags?.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {form.tags.map((t, i) => (
                    <span key={i} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-gray-100 text-xs">
                      {t}
                      <button type="button" onClick={() => removeTag(i)}><X size={10} /></button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Quality stars */}
            <div>
              <label className={lbl}>Quality</label>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => update('quality', star)}
                    className="p-0.5 transition-transform hover:scale-110 focus:outline-none"
                    aria-label={`${star} star${star > 1 ? 's' : ''}`}
                  >
                    <svg
                      className={`w-7 h-7 transition-colors ${star <= (form.quality || 0) ? 'text-amber-400' : 'text-gray-200'}`}
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                  </button>
                ))}
                <span className="ml-2 font-mono text-[11px] tracking-widest text-gray-400">
                  {form.quality || 0}/5
                </span>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-md text-sm text-gray-600 hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2 rounded-md bg-black text-white text-sm font-medium hover:bg-gray-800 disabled:opacity-50"
            >
              {submitting ? 'Saving…' : initial?.id ? 'Save changes' : 'Create product'}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  )
}

export default function ProductFormModal({ open, initial, onClose, onSubmit, submitting }) {
  return (
    <AnimatePresence>
      {open && (
        <ProductForm
          initial={initial}
          onClose={onClose}
          onSubmit={onSubmit}
          submitting={submitting}
        />
      )}
    </AnimatePresence>
  )
}

export { Trash2 }
