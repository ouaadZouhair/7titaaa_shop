import { Link } from 'react-router-dom'
import { motion } from 'motion/react'
import leftImage from '../assets/photos/boy.webp'
import rightImage from '../assets/photos/girl.jpg'
import logo from '../assets/7titaaa_logo2.png'

export default function HeroSection() {
  return (
    <section className="relative h-screen min-h-[600px] overflow-hidden">

      {/* ── Split background panels ── */}
      <div className="absolute inset-0 flex flex-col md:flex-row ">

        {/* LEFT — dark outfits */}
        <div className="h-1/2 md:h-full md:w-1/2 relative overflow-hidden group">
          <img
            src={leftImage}
            alt="Dark fashion"
            className="absolute inset-0 w-full h-full object-cover object-top transition-transform duration-[2s] ease-out group-hover:scale-105"
          />
          {/* dark dim */}
          <div className="absolute inset-0 bg-black/20" />
        </div>

        {/* RIGHT — light outfits */}
        <div className="h-1/2 md:h-full md:w-1/2 relative overflow-hidden group">
          <img
            src={rightImage}
            alt="Light fashion"
            className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-[2s] ease-out group-hover:scale-105"
          />
          {/* light dim */}
          <div className="absolute inset-0 bg-black/20" />
        </div>
      </div>

      {/* ── Divider ── */}
      {/* vertical on desktop */}
      <div className="hidden md:block absolute inset-y-0 left-1/2 w-px bg-white/25 z-10" />
      {/* horizontal on mobile */}
      <div className="md:hidden absolute top-1/2 inset-x-0 h-px bg-white/25 z-10" />

      {/* ── Centered text overlay ── */}
      <div className="relative z-20 h-full flex flex-col items-center justify-center text-center px-6 gap-2">

        <motion.h1
          initial={{ opacity: 0, y: 36 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col items-center text-white  leading-none tracking-tight select-none gap-2"
          style={{ fontSize: 'clamp(2.5rem, 7.5vw, 6.5rem)' }}
        >
          <span className='uppercasse' style={{ fontFamily: 'Jraot Regular, sans-serif' }}>OLD</span>
          <span className='uppercasse' style={{ fontFamily: 'Jraot Regular, sans-serif' }}>BUT Gold</span>
          <span className='text-green-500 text-[170px]' style={{ fontFamily: 'SuperDash, sans-serif'}}>7Tita</span>
        </motion.h1>

        {/* <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.7, ease: 'easeOut' }}
          className="text-white/50 text-sm md:text-base font-normal mt-5 mb-8 tracking-wide"
        >
          Add a little bit of body text
        </motion.p> */}

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55, duration: 0.7, ease: 'easeOut' }}
        >
          <Link
            to="/shop"
            className="inline-block bg-white text-black font-mono text-[16px] tracking-[0.4em] uppercase px-10 py-4 border border-white hover:bg-transparent hover:text-white transition-colors duration-200"
          >
            SHOP NOW
          </Link>
        </motion.div>
      </div>

    </section>
  )
}
