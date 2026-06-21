import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function CTASection() {
  return (
    <section>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-16 sm:py-24">
        <div className="relative rounded-2xl border bg-gradient-to-br from-accent/5 via-card to-accent/5 p-8 sm:p-12 text-center overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,var(--accent)/8%,transparent_60%)]" />
          <div className="relative">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold">Empieza a explorar el mercado crypto</h2>
            <p className="mt-3 text-muted-foreground max-w-md mx-auto">
              Analiza activos, descubre tendencias y sigue tus inversiones desde un solo lugar.
            </p>
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 rounded-lg bg-accent px-6 py-3 mt-6 text-sm font-medium text-accent-foreground hover:bg-accent/90 transition-all active:scale-[0.98]"
            >
              Entrar a CryptoVault
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
