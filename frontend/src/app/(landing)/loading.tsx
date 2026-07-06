import { Skeleton } from "@/components/ui/skeleton";

export default function LandingLoading() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-16 sm:py-24">
      <div className="flex flex-col items-center text-center mb-12 space-y-4">
        <Skeleton className="h-5 w-32 rounded-full" />
        <Skeleton className="h-12 w-96 max-w-full" />
        <Skeleton className="h-6 w-64" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-64 rounded-2xl" />
        ))}
      </div>
    </div>
  );
}
