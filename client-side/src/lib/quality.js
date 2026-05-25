// Quality tier → badge color. Higher tier = more premium color.
export const QUALITY_BADGE_COLOR = {
  5: 'bg-cyan-300 text-cyan-900 ring-1 ring-cyan-200',
  4: 'bg-slate-400 text-white',
  3: 'bg-amber-400 text-black',
  2: 'bg-zinc-300 text-zinc-800',
  1: 'bg-amber-700 text-amber-50',
}

export const qualityBadgeColor = (quality) =>
  QUALITY_BADGE_COLOR[quality] || 'bg-zinc-300 text-zinc-800'
