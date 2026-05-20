import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import api from '../lib/api'

const AdminCountsContext = createContext(null)

export function AdminCountsProvider({ children }) {
  const [counts, setCounts] = useState({ messages: 0, orders: 0 })

  const refresh = useCallback(async () => {
    try {
      const [msgRes, orderRes] = await Promise.all([
        api.get('/messages', { params: { limit: 1 } }),
        api.get('/orders', { params: { status: 'pending', limit: 1 } }),
      ])
      setCounts({
        messages: Number(msgRes.data?.unread) || 0,
        orders: Number(orderRes.data?.total) || 0,
      })
    } catch {
      // silent
    }
  }, [])

  useEffect(() => { refresh() }, [refresh])

  const decrementMessages = useCallback(() => {
    setCounts((c) => ({ ...c, messages: Math.max(0, c.messages - 1) }))
  }, [])

  const incrementMessages = useCallback(() => {
    setCounts((c) => ({ ...c, messages: c.messages + 1 }))
  }, [])

  const setMessages = useCallback((n) => {
    setCounts((c) => ({ ...c, messages: Math.max(0, Number(n) || 0) }))
  }, [])

  return (
    <AdminCountsContext.Provider value={{ counts, refresh, decrementMessages, incrementMessages, setMessages }}>
      {children}
    </AdminCountsContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAdminCounts() {
  const ctx = useContext(AdminCountsContext)
  if (!ctx) throw new Error('useAdminCounts must be used within AdminCountsProvider')
  return ctx
}
