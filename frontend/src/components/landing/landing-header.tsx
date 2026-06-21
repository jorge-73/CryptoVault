"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { useTranslations } from "@/lib/use-translations";

const NAV_LINKS = [
  { href: "/market", key: "market" },
  { href: "/categories", key: "categories" },
  { href: "#features", key: "features" },
] as const;

export function LandingHeader() {
  const [open, setOpen] = useState(false);
  const t = useTranslations();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2 font-bold text-xl">
          <span className="text-accent">◆</span>
          <span>{t.nav.brand}</span>
        </Link>

        <nav className="hidden md:flex items-center gap-1" aria-label={t.landing.header.ariaNav}>
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            >
              {t.landing.header[link.key]}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          <Link
            href="/dashboard"
            className="inline-flex items-center justify-center rounded-lg bg-accent px-4 py-2 text-sm font-medium text-accent-foreground hover:bg-accent/90 transition-all active:scale-[0.98]"
          >
            {t.landing.header.cta}
          </Link>
        </div>

        <button
          onClick={() => setOpen(!open)}
          className="md:hidden flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          aria-label={open ? t.landing.header.ariaMenuClose : t.landing.header.ariaMenuOpen}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t overflow-hidden"
          >
            <nav className="flex flex-col px-4 py-3 gap-1">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="flex items-center px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                >
                  {t.landing.header[link.key]}
                </Link>
              ))}
              <Link
                href="/dashboard"
                onClick={() => setOpen(false)}
                className="flex items-center justify-center rounded-lg bg-accent px-4 py-2.5 mt-2 text-sm font-medium text-accent-foreground hover:bg-accent/90 transition-colors"
              >
                {t.landing.header.cta}
              </Link>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
