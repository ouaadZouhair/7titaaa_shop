const logoModules = import.meta.glob(
  '../assets/brands/*.png',
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
