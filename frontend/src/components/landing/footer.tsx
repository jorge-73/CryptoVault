import Link from "next/link";

const PRODUCT_LINKS = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/market", label: "Mercado" },
  { href: "/categories", label: "Categorías" },
];

const RESOURCE_LINKS = [
  { href: "https://www.coingecko.com/", label: "CoinGecko API" },
];

export function Footer() {
  return (
    <footer className="border-t bg-card/50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-10">
        <div className="grid gap-8 sm:grid-cols-3">
          <div>
            <Link href="/" className="flex items-center gap-2 font-bold text-lg">
              <span className="text-accent">◆</span>
              <span>CryptoVault</span>
            </Link>
            <p className="text-xs text-muted-foreground mt-2 max-w-xs">
              Plataforma de análisis de criptomonedas en tiempo real con datos impulsados por CoinGecko.
            </p>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">Producto</h4>
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
            <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">Recursos</h4>
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
              Los datos de precios y mercado son proporcionados por CoinGecko. Pueden existir retrasos.
            </p>
          </div>
        </div>

        <div className="border-t mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} CryptoVault. Todos los derechos reservados.
          </p>
          <p className="text-[10px] text-muted-foreground/50">
            Este producto no constituye asesoría financiera.
          </p>
        </div>
      </div>
    </footer>
  );
}
