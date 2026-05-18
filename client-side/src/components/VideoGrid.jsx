import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'

const videoModules = import.meta.glob('../assets/videos/*.mp4', { eager: true, query: '?url', import: 'default' })
const videos = Object.values(videoModules)

export default function VideoGrid() {
  const [current, setCurrent] = useState(0)
  const [direction, setDirection] = useState(1)

  const go = (i) => {
    setDirection(i > current ? 1 : -1)
    setCurrent(i)
  }

  const goNext = () => {
    setDirection(1)
    setCurrent((p) => (p + 1) % videos.length)
  }

  return (
    <div className="flex flex-row gap-2 max-w-md mx-auto lg:mx-0">
      {/* Thumbnails column — left */}
      <div className="flex flex-col gap-1.5">
        {videos.map((v, i) => (
          <motion.div
            key={i}
            onClick={() => go(i)}
            whileTap={{ scale: 0.92 }}
            className={`cursor-pointer rounded-sm overflow-hidden border-2 transition-all duration-200 w-20 shrink-0 ${
              i === current
                ? 'border-primary scale-105'
                : 'border-transparent opacity-50 hover:opacity-80'
            }`}
            style={{ aspectRatio: '1/1' }}
          >
            <video
              src={v}
              autoPlay
              muted
              loop
              playsInline
              className="w-full h-full object-cover"
            />
          </motion.div>
        ))}
      </div>

      {/* Big video — right */}
      <div className="rounded-sm overflow-hidden bg-black relative flex-1" style={{ aspectRatio: '9/14' }}>
        <AnimatePresence mode="wait" custom={direction}>
          <motion.video
            key={current}
            custom={direction}
            src={videos[current]}
            autoPlay
            muted
            playsInline
            onEnded={goNext}
            initial={{ opacity: 0, scale: 1.08 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.94 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-0 w-full h-full object-cover"
          />
        </AnimatePresence>
      </div>
    </div>
  )
}
