export default function SkeletonCard() {
  return (
    <div className="rounded-sm overflow-hidden bg-white border border-gray-100">
      <div className="skeleton aspect-[3/4] w-full" />
      <div className="p-4 space-y-2">
        <div className="skeleton h-3 w-16 rounded-full" />
        <div className="skeleton h-4 w-3/4 rounded-full" />
        <div className="skeleton h-4 w-1/2 rounded-full" />
      </div>
    </div>
  )
}
