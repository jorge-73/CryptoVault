"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useTranslations } from "@/lib/use-translations";

export function CTASection() {
  const t = useTranslations();

  return (
    <section>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-16 sm:py-24">
        <div className="relative rounded-2xl border bg-gradient-to-br from-accent/5 via-card to-accent/5 p-8 sm:p-12 text-center overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,var(--accent)/8%,transparent_60%)] pointer-events-none" />
          <div
            className="absolute inset-0 opacity-[0.03] pointer-events-none"
            style={{
              backgroundImage: `
                linear-gradient(var(--border) 1px, transparent 1px),
                linear-gradient(90deg, var(--border) 1px, transparent 1px)
              `,
              backgroundSize: "40px 40px",
            }}
          />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-accent/5 blur-3xl pointer-events-none" />
          <div className="relative">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold">{t.landing.cta.title}</h2>
            <p className="mt-3 text-muted-foreground max-w-md mx-auto">
              {t.landing.cta.subtitle}
            </p>
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 rounded-lg bg-accent px-6 py-3 mt-6 text-sm font-medium text-accent-foreground hover:bg-accent/90 hover:shadow-[0_0_20px_-4px_var(--accent)] transition-all active:scale-[0.98]"
            >
              {t.landing.cta.button}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
