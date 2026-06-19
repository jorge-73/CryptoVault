import { Skeleton } from "@/components/ui/skeleton";
import { CryptoListSkeleton } from "@/components/crypto/crypto-list-skeleton";

export default function Loading() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8">
      <Skeleton className="h-9 w-48 rounded mb-6" />
      <CryptoListSkeleton count={10} />
    </div>
  );
}
