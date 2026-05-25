import { Link } from 'react-router-dom'
import { motion } from 'motion/react'
import { useTranslation } from 'react-i18next'
import logo from '../assets/7titaaa_logo2.svg'

const modelModules = import.meta.glob(
  '../assets/models/*.{jpg,jpeg,webp,png}',
  { eager: true, query: '?url', import: 'default' }
)
const allImages   = Object.values(modelModules)
const leftImages  = allImages.filter((_, i) => i % 2 === 0)
const rightImages = allImages.filter((_, i) => i % 2 === 1)

const PAUSE = 5      // seconds each image is held
const SLIDE = 0.8    // seconds for the slide transition

function buildKeyframes(n, direction) {
  const total = n * (PAUSE + SLIDE)
  const ease  = 'cubic-bezier(0.22,1,0.36,1)'
  let kf = ''

  if (direction === 'up') {
    for (let i = 0; i < n; i++) {
      const t1 = ((i * (PAUSE + SLIDE)) / total * 100).toFixed(3)
      const t2 = ((i * (PAUSE + SLIDE) + PAUSE) / total * 100).toFixed(3)
      kf += `${t1}%{transform:translateY(-${i * 100}vh);animation-timing-function:${ease}}`
      kf += `${t2}%{transform:translateY(-${i * 100}vh);animation-timing-function:${ease}}`
    }
    kf += `100%{transform:translateY(-${n * 100}vh)}`
  } else {
    for (let i = 0; i < n; i++) {
      const t1 = ((i * (PAUSE + SLIDE)) / total * 100).toFixed(3)
      const t2 = ((i * (PAUSE + SLIDE) + PAUSE) / total * 100).toFixed(3)
      const y  = (n - i) * 100
      kf += `${t1}%{transform:translateY(-${y}vh);animation-timing-function:${ease}}`
      kf += `${t2}%{transform:translateY(-${y}vh);animation-timing-function:${ease}}`
    }
    kf += `100%{transform:translateY(0)}`
  }

  return kf
}

function ScrollStrip({ images, direction }) {
  const n     = images.length
  const total = n * (PAUSE + SLIDE)
  const name  = `heroStrip_${direction}`

  /*
   * Performance notes:
   *  - willChange:'transform' promotes each strip to its own GPU layer so
   *    the continuous CSS animation never triggers layout/paint.
   *  - The first image in each strip gets fetchpriority="high" so it's the
   *    browser's LCP candidate and downloaded before off-screen images.
   *  - All subsequent images are loading="lazy" so they only fetch when the
   *    strip is about to scroll them into view.
   */
  return (
    <>
      <style>{`@keyframes ${name}{${buildKeyframes(n, direction)}}`}</style>
      <div
        className="flex flex-col w-full"
        style={{
          animation: `${name} ${total}s linear infinite`,
          willChange: 'transform',
          /* Contain paint to this element — improves compositing */
          contain: 'layout style',
        }}
      >
        {[...images, ...images].map((src, i) => (
          <div key={i} className="relative w-full shrink-0" style={{ height: '100vh' }}>
            <img
              src={src}
              alt=""
              className="w-full h-full object-cover object-center"
              /* First image is LCP — load eagerly at high priority */
              loading={i === 0 ? 'eager' : 'lazy'}
              fetchPriority={i === 0 ? 'high' : 'low'}
              decoding={i === 0 ? 'sync' : 'async'}
            />
          </div>
        ))}
      </div>
    </>
  )
}

export default function HeroSection() {
  const { t } = useTranslation()

  return (
    <section className="relative h-screen min-h-150 overflow-hidden">

      {/* ── Split panels ── */}
      <div className="absolute inset-0 flex flex-col md:flex-row">

        {/* LEFT — scrolls up */}
        <div className="h-1/2 md:h-full md:w-1/2 relative overflow-hidden">
          <ScrollStrip images={leftImages} direction="up" />
          <div className="absolute inset-0 bg-black/20" />
        </div>

        {/* RIGHT — scrolls down */}
        <div className="h-1/2 md:h-full md:w-1/2 relative overflow-hidden">
          <ScrollStrip images={rightImages} direction="down" />
          <div className="absolute inset-0 bg-black/20" />
        </div>

      </div>

      {/* ── Divider ── */}
      <div className="hidden md:block absolute inset-y-0 left-1/2 w-px bg-white/25 z-10" />
      <div className="md:hidden absolute top-1/2 inset-x-0 h-px bg-white/25 z-10" />

      {/* ── Centered overlay ── */}
      <div className="relative z-20 h-full flex flex-col items-center justify-center text-center px-6 gap-2">

        <motion.div
          initial={{ opacity: 0, y: 36 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Logo is above-the-fold and important — no lazy loading */}
          <img
            src={logo}
            alt="7titaaa"
            className="w-64 md:w-96 lg:w-120"
            fetchPriority="high"
            decoding="sync"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55, duration: 0.7, ease: 'easeOut' }}
          className="mt-4"
        >
          <Link
            to="/shop"
            className="group relative inline-flex items-center gap-3 px-8 py-3.5 sm:px-10 sm:py-4 overflow-hidden bg-white"
          >
            <span className="absolute inset-0 border-2 border-white" />
            <span className="absolute inset-0 bg-primary translate-x-[-101%] group-hover:translate-x-0 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]" />
            <span className="relative font-mono text-xs sm:text-sm tracking-[0.35em] uppercase text-black group-hover:text-white transition-colors duration-300 font-bold">
              {t('hero.cta')}
            </span>
            <span className="relative flex items-center overflow-hidden w-5 h-4">
              <svg className="absolute w-4 h-4 text-black group-hover:text-white translate-x-0 group-hover:translate-x-5 transition-all duration-300 ease-in"
                fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
              <svg className="absolute w-4 h-4 text-white -translate-x-5 group-hover:translate-x-0 transition-transform duration-300 ease-out"
                fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </span>
          </Link>
        </motion.div>

      </div>
    </section>
  )
}
