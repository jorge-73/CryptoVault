# CryptoVault

Plataforma de análisis de criptomonedas en tiempo real. Dashboard, market tracker, watchlist y portfolio personal con datos impulsados por CoinGecko.

## Stack

- **Framework**: Next.js 16 (App Router, Turbopack)
- **UI**: Tailwind CSS v4, Framer Motion, lucide-react, Recharts
- **Auth**: InsForge Auth
- **API**: CoinGecko (server-side caching)
- **Traducciones**: español (es)

## Scripts

```bash
npm run dev      # Desarrollo
npm run build    # Producción
npm run lint     # ESLint
npm run test:e2e # Playwright E2E
```

## Estructura

```
src/
  app/           # App Router (layout, pages, error/loading boundaries)
  components/    # UI, landing, crypto, portfolio, auth, layout
  lib/           # API client, utils, formatters, motion constants
  translations/  # es.ts (español)
  types/         # TypeScript types
  providers/     # Theme, Auth providers
```

## Páginas

- `/` — Landing page
- `/dashboard` — Market dashboard en tiempo real
- `/market` — Tabla de criptomonedas con búsqueda y filtros
- `/categories` — Sectores del mercado crypto
- `/coin/[id]` — Detalle de criptomoneda (gráfico, stats, about)
- `/portfolio` — Portfolio personal (holdings, P&L, ROI)
- `/watchlist` — Favoritos
- `/profile` — Perfil de usuario
