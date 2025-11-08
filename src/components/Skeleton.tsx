export function Skeleton({ className = '' }: { className?: string }) {
  return <div className={`animate-pulse bg-gray-200 dark:bg-gray-700 ${className}`} />
}

export function CharacterCardSkeleton() {
  return (
    <div className="max-w-6xl mx-auto flex gap-4 p-3 border rounded-md border-gray-200 dark:border-gray-700">
      <Skeleton className="w-24 h-24 rounded" />
      <div className="flex-1 space-y-2">
        <Skeleton className="w-40 h-4" />
        <Skeleton className="w-24 h-4" />
        <Skeleton className="w-56 h-3" />
      </div>
    </div>
  )
}
