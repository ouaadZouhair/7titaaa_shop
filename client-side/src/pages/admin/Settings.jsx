import { useState } from 'react'
import { motion } from 'motion/react'
import { Check, Loader2 } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

const input =
  'w-full bg-gray-50 border border-gray-200 rounded-md px-3 py-2.5 text-sm placeholder-gray-400 focus:outline-none focus:border-black focus:bg-white transition-colors'
const label = 'font-mono text-[10px] tracking-widest uppercase text-gray-500 block mb-1.5'

function Card({ title, description, children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white border border-gray-200 rounded-xl p-5 max-w-xl"
    >
      <h2 className="font-semibold mb-1">{title}</h2>
      <p className="text-sm text-gray-500 mb-5">{description}</p>
      {children}
    </motion.div>
  )
}

function Banner({ kind, children }) {
  const styles =
    kind === 'success'
      ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
      : 'border-red-200 bg-red-50 text-red-700'
  return (
    <div className={`border rounded-md px-3 py-2 text-sm ${styles}`}>{children}</div>
  )
}

function ProfileForm() {
  const { user, updateProfile } = useAuth()
  const [name, setName] = useState(user?.name || '')
  const [email, setEmail] = useState(user?.email || '')
  const [submitting, setSubmitting] = useState(false)
  const [status, setStatus] = useState(null)

  const onSubmit = async (e) => {
    e.preventDefault()
    setStatus(null)
    setSubmitting(true)
    try {
      await updateProfile(name.trim(), email.trim())
      setStatus({ kind: 'success', message: 'Profile updated.' })
    } catch (err) {
      setStatus({ kind: 'error', message: err.response?.data?.message || 'Update failed' })
    } finally {
      setSubmitting(false)
    }
  }

  const dirty = name.trim() !== (user?.name || '') || email.trim() !== (user?.email || '')

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      {status && <Banner kind={status.kind}>{status.message}</Banner>}
      <div>
        <label className={label}>Name</label>
        <input
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          className={input}
          placeholder="Your name"
        />
      </div>
      <div>
        <label className={label}>Email</label>
        <input
          required
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={input}
          placeholder="you@example.com"
        />
      </div>
      <div className="flex items-center justify-between pt-2">
        <p className="font-mono text-[10px] tracking-widest uppercase text-gray-400">
          Role: {user?.role}
        </p>
        <button
          type="submit"
          disabled={submitting || !dirty}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-black text-white text-sm font-medium hover:bg-gray-800 disabled:opacity-40"
        >
          {submitting ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />}
          {submitting ? 'Saving…' : 'Save changes'}
        </button>
      </div>
    </form>
  )
}

function PasswordForm() {
  const { changePassword } = useAuth()
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [status, setStatus] = useState(null)

  const onSubmit = async (e) => {
    e.preventDefault()
    setStatus(null)
    if (newPassword.length < 6) {
      setStatus({ kind: 'error', message: 'New password must be at least 6 characters' })
      return
    }
    if (newPassword !== confirm) {
      setStatus({ kind: 'error', message: 'Passwords do not match' })
      return
    }
    setSubmitting(true)
    try {
      await changePassword(currentPassword, newPassword)
      setStatus({ kind: 'success', message: 'Password updated.' })
      setCurrentPassword('')
      setNewPassword('')
      setConfirm('')
    } catch (err) {
      setStatus({ kind: 'error', message: err.response?.data?.message || 'Update failed' })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      {status && <Banner kind={status.kind}>{status.message}</Banner>}
      <div>
        <label className={label}>Current password</label>
        <input
          required
          type="password"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          className={input}
          placeholder="••••••••"
        />
      </div>
      <div>
        <label className={label}>New password</label>
        <input
          required
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className={input}
          placeholder="At least 6 characters"
        />
      </div>
      <div>
        <label className={label}>Confirm new password</label>
        <input
          required
          type="password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          className={input}
          placeholder="Re-enter new password"
        />
      </div>
      <div className="flex justify-end pt-2">
        <button
          type="submit"
          disabled={submitting}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-black text-white text-sm font-medium hover:bg-gray-800 disabled:opacity-40"
        >
          {submitting ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />}
          {submitting ? 'Updating…' : 'Update password'}
        </button>
      </div>
    </form>
  )
}

export default function Settings() {
  return (
    <div>
      <div className="mb-8">
        <p className="font-mono text-[10px] tracking-widest uppercase text-gray-400 mb-2">Account</p>
        <h1 className="text-3xl font-semibold tracking-tight">Settings</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card title="Profile" description="Update your account name and email.">
          <ProfileForm />
        </Card>
        <Card title="Password" description="Change the password you use to log in.">
          <PasswordForm />
        </Card>
      </div>
    </div>
  )
}
