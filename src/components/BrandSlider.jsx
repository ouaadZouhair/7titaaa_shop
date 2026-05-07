import { brands } from '../data/products'

export default function BrandSlider() {
  const doubled = [...brands, ...brands]

  return (
    <section className="py-12 bg-street-black border-y border-white/5 overflow-hidden">
      {/* <p className="font-mono text-[10px] text-white/30 tracking-[0.5em] uppercase text-center mb-8">
        Stocked Brands
      </p> */}
      <div className="relative overflow-hidden">
        <div className="brand-slider flex items-center gap-16 whitespace-nowrap">
          {doubled.map((brand, i) => (
            <div
              key={i}
              className="group flex-shrink-0 flex items-center gap-3 cursor-default"
            >
              <span
                className="font-display text-2xl md:text-3xl text-white/20 group-hover:text-white transition-all duration-300 tracking-widest select-none"
              >
                {brand.logo}
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-white/10 group-hover:bg-primary transition-colors duration-300" />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
