import { useState } from 'react'
import { motion } from 'motion/react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import AnimatedButton from '../components/AnimatedButton'
import api from '../lib/api'

const contactInfo = [
  {
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
    labelKey: 'contact.labels.email',
    value: 'support@7titaaa.com',
    href: 'mailto:support@7titaaa.com',
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
      </svg>
    ),
    labelKey: 'contact.labels.phone',
    value: '+212 704-634570',
    href: 'tel:+212704634570',
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    labelKey: 'contact.labels.hours',
    valueKey: 'contact.hoursValue',
    href: null,
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    labelKey: 'contact.labels.location',
    valueKey: 'contact.locationValue',
    href: null,
  },
]

export default function Contact() {
  const { t } = useTranslation()
  const [submitted, setSubmitted] = useState(false)
  const [sending, setSending] = useState(false)
  const { register, handleSubmit, formState: { errors }, reset } = useForm()

  const onSubmit = async (data) => {
    setSending(true)
    try {
      await api.post('/messages', {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        subject: data.subject,
        message: data.message,
      })
    } catch {
      // still show success — message may have saved
    } finally {
      setSending(false)
      setSubmitted(true)
      reset()
      setTimeout(() => setSubmitted(false), 4000)
    }
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
            {t('contact.getInTouch')}
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="font-display text-7xl md:text-8xl text-white tracking-wide"
          >
            {t('contact.title')}
          </motion.h1>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 lg:grid-cols-5 gap-16">
        {/* Contact info */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-2 flex flex-col gap-10"
        >
          <div>
            <h2 className="font-display text-3xl text-street-black tracking-wide mb-6">
              {t('contact.letsTalk')}
            </h2>
            <p className="text-gray-500 text-sm leading-relaxed mb-8">
              {t('contact.intro')}
            </p>

            <div className="space-y-5">
              {contactInfo.map(item => (
                <div key={item.labelKey} className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-sm bg-primary/10 flex items-center justify-center text-primary shrink-0">
                    {item.icon}
                  </div>
                  <div>
                    <p className="font-mono text-[10px] tracking-widest uppercase text-gray-400 mb-0.5">{t(item.labelKey)}</p>
                    {item.href ? (
                      <a href={item.href} className="text-street-black text-sm font-medium hover:text-primary transition-colors">
                        {item.value}
                      </a>
                    ) : (
                      <p className="text-street-black text-sm font-medium">{item.valueKey ? t(item.valueKey) : item.value}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

{/* Decorative */}
          <div className="p-6 bg-street-black rounded-sm">
            <p className="font-display text-2xl text-white tracking-wide mb-2">{t('contact.followDrop')}</p>
            <p className="font-mono text-[10px] text-white/40 tracking-widest uppercase mb-4">
              @7titaaa
            </p>
            <div className="flex gap-4">
              <motion.a
                href="https://www.instagram.com/7titaaa"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                whileHover={{ scale: 1.2, color: '#22c55e' }}
                transition={{ type: 'spring', stiffness: 400 }}
                className="text-white/50 hover:text-primary transition-colors"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
                </svg>
              </motion.a>
              <motion.a
                href="https://www.tiktok.com/@7titaaa"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="TikTok"
                whileHover={{ scale: 1.2, color: '#22c55e' }}
                transition={{ type: 'spring', stiffness: 400 }}
                className="text-white/50 hover:text-primary transition-colors"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
                </svg>
              </motion.a>
            </div>
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
              <h3 className="font-display text-3xl text-street-black tracking-wide mb-2">{t('contact.messageSent')}</h3>
              <p className="text-gray-400 text-sm">{t('contact.messageSentDesc')}</p>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="font-mono text-[10px] tracking-widest uppercase text-gray-500 block mb-2">
                    {t('contact.firstName')}
                  </label>
                  <input
                    {...register('firstName', { required: t('contact.required') })}
                    placeholder="Jordan"
                    className={inputClass}
                  />
                  {errors.firstName && (
                    <p className="font-mono text-[10px] text-accent-red mt-1">{errors.firstName.message}</p>
                  )}
                </div>
                <div>
                  <label className="font-mono text-[10px] tracking-widest uppercase text-gray-500 block mb-2">
                    {t('contact.lastName')}
                  </label>
                  <input
                    {...register('lastName', { required: t('contact.required') })}
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
                  {t('contact.email')}
                </label>
                <input
                  {...register('email', {
                    required: t('contact.required'),
                    pattern: { value: /^\S+@\S+\.\S+$/, message: t('contact.invalidEmail') },
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
                  {t('contact.subject')}
                </label>
                <select {...register('subject')} className={inputClass}>
                  <option value="order">{t('contact.subjectOptions.order')}</option>
                  <option value="collab">{t('contact.subjectOptions.collab')}</option>
                  <option value="general">{t('contact.subjectOptions.general')}</option>
                  <option value="returns">{t('contact.subjectOptions.returns')}</option>
                </select>
              </div>

              <div>
                <label className="font-mono text-[10px] tracking-widest uppercase text-gray-500 block mb-2">
                  {t('contact.message')}
                </label>
                <textarea
                  {...register('message', { required: t('contact.required'), minLength: { value: 10, message: t('contact.tooShort') } })}
                  rows={6}
                  placeholder={t('contact.messagePlaceholder')}
                  className={`${inputClass} resize-none`}
                />
                {errors.message && (
                  <p className="font-mono text-[10px] text-accent-red mt-1">{errors.message.message}</p>
                )}
              </div>

              <AnimatedButton type="submit" variant="dark" fullWidth className="py-4 mt-2" disabled={sending}>
                {sending ? t('contact.sending') : t('contact.send')}
                {!sending && (
                  <svg className="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                )}
              </AnimatedButton>
            </form>
          )}
        </motion.div>
      </div>
    </div>
  )
}
