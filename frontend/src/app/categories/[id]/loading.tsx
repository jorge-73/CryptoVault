import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 py-8">
      <Skeleton className="h-4 w-40 rounded mb-6" />
      <Skeleton className="h-8 w-48 rounded mb-2" />
      <Skeleton className="h-4 w-full max-w-xl rounded mb-6" />
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-8">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="rounded-xl border bg-card p-4">
            <Skeleton className="h-3 w-16 rounded mb-2" />
            <Skeleton className="h-5 w-24 rounded" />
          </div>
        ))}
      </div>
      <Skeleton className="h-6 w-20 rounded mb-4" />
      <div className="rounded-xl border bg-card overflow-hidden">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="flex items-center gap-4 px-4 py-3 border-b border-border/50 last:border-0"
          >
            <Skeleton className="h-4 w-6 rounded" />
            <Skeleton className="h-6 w-6 rounded-full" />
            <Skeleton className="h-4 w-24 rounded flex-1" />
            <Skeleton className="h-4 w-20 rounded" />
            <Skeleton className="h-4 w-16 rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}
