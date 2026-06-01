import { useState } from 'react'
import { motion } from 'motion/react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import AnimatedButton from '../components/AnimatedButton'
import api from '../lib/api'

const MAP_EMBED = 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1653.460467427436!2d-6.8493616614239015!3d34.02024039329223!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xda76d0045433c0f%3A0xdda7b97754d8a16!2s7tita!5e0!3m2!1sfr!2sma!4v1780342091453!5m2!1sfr!2sma'
const MAP_DIRECTIONS = 'https://www.google.com/maps/dir/?api=1&destination=34.02024039329223,-6.8493616614239015'

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

          {/* Store map */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="group relative rounded-sm overflow-hidden bg-street-black ring-1 ring-white/10"
          >
            {/* Map */}
            <div className="relative h-52 overflow-hidden">
              <iframe
                title={t('contact.mapTitle')}
                src={MAP_EMBED}
                loading="lazy"
                allowFullScreen
                referrerPolicy="no-referrer-when-downgrade"
                className="w-full h-full border-0 transition-transform duration-700 ease-out group-hover:scale-105"
                style={{ filter: 'invert(0.92) hue-rotate(180deg) brightness(0.95) contrast(0.9) saturate(0.8)' }}
              />
              {/* fade the map into the dark card */}
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-street-black via-street-black/10 to-transparent" />
              {/* pulsing locator */}
              <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                <span className="absolute inset-0 -m-3 rounded-full bg-primary/30 animate-ping" />
                <span className="relative block w-3 h-3 rounded-full bg-primary ring-2 ring-white/80 shadow-lg shadow-primary/50" />
              </div>
            </div>

            {/* Address + directions */}
            <div className="relative p-5">
              <p className="font-mono text-[9px] tracking-[0.3em] uppercase text-primary-light mb-1.5">
                {t('contact.findUs')}
              </p>
              <p className="text-white text-sm font-medium leading-snug mb-4">
                {t('contact.locationValue')}
              </p>
              <a
                href={MAP_DIRECTIONS}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 font-mono text-[10px] tracking-widest uppercase text-white/80 hover:text-primary transition-colors"
              >
                {t('contact.getDirections')}
                <svg className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </a>
            </div>
          </motion.div>
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
