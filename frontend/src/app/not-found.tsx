import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-16 sm:py-24 text-center">
      <h1 className="text-6xl sm:text-7xl font-bold text-muted-foreground/30 mb-4">404</h1>
      <h2 className="text-xl sm:text-2xl font-semibold mb-2">Página no encontrada</h2>
      <p className="text-muted-foreground mb-8 max-w-sm mx-auto">
        La página que buscas no existe o ha sido movida.
      </p>
      <Link
        href="/"
        className="inline-flex items-center gap-2 rounded-xl bg-accent px-6 py-3 text-sm font-medium text-accent-foreground hover:bg-accent/90 transition-all active:scale-[0.98]"
      >
        Volver al inicio
      </Link>
    </div>
  );
}
