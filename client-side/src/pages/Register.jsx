import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'motion/react'
import { useForm } from 'react-hook-form'
import { useAuth } from '../context/AuthContext'
import AnimatedButton from '../components/AnimatedButton'

export default function Register() {
  const { register: registerUser } = useAuth()
  const navigate = useNavigate()
  const [serverError, setServerError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const { register, handleSubmit, formState: { errors } } = useForm()

  const onSubmit = async (data) => {
    setServerError('')
    setSubmitting(true)
    try {
      await registerUser(data.name, data.email, data.password)
      navigate('/', { replace: true })
    } catch (err) {
      setServerError(err.response?.data?.message || 'Registration failed')
    } finally {
      setSubmitting(false)
    }
  }

  const inputClass =
    'w-full bg-gray-50 border border-gray-200 rounded-sm px-4 py-3.5 text-sm text-street-black placeholder-gray-400 focus:outline-none focus:border-primary focus:bg-white transition-all duration-200'

  return (
    <div>
      <section className="bg-street-black py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-mono text-[11px] tracking-[0.5em] text-primary-light uppercase mb-4"
          >
            Join the Crew
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="font-display text-7xl md:text-8xl text-white tracking-wide"
          >
            SIGN UP
          </motion.h1>
        </div>
      </section>

      <div className="max-w-md mx-auto px-6 py-16">
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-5"
        >
          {serverError && (
            <div className="border border-accent-red/30 bg-accent-red/5 rounded-sm px-4 py-3">
              <p className="font-mono text-[11px] tracking-widest uppercase text-accent-red">
                {serverError}
              </p>
            </div>
          )}

          <div>
            <label className="font-mono text-[10px] tracking-widest uppercase text-gray-500 block mb-2">
              Name
            </label>
            <input
              {...register('name', { required: 'Required', minLength: { value: 2, message: 'Too short' } })}
              placeholder="Jordan"
              className={inputClass}
            />
            {errors.name && (
              <p className="font-mono text-[10px] text-accent-red mt-1">{errors.name.message}</p>
            )}
          </div>

          <div>
            <label className="font-mono text-[10px] tracking-widest uppercase text-gray-500 block mb-2">
              Email
            </label>
            <input
              type="email"
              {...register('email', {
                required: 'Required',
                pattern: { value: /\S+@\S+\.\S+/, message: 'Invalid email' },
              })}
              placeholder="you@7titaaa.com"
              className={inputClass}
            />
            {errors.email && (
              <p className="font-mono text-[10px] text-accent-red mt-1">{errors.email.message}</p>
            )}
          </div>

          <div>
            <label className="font-mono text-[10px] tracking-widest uppercase text-gray-500 block mb-2">
              Password
            </label>
            <input
              type="password"
              {...register('password', {
                required: 'Required',
                minLength: { value: 6, message: 'At least 6 characters' },
              })}
              placeholder="••••••••"
              className={inputClass}
            />
            {errors.password && (
              <p className="font-mono text-[10px] text-accent-red mt-1">{errors.password.message}</p>
            )}
          </div>

          <div className="pt-2">
            <AnimatedButton type="submit" disabled={submitting} fullWidth>
              {submitting ? 'Creating account…' : 'Sign Up'}
            </AnimatedButton>
          </div>

          <p className="text-center text-sm text-gray-500 pt-4">
            Already have an account?{' '}
            <Link to="/login" className="text-street-black font-semibold hover:text-primary transition-colors">
              Log in
            </Link>
          </p>
        </motion.form>
      </div>
    </div>
  )
}
