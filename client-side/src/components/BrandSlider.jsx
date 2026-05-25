/*
 * BrandSlider — uses import.meta.glob instead of 20 individual static imports.
 * This keeps them out of the main JS chunk and lets Vite hash + cache each
 * PNG as a separate asset.  All logos get loading="lazy" + decoding="async"
 * because they are below-the-fold on first paint.
 */
const logoModules = import.meta.glob(
  '../assets/brand/*.png',
  { eager: true, query: '?url', import: 'default' }
)
const brandLogos = Object.values(logoModules)

const N        = brandLogos.length
const DURATION = 60

export default function BrandSlider() {
  return (
    <section className="py-4 bg-street-black border-y border-white/5">
      <div className="brand-wrapper">
        {brandLogos.map((src, i) => {
          const delay = -((DURATION / N) * (N - 1 - i))
          return (
            <div
              key={i}
              className="brand-logo"
              style={{ animationDelay: `${delay}s` }}
            >
              <img
                src={src}
                alt="brand logo"
                className="h-12 w-auto object-contain"
                loading="lazy"
                decoding="async"
                draggable={false}
              />
            </div>
          )
        })}
      </div>
    </section>
  )
}
