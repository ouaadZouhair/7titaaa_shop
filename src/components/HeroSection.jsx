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
            className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-[2s] ease-out group-hover:scale-105"
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
          <div className="absolute inset-0 bg-black/50" />
        </div>
      </div>

      {/* ── Divider ── */}
      {/* vertical on desktop */}
      <div className="hidden md:block absolute inset-y-0 left-1/2 w-px bg-white/25 z-10" />
      {/* horizontal on mobile */}
      <div className="md:hidden absolute top-1/2 inset-x-0 h-px bg-white/25 z-10" />

      {/* ── Centered text overlay ── */}
      <div className="relative z-20 h-full flex flex-col items-center justify-center text-center px-6 gap-2">

        <motion.div
          initial={{ opacity: 0, y: 36 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}

        >
          <img src={logo} alt="7titaaa" className="w-64 md:w-96 lg:w-[30rem] w-auto" />
        </motion.div>


        {/* <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.7, ease: 'easeOut' }}
          className="text-white text-sm md:text-xl uppercase font-normal mt-5 mb-8 tracking-wide"
        >
          Old but Gold
        </motion.p> */}

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
            {/* animated background fill */}
            <span className="absolute inset-0 border-2 border-white" />
            <span className="absolute inset-0 bg-white translate-x-[-101%] group-hover:translate-x-0 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]" />

            <span className="relative font-mono text-xs sm:text-sm tracking-[0.35em] uppercase text-white group-hover:text-black transition-colors duration-300 font-bold">
              Shop Now
            </span>

            {/* arrow */}
            <span className="relative flex items-center overflow-hidden w-5 h-4">
              <svg
                className="absolute w-4 h-4 text-white group-hover:text-black transition-colors duration-300 translate-x-0 group-hover:translate-x-5 transition-transform duration-300 ease-in"
                fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
              <svg
                className="absolute w-4 h-4 text-black -translate-x-5 group-hover:translate-x-0 transition-transform duration-300 ease-out"
                fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </span>
          </Link>
        </motion.div>
      </div>

    </section>
  )
}
