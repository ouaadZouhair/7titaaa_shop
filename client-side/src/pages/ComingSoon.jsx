import { useEffect, useState } from 'react'
import { motion } from 'motion/react'
import logo from '../assets/7titaaa_logo2.svg'
import avatar from '../assets/profiel/ZouhairOD_profiel.webp'

/* Launch target — change this to your real drop date. */
const LAUNCH_DATE = new Date('2026-06-01T00:00:00')

const getTimeLeft = (target) => {
  const diff = Math.max(0, target.getTime() - Date.now())
  return {
    days: Math.floor(diff / 86400000),
    hours: Math.floor((diff / 3600000) % 24),
    minutes: Math.floor((diff / 60000) % 60),
    seconds: Math.floor((diff / 1000) % 60),
    done: diff === 0,
  }
}

const pad = (n) => String(n).padStart(2, '0')

function CountUnit({ value, label }) {
  return (
    <div className="flex flex-col items-center">
      <div className="relative w-16 sm:w-24 h-20 sm:h-28 rounded-lg bg-street-gray border border-white/10 overflow-hidden flex items-center justify-center">
        {/* center seam line, like a split-flap counter */}
        <span className="absolute left-0 right-0 top-1/2 h-px bg-black/40 z-10" />
        <motion.span
          key={value}
          initial={{ y: -14, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="font-display text-5xl sm:text-7xl leading-none text-white tabular-nums"
        >
          {pad(value)}
        </motion.span>
      </div>
      <span className="mt-3 font-mono text-[9px] sm:text-[10px] tracking-[0.3em] uppercase text-white/40">
        {label}
      </span>
    </div>
  )
}

export default function ComingSoon({ target = LAUNCH_DATE }) {
  const [time, setTime] = useState(() => getTimeLeft(target))

  useEffect(() => {
    const id = setInterval(() => setTime(getTimeLeft(target)), 1000)
    return () => clearInterval(id)
  }, [target])

  return (
    <div className="fixed inset-0 bg-street-black flex flex-col items-center justify-center px-6 z-[9999] overflow-hidden">
      {/* subtle animated glow backdrop */}
      <motion.div
        aria-hidden
        className="absolute -top-1/3 left-1/2 -translate-x-1/2 w-[120vw] h-[120vw] rounded-full"
        style={{ background: 'radial-gradient(circle, rgba(22,163,74,0.18) 0%, transparent 60%)' }}
        animate={{ scale: [1, 1.08, 1], opacity: [0.6, 0.9, 0.6] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Logo */}
      <motion.img
        src={logo}
        alt="7titaaa"
        className="relative h-24 sm:h-28 w-auto mb-8"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      />

      {/* Heading */}
      <motion.div
        className="relative text-center mb-10"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.15 }}
      >
        <p className="font-mono text-[10px] sm:text-xs tracking-[0.5em] uppercase text-primary mb-3">
          {time.done ? 'We are live' : 'Dropping soon'}
        </p>
        <h1 className="font-display text-5xl sm:text-7xl text-white tracking-wide">
          Coming Soon
        </h1>
      </motion.div>

      {/* Countdown */}
      <motion.div
        className="relative flex items-start gap-3 sm:gap-5"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        <CountUnit value={time.days} label="Days" />
        <span className="font-display text-4xl sm:text-6xl text-white/30 leading-none mt-5 sm:mt-7">:</span>
        <CountUnit value={time.hours} label="Hours" />
        <span className="font-display text-4xl sm:text-6xl text-white/30 leading-none mt-5 sm:mt-7">:</span>
        <CountUnit value={time.minutes} label="Minutes" />
        <span className="font-display text-4xl sm:text-6xl text-white/30 leading-none mt-5 sm:mt-7">:</span>
        <CountUnit value={time.seconds} label="Seconds" />
      </motion.div>

      {/* Portfolio credit */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 1 }}
        className="absolute bottom-6 left-0 right-0 flex justify-center"
      >
        <a
          href="https://zouhairod.vercel.app/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-4 px-6 py-2 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/10 transition-all duration-200 group"
        >
          <img
            src={avatar}
            alt="ZouhairOD"
            className="w-10 h-10 rounded-full object-cover shrink-0 border border-white/20 group-hover:scale-105 transition-transform"
          />
          <div className="text-left">
            <p className="font-mono text-[9px] tracking-widest uppercase text-white/50 leading-none mb-0.5">
              Created by
            </p>
            <p className="font-mono text-[11px] tracking-wider text-white font-medium leading-none">
              ZouhairOD
            </p>
          </div>
        </a>
      </motion.div>
    </div>
  )
}
