import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, useInView } from 'motion/react'
import { categories } from '../data/products'
import { useProducts } from '../hooks/useProducts'
import ProductCard from '../components/ProductCard'
import SkeletonCard from '../components/SkeletonCard'
import CategoryCard from '../components/CategoryCard'
import BrandSlider from '../components/BrandSlider'
import AnimatedButton from '../components/AnimatedButton'
import HeroSection from '../components/HeroSection'
import VideoGrid from '../components/VideoGrid'

/* ─── Shared reveal variant ─── */
const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
}

function Section({ children, className = '' }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  return (
    <motion.div
      ref={ref}
      variants={fadeUp}
      initial="hidden"
      animate={inView ? 'show' : 'hidden'}
      className={className}
    >
      {children}
    </motion.div>
  )
}

export default function Home() {
  const { items: newDrops, loading } = useProducts({ limit: 8 })

  return (
    <div>
      {/* ─── HERO ─── */}
      <HeroSection />

      {/* ─── BRAND SLIDER ─── */}
      <BrandSlider />

      {/* ─── THE STORY ─── */}
      <section className="py-20 px-6 max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
        <Section>
          <VideoGrid />
        </Section>

        <Section>
          <p className="font-mono text-sm tracking-[0.4em] text-primary uppercase mb-4">Who We Are</p>
          <h2 className="font-display text-6xl text-street-black tracking-wide mb-6">
            THE STORY
          </h2>
          <div className="space-y-4 text-gray-500 leading-relaxed">
            <p>
              7tita is a Moroccan brand that popped off in 2023, and we're basically obsessed with street culture skateboarding, hip-hop, breakdancing, all that good stuff.
            </p>
            <p>
              So we started selling second-hand vintage clothes because, honestly, that's where the real style is at. basically anything that screams authentic street aesthetic.
            </p>
            <p>
              The whole thing is about getting your hands on genuine vintage pieces that have actual history and character. It's way more interesting than new stuff, and it's way easier on your wallet too. If you're trying to build that real streetwear vibe, we got you covered.
            </p>
          </div>
        </Section>
      </section>

      {/* ─── CATEGORIES GRID ─── */}
      <section className="py-20 px-6 max-w-screen-2xl mx-auto">
        <Section className="mb-12 text-center">
          <p className="font-mono text-sm tracking-[0.5em] text-primary uppercase mb-3">Browse By</p>
          <h2 className="font-display text-6xl md:text-6xl text-street-black tracking-wide">
            CATEGORIES
          </h2>
        </Section>

        {/* Asymmetrical grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 md:grid-rows-2 gap-4 h-auto md:h-150">
          {/* Big card — Hoodies */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="col-span-2 md:col-span-1 md:row-span-2"
          >
            <CategoryCard category={categories[0]} className="h-96 md:h-full" />
          </motion.div>

          {/* Small cards */}
          {categories.slice(1).map((cat, i) => (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: (i + 1) * 0.1, duration: 0.5 }}
            >
              <CategoryCard category={cat} className="h-72 md:h-full" />
            </motion.div>
          ))}
        </div>
      </section>

      {/* ─── DARK BANNER ─── */}
      <section
        className="py-20 text-center overflow-hidden"
        style={{ background: 'linear-gradient(135deg,#0a0a0a 0%,#111827 50%,#0a0a0a 100%)' }}
      >
        <Section>
          <p className="font-mono text-[11px] tracking-[0.5em] text-primary-light uppercase mb-4">
            Limited Edition
          </p>
          <h2 className="font-display text-6xl md:text-8xl text-white tracking-wider mb-6">
            DROP <span className="gradient-text">SEASON</span>
          </h2>
          <p className="text-white/40 text-sm max-w-md mx-auto mb-8 leading-relaxed">
            Exclusive pieces that sell out fast. Sign up to get first access to every drop.
          </p>
          <Link to="/shop">
            <AnimatedButton variant="primary" className="mx-auto">
              See All Drops
            </AnimatedButton>
          </Link>
        </Section>
      </section>

      {/* ─── NEW DROPS ─── */}
      <section className="py-20 px-6 max-w-7xl mx-auto">
        <Section className="flex items-end justify-between mb-12">
          <div>
            <p className="font-mono text-[11px] tracking-[0.5em] text-primary uppercase mb-3">Just Landed</p>
            <h2 className="font-display text-5xl md:text-6xl text-street-black tracking-wide">
              NEW DROPS
            </h2>
          </div>
          <Link
            to="/shop"
            className="hidden sm:flex items-center gap-2 font-mono text-xs tracking-widest uppercase text-street-black/50 hover:text-street-black transition-colors group"
          >
            View All
            <motion.svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
              animate={{ x: 0 }}
              whileHover={{ x: 4 }}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </motion.svg>
          </Link>
        </Section>

        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {loading
            ? Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)
            : newDrops.map((product, i) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-50px' }}
                  transition={{ delay: i * 0.07, duration: 0.5 }}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
        </div>
      </section>

      {/* ─── FINAL CTA ─── */}
      <section className="py-24 bg-primary text-white text-center relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              'repeating-linear-gradient(45deg, white 0px, white 1px, transparent 1px, transparent 10px)',
          }}
        />
        <Section className="relative z-10">
          <h2 className="font-display text-5xl md:text-7xl tracking-wider mb-4">
            JOIN THE MOVEMENT
          </h2>
          <p className="font-mono text-[11px] tracking-[0.4em] opacity-70 uppercase mb-8">
            Free shipping on orders over $100
          </p>
          <Link to="/shop">
            <AnimatedButton variant="dark" className="mx-auto text-sm px-10 py-4">
              Shop The Collection
            </AnimatedButton>
          </Link>
        </Section>
      </section>
    </div>
  )
}
