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
      </motion.div>

  

      {/* Dots */}
      <div className="flex gap-2">
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
