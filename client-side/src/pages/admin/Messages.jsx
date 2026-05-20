import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { Mail, MailOpen, Trash2, RefreshCw } from 'lucide-react'
import api from '../../lib/api'
import { useAdminCounts } from '../../context/AdminCountsContext'

const SUBJECT_LABELS = {
  order: 'Order Issue',
  collab: 'Collaboration',
  general: 'General Question',
  returns: 'Returns & Refunds',
}

const SUBJECT_COLORS = {
  order: 'bg-blue-100 text-blue-700',
  collab: 'bg-purple-100 text-purple-700',
  general: 'bg-gray-100 text-gray-600',
  returns: 'bg-amber-100 text-amber-700',
}

export default function Messages() {
  const [messages, setMessages] = useState([])
  const [total, setTotal] = useState(0)
  const [unread, setUnread] = useState(0)
  const [loading, setLoading] = useState(true)
  const [expanded, setExpanded] = useState(null)
  const { setMessages: setGlobalMessageCount, decrementMessages, incrementMessages } = useAdminCounts()

  const load = async () => {
    setLoading(true)
    try {
      const res = await api.get('/messages', { params: { limit: 100 } })
      setMessages(res.data.items)
      setTotal(res.data.total)
      setUnread(res.data.unread)
      setGlobalMessageCount(res.data.unread)
    } catch {
      // silent
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const handleExpand = async (msg) => {
    if (expanded?.id === msg.id) {
      setExpanded(null)
      return
    }
    setExpanded(msg)
    if (!msg.isRead) {
      await api.patch(`/messages/${msg.id}/read`, { isRead: true }).catch(() => {})
      setMessages(prev => prev.map(m => m.id === msg.id ? { ...m, isRead: true } : m))
      setUnread(prev => Math.max(0, prev - 1))
      decrementMessages()
    }
  }

  const handleDelete = async (id, e) => {
    e.stopPropagation()
    const target = messages.find(m => m.id === id)
    await api.delete(`/messages/${id}`).catch(() => {})
    setMessages(prev => prev.filter(m => m.id !== id))
    if (expanded?.id === id) setExpanded(null)
    setTotal(prev => prev - 1)
    if (target && !target.isRead) {
      setUnread(prev => Math.max(0, prev - 1))
      decrementMessages()
    }
  }

  const handleMarkUnread = async (msg, e) => {
    e.stopPropagation()
    await api.patch(`/messages/${msg.id}/read`, { isRead: false }).catch(() => {})
    setMessages(prev => prev.map(m => m.id === msg.id ? { ...m, isRead: false } : m))
    if (expanded?.id === msg.id) setExpanded(null)
    setUnread(prev => prev + 1)
    incrementMessages()
  }

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <p className="font-mono text-[10px] tracking-widest uppercase text-gray-400 mb-2">Inbox</p>
          <h1 className="text-3xl font-semibold tracking-tight flex items-center gap-3">
            Messages
            {unread > 0 && (
              <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-primary text-white text-[11px] font-bold">
                {unread}
              </span>
            )}
          </h1>
        </div>
        <button
          onClick={load}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm hover:bg-gray-50 transition-colors"
        >
          <RefreshCw size={14} />
          Refresh
        </button>
      </div>

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="bg-white border border-gray-200 rounded-xl h-16 animate-pulse" />
          ))}
        </div>
      ) : messages.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-xl py-20 text-center">
          <Mail size={36} className="mx-auto text-gray-200 mb-3" />
          <p className="font-mono text-[11px] tracking-widest uppercase text-gray-400">No messages yet</p>
        </div>
      ) : (
        <div className="space-y-2">
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              layout
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className={`bg-white border rounded-xl overflow-hidden transition-all cursor-pointer ${
                !msg.isRead ? 'border-primary/30 shadow-sm' : 'border-gray-200'
              }`}
              onClick={() => handleExpand(msg)}
            >
              {/* Row */}
              <div className="flex items-center gap-4 px-5 py-4">
                <div className={`shrink-0 ${!msg.isRead ? 'text-primary' : 'text-gray-300'}`}>
                  {msg.isRead ? <MailOpen size={18} /> : <Mail size={18} />}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className={`font-semibold text-sm truncate ${!msg.isRead ? 'text-gray-900' : 'text-gray-600'}`}>
                      {msg.firstName} {msg.lastName}
                    </span>
                    <span className={`shrink-0 px-2 py-0.5 rounded-full text-[10px] font-mono tracking-wider ${SUBJECT_COLORS[msg.subject] || SUBJECT_COLORS.general}`}>
                      {SUBJECT_LABELS[msg.subject] || msg.subject}
                    </span>
                    {!msg.isRead && (
                      <span className="shrink-0 w-2 h-2 rounded-full bg-primary" />
                    )}
                  </div>
                  <p className="text-xs text-gray-400 truncate">{msg.email} · {msg.message.substring(0, 80)}{msg.message.length > 80 ? '…' : ''}</p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className="font-mono text-[10px] text-gray-400 hidden sm:block">
                    {new Date(msg.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}
                  </span>
                  {msg.isRead && (
                    <button
                      onClick={(e) => handleMarkUnread(msg, e)}
                      title="Mark as unread"
                      className="p-1.5 rounded-md text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
                    >
                      <Mail size={14} />
                    </button>
                  )}
                  <button
                    onClick={(e) => handleDelete(msg.id, e)}
                    title="Delete"
                    className="p-1.5 rounded-md text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>

              {/* Expanded body */}
              <AnimatePresence>
                {expanded?.id === msg.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    className="overflow-hidden"
                  >
                    <div className="border-t border-gray-100 px-5 py-5 bg-gray-50">
                      <div className="flex flex-wrap gap-x-8 gap-y-2 mb-4 text-xs">
                        <div>
                          <span className="font-mono text-[10px] tracking-widest uppercase text-gray-400">From</span>
                          <p className="text-gray-700 font-medium mt-0.5">{msg.firstName} {msg.lastName}</p>
                        </div>
                        <div>
                          <span className="font-mono text-[10px] tracking-widest uppercase text-gray-400">Email</span>
                          <a href={`mailto:${msg.email}`} className="text-primary hover:underline block mt-0.5">{msg.email}</a>
                        </div>
                        <div>
                          <span className="font-mono text-[10px] tracking-widest uppercase text-gray-400">Date</span>
                          <p className="text-gray-700 mt-0.5">
                            {new Date(msg.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })}
                            {' · '}
                            {new Date(msg.createdAt).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                      </div>
                      <div className="bg-white rounded-lg border border-gray-200 p-4">
                        <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">{msg.message}</p>
                      </div>
                      <div className="mt-4">
                        <a
                          href={`mailto:${msg.email}?subject=Re: ${SUBJECT_LABELS[msg.subject] || msg.subject}`}
                          onClick={(e) => e.stopPropagation()}
                          className="inline-flex items-center gap-2 px-4 py-2 bg-black text-white text-xs font-mono tracking-wider rounded-lg hover:bg-gray-800 transition-colors"
                        >
                          <Mail size={13} />
                          Reply by Email
                        </a>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      )}

      {total > 0 && (
        <p className="font-mono text-[10px] tracking-widest uppercase text-gray-400 text-center mt-6">
          {total} message{total !== 1 ? 's' : ''} · {unread} unread
        </p>
      )}
    </div>
  )
}
