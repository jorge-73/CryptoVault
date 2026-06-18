import { CryptoListSkeleton } from "@/components/crypto/crypto-list-skeleton";

export default function Loading() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8">
      <div className="h-9 w-48 rounded bg-muted animate-pulse mb-6" />
      <CryptoListSkeleton count={5} />
    </div>
  );
}
