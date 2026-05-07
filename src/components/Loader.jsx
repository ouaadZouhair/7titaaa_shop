import { motion } from 'motion/react'
import logo from '../assets/7titaaa_logo2.png'

export default function Loader() {
  return (
    <motion.div
      className="fixed inset-0 bg-street-black flex flex-col items-center justify-center z-[9999]"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.6, ease: 'easeInOut' } }}
    >
      {/* Logo text */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-10 text-center"
      >
        <img src={logo} alt="7titaaa" className="h-32 w-auto mx-auto" />
        <p className="font-mono text-md text-primary-light tracking-[0.4em] mt-3 uppercase">
          OLD BUT GOLD
        </p>
      </motion.div>

      {/* Progress bar */}
      <div className="w-48 h-[2px] bg-white/10 rounded-full overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          style={{ background: 'linear-gradient(90deg,#16a34a,#f97316,#ef4444)' }}
          initial={{ width: '0%' }}
          animate={{ width: '100%' }}
          transition={{ duration: 2, ease: 'easeInOut' }}
        />
      </div>

      {/* Dots */}
      <div className="flex gap-2 mt-8">
        {[0, 1, 2].map(i => (
          <motion.span
            key={i}
            className="w-1.5 h-1.5 rounded-full bg-primary"
            animate={{ opacity: [0.2, 1, 0.2], scale: [0.8, 1.2, 0.8] }}
            transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2 }}
          />
        ))}
      </div>
    </motion.div>
  )
}
