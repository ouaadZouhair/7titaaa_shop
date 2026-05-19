import { useRef, useState } from 'react'
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
  isNew: false,
  isFeatured: false,
  rating: 0,
  reviews: 0,
  tags: [],
}

function ProductForm({ initial, onClose, onSubmit, submitting }) {
  const [form, setForm] = useState(() =>
    initial ? { ...emptyProduct, ...initial } : emptyProduct
  )
  const [tagInput, setTagInput] = useState('')
  const [error, setError] = useState('')
  const [mainUploading, setMainUploading] = useState(false)
  const [extraUploading, setExtraUploading] = useState(false)
  const mainFileRef = useRef(null)
  const extraFileRef = useRef(null)

  const update = (key, value) => setForm((f) => ({ ...f, [key]: value }))

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
    if (!form.image) {
      setError('Please upload a main image')
      return
    }
    try {
      await onSubmit({
        ...form,
        price: Number(form.price),
        originalPrice: form.originalPrice === '' || form.originalPrice == null ? null : Number(form.originalPrice),
        rating: Number(form.rating) || 0,
        reviews: Number(form.reviews) || 0,
      })
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save')
    }
  }

  const input =
    'w-full bg-gray-50 border border-gray-200 rounded-md px-3 py-2.5 text-sm placeholder-gray-400 focus:outline-none focus:border-black focus:bg-white transition-colors'
  const label = 'font-mono text-[10px] tracking-widest uppercase text-gray-500 block mb-1.5'

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
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <div>
                <p className="font-mono text-[10px] tracking-widest uppercase text-gray-400">
                  {initial?.id ? 'Edit' : 'New'}
                </p>
                <h2 className="text-lg font-semibold">
                  {initial?.id ? 'Edit product' : 'Add product'}
                </h2>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-md hover:bg-gray-100 text-gray-500"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="overflow-y-auto p-6 space-y-5">
              {error && (
                <div className="border border-red-200 bg-red-50 rounded-md px-3 py-2 text-sm text-red-700">
                  {error}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className={label}>Name</label>
                  <input
                    required
                    value={form.name}
                    onChange={(e) => update('name', e.target.value)}
                    placeholder="7titaaa OG Hoodie"
                    className={input}
                  />
                </div>

                <div>
                  <label className={label}>Price</label>
                  <input
                    required
                    type="number"
                    step="0.01"
                    min="0"
                    value={form.price}
                    onChange={(e) => update('price', e.target.value)}
                    placeholder="89.99"
                    className={input}
                  />
                </div>
                <div>
                  <label className={label}>Original price</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={form.originalPrice ?? ''}
                    onChange={(e) => update('originalPrice', e.target.value)}
                    placeholder="120.00"
                    className={input}
                  />
                </div>

                <div>
                  <label className={label}>Category</label>
                  <input
                    required
                    value={form.category}
                    onChange={(e) => update('category', e.target.value)}
                    placeholder="Hoodies"
                    className={input}
                  />
                </div>
                <div>
                  <label className={label}>Size</label>
                  <input
                    value={form.size}
                    onChange={(e) => update('size', e.target.value)}
                    placeholder="M"
                    className={input}
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className={label}>Main image</label>
                  <input
                    ref={mainFileRef}
                    type="file"
                    accept="image/*"
                    onChange={handleMainFile}
                    className="hidden"
                  />
                  <div className="flex items-start gap-3">
                    {form.image ? (
                      <div className="relative group">
                        <img
                          src={resolveImageUrl(form.image)}
                          alt="preview"
                          className="w-32 h-32 object-cover rounded-md bg-gray-100 border border-gray-200"
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
                        className="w-32 h-32 rounded-md border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100 hover:border-gray-400 flex flex-col items-center justify-center gap-1.5 text-gray-500 transition-colors"
                      >
                        {mainUploading ? (
                          <Loader2 size={22} className="animate-spin" />
                        ) : (
                          <>
                            <ImagePlus size={22} />
                            <span className="font-mono text-[9px] tracking-widest uppercase">Upload</span>
                          </>
                        )}
                      </button>
                    )}
                    <div className="flex-1 pt-1 text-xs text-gray-500">
                      <p>JPG, PNG, WEBP, GIF or AVIF.</p>
                      <p>Max 5 MB.</p>
                      {form.image && (
                        <button
                          type="button"
                          onClick={() => mainFileRef.current?.click()}
                          disabled={mainUploading}
                          className="mt-2 inline-flex items-center gap-1.5 text-xs font-medium text-black hover:underline disabled:opacity-50"
                        >
                          {mainUploading ? <Loader2 size={12} className="animate-spin" /> : <Upload size={12} />}
                          {mainUploading ? 'Uploading…' : 'Replace image'}
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label className={label}>Additional images</label>
                  <input
                    ref={extraFileRef}
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleExtraFiles}
                    className="hidden"
                  />
                  <div className="flex flex-wrap gap-2">
                    {form.images?.map((url, i) => (
                      <div key={i} className="relative group">
                        <img
                          src={resolveImageUrl(url)}
                          alt=""
                          className="w-20 h-20 object-cover rounded-md bg-gray-100 border border-gray-200"
                        />
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
                      {extraUploading ? (
                        <Loader2 size={18} className="animate-spin" />
                      ) : (
                        <>
                          <Plus size={18} />
                          <span className="font-mono text-[8px] tracking-widest uppercase">Add</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label className={label}>Description</label>
                  <textarea
                    rows={3}
                    value={form.description}
                    onChange={(e) => update('description', e.target.value)}
                    placeholder="The signature 7titaaa hoodie…"
                    className={input}
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className={label}>Tags</label>
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
                      className="px-3 rounded-md bg-black text-white text-sm flex items-center gap-1.5 hover:bg-gray-800"
                    >
                      <Plus size={14} /> Add
                    </button>
                  </div>
                  {form.tags?.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-3">
                      {form.tags.map((t, i) => (
                        <span
                          key={i}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-gray-100 text-xs"
                        >
                          {t}
                          <button type="button" onClick={() => removeTag(i)}>
                            <X size={10} />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-6 sm:col-span-2 pt-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={!!form.isNew}
                      onChange={(e) => update('isNew', e.target.checked)}
                      className="w-4 h-4 accent-black"
                    />
                    <span className="text-sm">Mark as New</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={!!form.isFeatured}
                      onChange={(e) => update('isFeatured', e.target.checked)}
                      className="w-4 h-4 accent-black"
                    />
                    <span className="text-sm">Featured</span>
                  </label>
                </div>
              </div>

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
