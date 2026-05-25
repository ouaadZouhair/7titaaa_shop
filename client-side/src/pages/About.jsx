import { motion, useInView } from 'motion/react'
import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import AnimatedButton from '../components/AnimatedButton'
import vintageStore from '../assets/photos/vintage_store.jpg'

function Reveal({ children, delay = 0, className = '' }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 35 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.65, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

const values = [
  { icon: '🔥', titleKey: 'about.values.authenticityTitle', descKey: 'about.values.authenticityDesc' },
  { icon: '✊', titleKey: 'about.values.communityTitle', descKey: 'about.values.communityDesc' },
  { icon: '♻️', titleKey: 'about.values.qualityTitle', descKey: 'about.values.qualityDesc' },
]

export default function About() {
  const { t } = useTranslation()
  return (
    <div>
      {/* Hero */}
      <section className="relative py-28 px-6 overflow-hidden">
        <img
          src={vintageStore}
          alt="Vintage store"
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-black/60" />
        <div className="max-w-5xl mx-auto relative">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-mono text-[11px] tracking-[0.5em] text-primary-light uppercase mb-5"
          >
            {t('about.whoWeAre')}
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.7 }}
            className="font-display text-7xl md:text-9xl text-white tracking-wide leading-none mb-8"
          >
            {t('about.the')}
            <br />
            <span className="gradient-text">{t('about.story')}</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-white/50 text-lg max-w-xl leading-relaxed"
          >
            {t('about.intro')}
          </motion.p>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-gray-50 px-6">
        <div className="max-w-7xl mx-auto">
          <Reveal className="text-center mb-14">
            <p className="font-mono text-[11px] tracking-[0.5em] text-primary uppercase mb-3">{t('about.whatWeStandFor')}</p>
            <h2 className="font-display text-5xl text-street-black tracking-wide">{t('about.ourValues')}</h2>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {values.map((v, i) => (
              <Reveal key={v.titleKey} delay={i * 0.1}>
                <motion.div
                  whileHover={{ y: -4 }}
                  className="bg-white p-8 rounded-sm border border-gray-100 hover:shadow-lg hover:shadow-black/5 transition-shadow"
                >
                  <span className="text-4xl mb-4 block">{v.icon}</span>
                  <h3 className="font-display text-2xl text-street-black tracking-wide mb-3">{t(v.titleKey)}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{t(v.descKey)}</p>
                </motion.div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-20 bg-street-black px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { n: '2023', label: t('about.stats.founded') },
              { n: '10K+', label: t('about.stats.customers') },
              { n: '200+', label: t('about.stats.pieces') },
              { n: '15+', label: t('about.stats.countries') },
            ].map(({ n, label }, i) => (
              <Reveal key={label} delay={i * 0.1} className="text-center">
                <p className="font-display text-5xl md:text-6xl text-white mb-2">{n}</p>
                <p className="font-mono text-[10px] tracking-[0.4em] text-white/30 uppercase">{label}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 text-center">
        <Reveal>
          <h2 className="font-display text-5xl text-street-black tracking-wide mb-4">
            {t('about.readyToWear')}
          </h2>
          <p className="text-gray-400 text-sm mb-8 max-w-md mx-auto">
            {t('about.exploreDrops')}
          </p>
          <Link to="/shop">
            <AnimatedButton variant="gradient" className="mx-auto px-12 py-4">
              {t('about.shopNow')}
            </AnimatedButton>
          </Link>
        </Reveal>
      </section>
    </div>
  )
}
