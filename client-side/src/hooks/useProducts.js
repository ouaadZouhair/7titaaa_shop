import { useEffect, useState } from 'react'
import api from '../lib/api'

export function useProducts(params = {}) {
  const key = JSON.stringify(params)
  const [state, setState] = useState({ items: [], total: 0, loading: true, error: null })

  useEffect(() => {
    let cancelled = false
    api.get('/products', { params: JSON.parse(key) }).then(
      ({ data }) => {
        if (!cancelled) setState({ items: data.items, total: data.total, loading: false, error: null })
      },
      (err) => {
        if (!cancelled) setState((s) => ({ ...s, loading: false, error: err }))
      }
    )
    return () => { cancelled = true }
  }, [key])

  return state
}

export function useProduct(id) {
  const [state, setState] = useState({ product: null, loading: true, error: null })

  useEffect(() => {
    if (!id) return
    let cancelled = false
    api.get(`/products/${id}`).then(
      ({ data }) => {
        if (!cancelled) setState({ product: data.product, loading: false, error: null })
      },
      (err) => {
        if (!cancelled) setState((s) => ({ ...s, loading: false, error: err }))
      }
    )
    return () => { cancelled = true }
  }, [id])

  return state
}
