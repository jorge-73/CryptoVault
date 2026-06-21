import { BarChart3, Layers, Database } from "lucide-react";

const STATS = [
  { value: "+10.500", label: "criptomonedas", icon: <BarChart3 className="h-5 w-5" /> },
  { value: "+500", label: "sectores", icon: <Layers className="h-5 w-5" /> },
  { value: "CoinGecko", label: "datos en tiempo real", icon: <Database className="h-5 w-5" /> },
];

export function SocialProof() {
  return (
    <section className="border-y bg-muted/30">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-10">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider text-center mb-6">
          Datos de mercado actualizados
        </p>
        <div className="flex flex-wrap justify-center gap-8 sm:gap-16">
          {STATS.map((stat) => (
            <div key={stat.label} className="flex items-center gap-3">
              <span className="text-muted-foreground">{stat.icon}</span>
              <div>
                <p className="text-lg sm:text-xl font-bold tabular-nums">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
