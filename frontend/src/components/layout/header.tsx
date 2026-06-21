"use client";

import Link from "next/link";
import { useTranslations } from "@/lib/use-translations";
import { useAuth } from "@/providers/auth-provider";
import { ThemeToggle } from "./theme-toggle";
import { LogOut, Star, BarChart3, LayoutDashboard, TrendingUp } from "lucide-react";
import { SearchBar } from "@/components/crypto/search-bar";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";

export function Header() {
  const t = useTranslations();
  const { user, logout } = useAuth();
  const pathname = usePathname();

  const navLinks = [
    { href: "/", label: t.nav.dashboard, icon: LayoutDashboard },
    { href: "/market", label: t.nav.market, icon: TrendingUp },
    { href: "/categories", label: t.nav.sectors, icon: BarChart3 },
    { href: "/profile", label: t.nav.watchlist, icon: Star },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-sm" suppressHydrationWarning>
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6" suppressHydrationWarning>
        <Link href="/" className="flex items-center gap-2 font-bold text-xl">
          <span className="text-accent">◆</span>
          <span>{t.nav.brand}</span>
        </Link>

        <nav className="hidden md:flex items-center gap-1" aria-label={t.nav.navAria}>
          {navLinks.map((link) => {
            const Icon = link.icon;
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                  active
                    ? "bg-accent/10 text-accent"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                )}
                aria-current={active ? "page" : undefined}
              >
                <Icon className="h-4 w-4" />
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden md:block" suppressHydrationWarning>
          <SearchBar />
        </div>

        <div className="flex items-center gap-3">
          <ThemeToggle />

          {user ? (
        <div className="flex items-center gap-3" suppressHydrationWarning>
              <span className="hidden sm:block text-sm text-muted-foreground">
                {user.name || user.email}
              </span>
              <button
                onClick={logout}
                className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
                aria-label={t.nav.logoutAria}
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">{t.nav.logout}</span>
              </button>
            </div>
          ) : (
            <Link
              href="/auth/login"
              className="inline-flex items-center justify-center rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white hover:bg-accent/90 transition-colors"
            >
              {t.nav.login}
            </Link>
          )}
        </div>
      </div>

      <nav
        className="md:hidden flex items-center justify-around border-t px-2 py-2"
        aria-label={t.nav.navAriaMobile}
      >
        {navLinks.map((link) => {
          const Icon = link.icon;
          const active = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex flex-col items-center gap-0.5 px-3 py-1 rounded-lg text-xs font-medium transition-colors",
                active
                  ? "text-accent"
                  : "text-muted-foreground hover:text-foreground"
              )}
              aria-current={active ? "page" : undefined}
            >
              <Icon className="h-5 w-5" />
              {link.label}
            </Link>
          );
        })}
      </nav>
    </header>
  );
}
