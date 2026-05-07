import { useState } from 'react'
import { motion } from 'motion/react'
import { useForm } from 'react-hook-form'
import AnimatedButton from '../components/AnimatedButton'

const contactInfo = [
  {
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
    label: 'Email',
    value: 'support@7titaaa.com',
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    label: 'Hours',
    value: 'Mon–Fri, 9AM–6PM',
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    label: 'Location',
    value: 'Global — Ships Worldwide',
  },
]

export default function Contact() {
  const [submitted, setSubmitted] = useState(false)
  const { register, handleSubmit, formState: { errors }, reset } = useForm()

  const onSubmit = (data) => {
    console.log('Contact form:', data)
    setSubmitted(true)
    reset()
    setTimeout(() => setSubmitted(false), 4000)
  }

  const inputClass =
    'w-full bg-gray-50 border border-gray-200 rounded-sm px-4 py-3.5 text-sm text-street-black placeholder-gray-400 focus:outline-none focus:border-primary focus:bg-white transition-all duration-200'

  return (
    <div>
      {/* Header */}
      <section className="bg-street-black py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-mono text-[11px] tracking-[0.5em] text-primary-light uppercase mb-4"
          >
            Get in Touch
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="font-display text-7xl md:text-8xl text-white tracking-wide"
          >
            HIT US UP
          </motion.h1>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 lg:grid-cols-5 gap-16">
        {/* Contact info */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-2"
        >
          <h2 className="font-display text-3xl text-street-black tracking-wide mb-6">
            LET'S TALK
          </h2>
          <p className="text-gray-500 text-sm leading-relaxed mb-10">
            Questions about your order, collabs, or just want to talk street culture — slide into our inbox.
          </p>

          <div className="space-y-6">
            {contactInfo.map(item => (
              <div key={item.label} className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-sm bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                  {item.icon}
                </div>
                <div>
                  <p className="font-mono text-[10px] tracking-widest uppercase text-gray-400 mb-0.5">{item.label}</p>
                  <p className="text-street-black text-sm font-medium">{item.value}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Decorative */}
          <div className="mt-14 p-6 bg-street-black rounded-sm">
            <p className="font-display text-2xl text-white tracking-wide mb-2">FOLLOW THE DROP</p>
            <p className="font-mono text-[10px] text-white/40 tracking-widest uppercase">
              @7titaaa — Instagram / TikTok
            </p>
          </div>
        </motion.div>

        {/* Form */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="lg:col-span-3"
        >
          {submitted ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="h-full flex flex-col items-center justify-center text-center py-16"
            >
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="font-display text-3xl text-street-black tracking-wide mb-2">MESSAGE SENT!</h3>
              <p className="text-gray-400 text-sm">We'll get back to you within 24 hours.</p>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="font-mono text-[10px] tracking-widest uppercase text-gray-500 block mb-2">
                    First Name
                  </label>
                  <input
                    {...register('firstName', { required: 'Required' })}
                    placeholder="Jordan"
                    className={inputClass}
                  />
                  {errors.firstName && (
                    <p className="font-mono text-[10px] text-accent-red mt-1">{errors.firstName.message}</p>
                  )}
                </div>
                <div>
                  <label className="font-mono text-[10px] tracking-widest uppercase text-gray-500 block mb-2">
                    Last Name
                  </label>
                  <input
                    {...register('lastName', { required: 'Required' })}
                    placeholder="Williams"
                    className={inputClass}
                  />
                  {errors.lastName && (
                    <p className="font-mono text-[10px] text-accent-red mt-1">{errors.lastName.message}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="font-mono text-[10px] tracking-widest uppercase text-gray-500 block mb-2">
                  Email
                </label>
                <input
                  {...register('email', {
                    required: 'Required',
                    pattern: { value: /^\S+@\S+\.\S+$/, message: 'Invalid email' },
                  })}
                  type="email"
                  placeholder="you@example.com"
                  className={inputClass}
                />
                {errors.email && (
                  <p className="font-mono text-[10px] text-accent-red mt-1">{errors.email.message}</p>
                )}
              </div>

              <div>
                <label className="font-mono text-[10px] tracking-widest uppercase text-gray-500 block mb-2">
                  Subject
                </label>
                <select {...register('subject')} className={inputClass}>
                  <option value="order">Order Issue</option>
                  <option value="collab">Collaboration</option>
                  <option value="general">General Question</option>
                  <option value="returns">Returns & Refunds</option>
                </select>
              </div>

              <div>
                <label className="font-mono text-[10px] tracking-widest uppercase text-gray-500 block mb-2">
                  Message
                </label>
                <textarea
                  {...register('message', { required: 'Required', minLength: { value: 10, message: 'Too short' } })}
                  rows={6}
                  placeholder="What's good..."
                  className={`${inputClass} resize-none`}
                />
                {errors.message && (
                  <p className="font-mono text-[10px] text-accent-red mt-1">{errors.message.message}</p>
                )}
              </div>

              <AnimatedButton type="submit" variant="dark" fullWidth className="py-4 mt-2">
                Send Message
                <svg className="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </AnimatedButton>
            </form>
          )}
        </motion.div>
      </div>
    </div>
  )
}
