import logo1  from '../assets/brand/Adobe Express - file.png'
import logo2  from '../assets/brand/561a21d347804764bf20b4a9879946af-removebg-preview.png'
import logo3  from '../assets/brand/2e93a98f-e1a6-4fce-b7f0-4788de13e019_removalai_preview.png'
import logo4  from '../assets/brand/5c9e6425-78c8-4168-8931-d71a67d7488a_removalai_preview.png'
import logo5  from '../assets/brand/828c2cb4-9059-4cf1-962c-d34ccd49af4f_removalai_preview.png'
import logo6  from '../assets/brand/de32fced-66e3-443f-8417-81db6eee6ec6_removalai_preview.png'
import logo7  from '../assets/brand/1a4e7f41-c836-4820-8e94-6caf215b8ce2_removalai_preview.png'
import logo8  from '../assets/brand/5bab23c9-d154-4fd4-a452-3aa317ec396e_removalai_preview.png'
import logo9  from '../assets/brand/60c62831-624e-43fb-8ef0-1872bc28b26f_removalai_preview.png'
import logo10 from '../assets/brand/775553cf-9115-4cbf-b3a6-43b08500e6c3_removalai_preview.png'
import logo11 from '../assets/brand/9ba3f0f2-dd59-47d1-b8a6-072d686bc635_removalai_preview.png'
import logo12 from '../assets/brand/6f71f84f-6def-4ec0-956f-79cb52c91221_removalai_preview.png'
import logo13 from '../assets/brand/3f1f03c8-ebb0-486d-a3ea-7eb3c000e50a_removalai_preview.png'
import logo14 from '../assets/brand/7c2401b29b1bf508184ebc7a12546bdf-removebg-preview (2).png'
import logo15 from '../assets/brand/54eb2bc73ee5941c2006078419a1fed2-removebg-preview.png'
import logo16 from '../assets/brand/fba0d521e04ddccf136d2316006757dc-removebg-preview.png'
import logo17 from '../assets/brand/7866739aa0305a517744ab40e5526c7b-removebg-preview.png'
import logo18 from '../assets/brand/43ce4be266ad77b1669141e58de698bd-removebg-preview.png'
import logo19 from '../assets/brand/9b6217f7038f597954a9f5993aafe97a-removebg-preview.png'
import logo20 from '../assets/brand/08a74ab543bd3825179ed868142b196f-removebg-preview.png'

const brandLogos = [
  logo1, logo2, logo3, logo4, logo5, logo6, logo7, logo8, logo9,
  logo10, logo11, logo12, logo13, logo14, logo15, logo16, logo17, logo18,
  logo19, logo20
]

const N = brandLogos.length
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
                draggable={false}
              />
            </div>
          )
        })}
      </div>
    </section>
  )
}
