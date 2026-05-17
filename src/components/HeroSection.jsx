import { Link } from 'react-router-dom'
import { motion } from 'motion/react'
import { useTranslation } from 'react-i18next'
import logo from '../assets/7titaaa_logo2.png'

import img01 from '../assets/models/boy.webp'
import img02 from '../assets/models/girl.jpg'
import img03 from '../assets/models/590413679_17970789932969156_4592203785171936302_n (1).jpg'
import img04 from '../assets/models/504347689_17952921794969156_8772316407192285191_n.jpg'
import img05 from '../assets/models/696165364_18001869431920447_2789845196117067919_n.jpg'
import img06 from '../assets/models/518849160_18083323135893206_2102176718512879495_n.jpg'
import img07 from '../assets/models/619272255_18075698900524120_4153231285528011367_n (1).jpg'
import img08 from '../assets/models/491497233_17946816218969156_6635177325462533080_n.webp'
import img09 from '../assets/models/491415327_17946816251969156_469767335891881817_n.webp'
import img10 from '../assets/models/491414862_17946815435969156_690518253769815890_n.jpg'
import img11 from '../assets/models/491417259_17946815567969156_7666448665183027299_n.jpg'
import img12 from '../assets/models/673119761_17988323720969156_6917203205749899167_n.jpg'
import img13 from '../assets/models/684662062_17961517062086078_2170316714431441376_n.jpg'
import img14 from '../assets/models/685574939_17961517092086078_4077759634093135190_n.jpg'

const leftImages  = [img01, img03, img05, img07, img09, img11, img13]
const rightImages = [img02, img04, img06, img08, img10, img12, img14]

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

  return (
    <>
      <style>{`@keyframes ${name}{${buildKeyframes(n, direction)}}`}</style>
      <div
        className="flex flex-col w-full"
        style={{ animation: `${name} ${total}s linear infinite`, willChange: 'transform' }}
      >
        {[...images, ...images].map((src, i) => (
          <div key={i} className="relative w-full shrink-0" style={{ height: '100vh' }}>
            <img
              src={src}
              alt=""
              className="w-full h-full object-cover object-center"
              loading={i < 2 ? 'eager' : 'lazy'}
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
          <img src={logo} alt="7titaaa" className="w-64 md:w-96 lg:w-120" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55, duration: 0.7, ease: 'easeOut' }}
          className="mt-4"
        >
          <Link
            to="/shop"
            className="group relative inline-flex items-center gap-3 px-8 py-3.5 sm:px-10 sm:py-4 overflow-hidden"
          >
            <span className="absolute inset-0 border-2 border-white" />
            <span className="absolute inset-0 bg-white translate-x-[-101%] group-hover:translate-x-0 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]" />
            <span className="relative font-mono text-xs sm:text-sm tracking-[0.35em] uppercase text-white group-hover:text-black transition-colors duration-300 font-bold">
              {t('hero.cta')}
            </span>
            <span className="relative flex items-center overflow-hidden w-5 h-4">
              <svg className="absolute w-4 h-4 text-white group-hover:text-black translate-x-0 group-hover:translate-x-5 transition-all duration-300 ease-in"
                fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
              <svg className="absolute w-4 h-4 text-black -translate-x-5 group-hover:translate-x-0 transition-transform duration-300 ease-out"
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
