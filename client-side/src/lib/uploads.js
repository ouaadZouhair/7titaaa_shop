import api from './api'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
const SERVER_ORIGIN = API_URL.replace(/\/api\/?$/, '')

/** Max upload size in bytes (must match server multer limit). */
export const MAX_UPLOAD_BYTES = 300 * 1024 // 300 KB

export function resolveImageUrl(url) {
  if (!url) return ''
  if (/^https?:\/\//i.test(url) || url.startsWith('data:') || url.startsWith('blob:')) return url
  if (url.startsWith('/')) return `${SERVER_ORIGIN}${url}`
  return url
}

export async function uploadImage(file) {
  if (file.size > MAX_UPLOAD_BYTES) {
    const sizeKb = Math.round(file.size / 1024)
    throw new Error(`Image is ${sizeKb} KB. Max allowed is 300 KB.`)
  }
  const formData = new FormData()
  formData.append('file', file)
  const { data } = await api.post('/uploads', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return data.url
}
