import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8">
      <Skeleton className="h-8 w-48 rounded mb-2" />
      <Skeleton className="h-4 w-72 rounded mb-8" />

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="rounded-xl border bg-card p-4">
            <Skeleton className="h-3 w-20 rounded mb-2" />
            <Skeleton className="h-5 w-28 rounded" />
          </div>
        ))}
      </div>

      <Skeleton className="h-6 w-40 rounded mb-4" />
      <div className="flex gap-3 mb-8">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="w-56 rounded-xl border bg-card p-4 flex-shrink-0">
            <Skeleton className="h-4 w-12 rounded mb-3" />
            <Skeleton className="h-4 w-32 rounded" />
          </div>
        ))}
      </div>

      <Skeleton className="h-6 w-40 rounded mb-4" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="rounded-xl border bg-card p-5">
            <div className="flex items-center gap-3 mb-3">
              <Skeleton className="h-9 w-9 rounded-full" />
              <Skeleton className="h-4 w-28 rounded" />
            </div>
            <Skeleton className="h-3 w-full rounded mb-1" />
            <Skeleton className="h-3 w-3/4 rounded mb-4" />
            <Skeleton className="h-4 w-20 rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}
