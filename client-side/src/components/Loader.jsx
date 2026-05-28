import { motion } from 'motion/react'
import logo from '../assets/7titaaa_logo2.svg'
import avatar from '../assets/profiel/ZouhairOD_profiel.webp'

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
      </motion.div>

  

      {/* Dots
      <div className="flex gap-2">
        {[0, 1, 2].map(i => (
          <motion.span
            key={i}
            className="w-1.5 h-1.5 rounded-full bg-primary"
            animate={{ opacity: [0.2, 1, 0.2], scale: [0.8, 1.2, 0.8] }}
            transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2 }}
          />
        ))}
      </div> */}

      {/* Portfolio credit card */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 1.2 }}
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
    </motion.div>
  )
}
