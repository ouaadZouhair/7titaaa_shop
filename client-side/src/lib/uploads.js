import api from './api'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
const SERVER_ORIGIN = API_URL.replace(/\/api\/?$/, '')

export function resolveImageUrl(url) {
  if (!url) return ''
  if (/^https?:\/\//i.test(url) || url.startsWith('data:') || url.startsWith('blob:')) return url
  if (url.startsWith('/')) return `${SERVER_ORIGIN}${url}`
  return url
}

export async function uploadImage(file) {
  const formData = new FormData()
  formData.append('file', file)
  const { data } = await api.post('/uploads', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return data.url
}
