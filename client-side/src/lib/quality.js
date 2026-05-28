// Quality tier → badge color. Condition scale: red → orange → gold → green → premium blue.
export const QUALITY_BADGE_COLOR = {
  1: 'bg-[#E53935] text-white', // Mauvais état
  2: 'bg-[#FB8C00] text-white', // État correct
  3: 'bg-[#FBC02D] text-black', // Bon état
  4: 'bg-[#43A047] text-white', // Très bon état
  5: 'bg-[#1E88E5] text-white', // Comme neuf / Premium
}

export const qualityBadgeColor = (quality) =>
  QUALITY_BADGE_COLOR[quality] || 'bg-zinc-300 text-zinc-800'
