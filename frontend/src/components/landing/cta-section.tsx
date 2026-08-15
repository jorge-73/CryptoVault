"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useTranslations } from "@/lib/use-translations";

export function CTASection() {
  const t = useTranslations();

  return (
    <section>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-16 sm:py-24">
        <div className="relative rounded-xl border bg-card p-8 sm:p-12 text-center overflow-hidden">
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
            style={{
              backgroundImage: `
                linear-gradient(var(--border) 1px, transparent 1px),
                linear-gradient(90deg, var(--border) 1px, transparent 1px)
              `,
              backgroundSize: "40px 40px",
            }}
          />
          <div className="relative">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold">{t.landing.cta.title}</h2>
            <p className="mt-3 text-muted-foreground max-w-md mx-auto">
              {t.landing.cta.subtitle}
            </p>
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 rounded-lg bg-accent px-6 py-3 mt-6 text-sm font-medium text-accent-foreground hover:bg-accent/90 transition-colors active:scale-[0.98]"
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
