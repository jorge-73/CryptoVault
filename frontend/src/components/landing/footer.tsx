import Link from "next/link";
import { es } from "@/translations/es";

export function Footer() {
  const year = new Date().getFullYear();

  const PRODUCT_LINKS = [
    { href: "/dashboard", label: es.landing.footer.dashboard },
    { href: "/market", label: es.landing.footer.market },
    { href: "/categories", label: es.landing.footer.categories },
  ];

  const RESOURCE_LINKS = [
    { href: "https://www.coingecko.com/", label: es.landing.footer.apiCredit },
  ];

  return (
    <footer className="border-t bg-card/50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-10">
        <div className="grid gap-8 sm:grid-cols-3">
          <div>
            <Link href="/" className="flex items-center gap-2 font-bold text-lg">
              <span className="text-accent">◆</span>
              <span>{es.nav.brand}</span>
            </Link>
            <p className="text-xs text-muted-foreground mt-2 max-w-xs">
              {es.landing.footer.description}
            </p>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">{es.landing.footer.product}</h4>
            <ul className="space-y-2">
              {PRODUCT_LINKS.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">{es.landing.footer.resources}</h4>
            <ul className="space-y-2">
              {RESOURCE_LINKS.map((link) => (
                <li key={link.href}>
                  <a href={link.href} target="_blank" rel="noopener noreferrer" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
            <p className="text-[11px] text-muted-foreground/60 mt-3">
              {es.landing.footer.disclaimer}
            </p>
          </div>
        </div>

        <div className="border-t mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-muted-foreground">
            {es.landing.footer.copyright(year, es.nav.brand)}
          </p>
          <p className="text-[10px] text-muted-foreground/50">
            {es.landing.footer.noAdvice}
          </p>
        </div>
      </div>
    </footer>
  );
}
