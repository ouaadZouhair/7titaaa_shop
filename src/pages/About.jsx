import { motion, useInView } from 'motion/react'
import { useRef } from 'react'
import { Link } from 'react-router-dom'
import AnimatedButton from '../components/AnimatedButton'

function Reveal({ children, delay = 0, className = '' }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 35 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.65, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

const values = [
  {
    icon: '🔥',
    title: 'Authenticity',
    desc: 'Every drop is rooted in real street culture, not trend-chasing. We stay true to the art.',
  },
  {
    icon: '✊',
    title: 'Community',
    desc: 'Built for the people who live the lifestyle — creators, artists, and anyone who moves different.',
  },
  {
    icon: '♻️',
    title: 'Quality',
    desc: 'Premium fabrics, proper construction. Gear that lasts longer than the season.',
  },
]

export default function About() {
  return (
    <div>
      {/* Hero */}
      <section className="relative bg-street-black py-28 px-6 overflow-hidden">
        <div
          className="absolute inset-0 opacity-20"
          style={{
            background:
              'radial-gradient(ellipse 70% 60% at 30% 40%, rgba(22,163,74,0.3) 0%, transparent 70%)',
          }}
        />
        <div className="max-w-5xl mx-auto relative">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-mono text-[11px] tracking-[0.5em] text-primary-light uppercase mb-5"
          >
            Who We Are
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.7 }}
            className="font-display text-7xl md:text-9xl text-white tracking-wide leading-none mb-8"
          >
            THE
            <br />
            <span className="gradient-text">STORY</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-white/50 text-lg max-w-xl leading-relaxed"
          >
            7titaaa was born on the corner of creativity and culture. What started as a local hustle turned into a movement that spans continents.
          </motion.p>
        </div>
      </section>

      {/* Story section */}
      <section className="py-20 px-6 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <Reveal>
          <div className="rounded-sm overflow-hidden aspect-[4/5]">
            <img
              src="https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800&q=80&fit=crop"
              alt="Street culture"
              className="w-full h-full object-cover"
            />
          </div>
        </Reveal>

        <Reveal delay={0.15}>
          <p className="font-mono text-[11px] tracking-[0.4em] text-primary uppercase mb-4">Our Origin</p>
          <h2 className="font-display text-5xl text-street-black tracking-wide mb-6">
            FROM THE
            <br />
            BLOCK UP
          </h2>
          <div className="space-y-4 text-gray-500 leading-relaxed">
            <p>
              7titaaa started in a small apartment with a sewing machine, a vision, and a deep respect for hip-hop culture. The name itself is a nod to the raw energy of the streets — the number 7 representing perfection, and "titaaa" the raw creative spirit of our founders.
            </p>
            <p>
              Every collection is a chapter in that story. We don't follow trends — we document culture. Our designers live the lifestyle, collaborate with artists, and source only from suppliers who share our standards.
            </p>
            <p>
              Today, 7titaaa pieces are worn by creatives, athletes, and culture-shapers across the globe. But the mission stays the same: make gear worthy of the movement.
            </p>
          </div>
        </Reveal>
      </section>

      {/* Values */}
      <section className="py-20 bg-gray-50 px-6">
        <div className="max-w-7xl mx-auto">
          <Reveal className="text-center mb-14">
            <p className="font-mono text-[11px] tracking-[0.5em] text-primary uppercase mb-3">What We Stand For</p>
            <h2 className="font-display text-5xl text-street-black tracking-wide">OUR VALUES</h2>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {values.map((v, i) => (
              <Reveal key={v.title} delay={i * 0.1}>
                <motion.div
                  whileHover={{ y: -4 }}
                  className="bg-white p-8 rounded-sm border border-gray-100 hover:shadow-lg hover:shadow-black/5 transition-shadow"
                >
                  <span className="text-4xl mb-4 block">{v.icon}</span>
                  <h3 className="font-display text-2xl text-street-black tracking-wide mb-3">{v.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{v.desc}</p>
                </motion.div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-20 bg-street-black px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { n: '2019', label: 'Founded' },
              { n: '10K+', label: 'Customers' },
              { n: '200+', label: 'Pieces' },
              { n: '15+', label: 'Countries' },
            ].map(({ n, label }, i) => (
              <Reveal key={label} delay={i * 0.1} className="text-center">
                <p className="font-display text-5xl md:text-6xl text-white mb-2">{n}</p>
                <p className="font-mono text-[10px] tracking-[0.4em] text-white/30 uppercase">{label}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 text-center">
        <Reveal>
          <h2 className="font-display text-5xl text-street-black tracking-wide mb-4">
            READY TO WEAR THE CULTURE?
          </h2>
          <p className="text-gray-400 text-sm mb-8 max-w-md mx-auto">
            Explore the latest drops and find your piece of the movement.
          </p>
          <Link to="/shop">
            <AnimatedButton variant="gradient" className="mx-auto px-12 py-4">
              Shop Now
            </AnimatedButton>
          </Link>
        </Reveal>
      </section>
    </div>
  )
}
