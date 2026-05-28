import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'motion/react'

const videoModules = import.meta.glob('../assets/videos/*.mp4', { eager: true, query: '?url', import: 'default' })
const videos = Object.values(videoModules)

/* Seek-to-first-frame poster using a hidden canvas */
function useVideoPoster(src) {
  const [poster, setPoster] = useState(null)

  useEffect(() => {
    if (!src) return
    const video = document.createElement('video')
    video.src = src
    video.muted = true
    video.playsInline = true
    video.preload = 'metadata'
    video.currentTime = 0.5

    video.addEventListener('seeked', () => {
      try {
        const canvas = document.createElement('canvas')
        canvas.width  = video.videoWidth  || 160
        canvas.height = video.videoHeight || 160
        canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height)
        setPoster(canvas.toDataURL('image/jpeg', 0.7))
      } catch {
        /* cross-origin or decode error — no poster, fine */
      }
    }, { once: true })
  }, [src])

  return poster
}

/* Single thumbnail — only shows a poster image, no autoplay */
function Thumbnail({ src, active, onClick }) {
  const poster = useVideoPoster(src)

  return (
    <motion.div
      onClick={onClick}
      whileTap={{ scale: 0.92 }}
      className={`cursor-pointer rounded-sm overflow-hidden border-2 transition-all duration-200 w-20 shrink-0 ${
        active
          ? 'border-primary scale-105'
          : 'border-transparent opacity-50 hover:opacity-80'
      }`}
      style={{ aspectRatio: '1/1' }}
    >
      {poster ? (
        <img
          src={poster}
          alt="video thumbnail"
          className="w-full h-full object-cover"
          loading="lazy"
        />
      ) : (
        /* placeholder while poster generates */
        <div className="w-full h-full bg-neutral-800 skeleton" />
      )}
    </motion.div>
  )
}

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
    <div className="flex flex-col-reverse lg:flex-row gap-2 max-w-md mx-auto lg:mx-0">
      {/* Thumbnails — row below the video on mobile, column to the left on desktop */}
      <div className="flex flex-row lg:flex-col gap-1.5 flex-wrap justify-center lg:justify-start">
        {videos.map((v, i) => (
          <Thumbnail key={i} src={v} active={i === current} onClick={() => go(i)} />
        ))}
      </div>

      {/* Big video — only the active one plays */}
      <div className="rounded-sm overflow-hidden bg-black relative flex-1" style={{ aspectRatio: '9/14' }}>
        <AnimatePresence mode="wait" custom={direction}>
          <motion.video
            key={current}
            custom={direction}
            src={videos[current]}
            autoPlay
            muted
            playsInline
            preload="auto"
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
