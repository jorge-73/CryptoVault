"use client";

import { ErrorState } from "@/components/ui/error-state";

export default function LoginError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="mx-auto max-w-md px-4 py-16 sm:py-24">
      <ErrorState message="Error al cargar la página de inicio de sesión" onRetry={reset} />
    </div>
  );
}
