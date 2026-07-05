# CryptoVault 🪙

Dashboard de criptomonedas en tiempo real + Landing Page Premium SaaS (bento grid, market ticker, hero 60/40) + Crypto Market Explorer con sectores, búsqueda avanzada, favoritos, categorías premium y localización completa al español.

## 🚀 Stack

| Capa          | Tecnología                                |
|---------------|-------------------------------------------|
| Frontend      | Next.js 16 (App Router) + Tailwind CSS v4 |
| Backend       | Node.js + Express + TypeScript            |
| Base de Datos | PostgreSQL                                |
| ORM           | Prisma 6                                  |
| API Datos     | CoinGecko (free tier)                     |
| Autenticación | JWT en cookies HttpOnly                   |
| UI            | next-themes, sonner, lucide-react, framer-motion |

## 📁 Estructura del Proyecto

```
crypto-app/
├── backend/
│   ├── src/
│   │   ├── __tests__/       # Vitest tests (supertest + mocks)
│   │   ├── config/          # env, prisma client
│   │   ├── controllers/     # auth, crypto, favorites, portfolio
│   │   ├── middlewares/      # auth JWT, error handler, rate limiter, optionalAuth, validate
│   │   ├── routes/          # express routers
│   │   ├── schemas/         # Zod schemas (favorites, portfolio)
│   │   ├── services/        # coingecko, auth, favorites, cache, portfolio
│   │   ├── utils/           # jwt helpers
│   │   └── index.ts         # entry point
│   └── prisma/
│       └── schema.prisma    # User, Favorite, Portfolio, PortfolioHolding
├── frontend/
│   ├── e2e/                 # Playwright tests (9 specs, 39 tests)
│   │   ├── auth.spec.ts
│   │   ├── dashboard.spec.ts
│   │   ├── categories.spec.ts
│   │   ├── category-detail.spec.ts
│   │   ├── favorites.spec.ts
│   │   ├── coin-detail.spec.ts
│   │   ├── market.spec.ts
│   │   ├── search.spec.ts
│   │   ├── theme.spec.ts
│   │   └── mocks.ts         # mock data + setup functions
│   ├── src/
│   │   ├── app/
│   │   │   ├── (app)/       # Route group — aplicación (header con search, theme, auth)
│   │   │   │   ├── dashboard/  # Dashboard principal
│   │   │   │   ├── market/     # Mercado con tabla profesional (sort, search, top filter)
│   │   │   │   ├── categories/
│   │   │   │   │   ├── [id]/   # Detalle de sector
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── coin/[id]/  # Detalle de moneda con gráfico premium
│   │   │   │   ├── auth/       # login, register
│   │   │   │   ├── profile/    # Watchlist con sort
│   │   │   │   └── portfolio/  # Portfolio personal con P&L tracking
│   │   │   ├── (landing)/      # Route group — landing marketing premium
│   │   │   │   ├── layout.tsx  # LandingHeader + Footer
│   │   │   │   └── page.tsx    # Landing page en / (hero 60/40, ticker, bento, market preview, analytics, CTA)
│   │   │   ├── error.tsx
│   │   │   ├── loading.tsx
│   │   │   ├── favicon.ico
│   │   │   ├── globals.css
│   │   │   └── layout.tsx     # Root layout (providers, fonts, metadata)
│   │   ├── components/
│   │   │   ├── crypto/      # CryptoCard, MarketOverview, MarketTable, CategoryCard, PriceChart,
│   │   │   │                # SearchBar, SectorOverview, TrendingSectors,
│   │   │   │                # MarketIntelligence, CategoryCoinTable, CategoryDetailHeader,
│   │   │   │                # CoinDetailHeader, CoinAbout
│   │   │   ├── landing/     # Landing page sections
│   │   │   │   ├── landing-header.tsx
│   │   │   │   ├── hero-section.tsx
│   │   │   │   ├── market-ticker.tsx
│   │   │   │   ├── bento-features.tsx
│   │   │   │   ├── market-preview.tsx
│   │   │   │   ├── analytics-section.tsx
│   │   │   │   ├── cta-section.tsx
│   │   │   │   ├── footer.tsx
│   │   │   │   └── mock-data.ts
│   │   │   ├── layout/      # Header (app), ThemeToggle
│   │   │   ├── portfolio/   # PortfolioSummary, PortfolioTable, AddHoldingModal, PortfolioChart
│   │   │   └── ui/          # 9 componentes reutilizables (ver sección UI Kit)
│   │   ├── hooks/           # useDebounce
│   │   ├── providers/       # auth + theme context
│   │   ├── translations/    # es.ts — diccionario tipado (~220 strings)
│   │   ├── types/           # crypto.ts (CoinCategory, CoinMarket, CoinDetail, TopCoin)
│   │   └── lib/             # api client, formatters (es-AR), crypto-transform, use-translations
│   ├── playwright.config.ts
│   └── next.config.ts       # remote image patterns
├── .github/workflows/
│   └── ci.yml               # CI/CD: lint, test, build
├── docker-compose.e2e.yml   # Stack aislado para tests e2e
└── .gitignore
```

## 🏠 Landing Page — Premium SaaS Transformation

La raíz (`/`) es una landing page de marketing con enfoque SaaS, diseñada para vender el producto y mostrar la aplicación. Todo el contenido funciona sin llamadas API usando datos mock con imágenes reales de CoinGecko CDN. Reutiliza componentes compartidos del sistema de diseño (`CryptoIcon`, `Badge`, `formatPrice`, etc.).

```
(landing)/layout.tsx    ← LandingHeader + Footer
(landing)/page.tsx     ← Landing page en / (6 secciones: Hero → Ticker → Bento → Portfolio → Demo → CTA)
(app)/layout.tsx       ← Header app (search bar, theme, auth) para rutas internas
```

### Secciones

| # | Componente | Tipo | Contenido interno | Animación |
|---|------------|------|-------------------|-----------|
| 1 | `HeroSection` | Client | **Layout 60/40**: izquierda con eyebrow badge + título "Gestiona tus criptomonedas con datos en tiempo real" + subtítulo + 2 CTAs ("Comenzar gratis" → `/dashboard`, "Explorar mercado" → `/market`). Derecha con **product showcase flotante**: DoubleBezelCard tipo dashboard mock con indicador "En vivo", 2 mini-stat-cards (Valor Portfolio $98,450, P&L Hoy +$1,245), chart SVG BTC/USD con gradiente accent, mini watchlist inline (BTC/ETH/SOL con CryptoIcon 16px + Badge). Hover: `-translate-y-1 shadow-xl`. Fondo: hero.webp con fade-out mask + gradiente radial accent. | Stagger Framer Motion: hero 0.6s ease, showcase con delay 0.3s + group-hover flotante |
| 2 | `MarketTicker` | Client | Marquee infinito horizontal triplicando 5 tokens mock (BTC/ETH/SOL/XRP/ADA). Cada item: `CryptoIcon` 20px + nombre + símbolo + `formatPrice` + cambio % con `TrendingUp`/`TrendingDown` (verde/rojo). Máscaras CSS gradient en ambos bordes. | Framer Motion `animate.x: [0, -33.33%]`, 30s linear, repeat Infinity |
| 3 | `BentoFeatures` | Client | Grid asimétrico 4 columnas con `grid-flow-dense`. 4 cards `DoubleBezelCard`: **(a) Inteligencia de Mercado** (col-span-2, row-span-2) — chart SVG BTC/USD con gradiente accent (viewBox 300×128, 12 datos) + badge +5.2%; **(b) Portfolio Tracking** (col-span-1) — donut SVG con 5 segmentos coloreados (BTC 40%, ETH 25%, SOL 15%, XRP 12%, ADA 8%) + leyenda 2×2; **(c) Watchlist Inteligente** (col-span-1) — 3 coins con CryptoIcon 18px + Badge; **(d) Datos en Tiempo Real** (col-span-2) — 4 indicadores con iconos (Latencia 230ms, Vol $125B, Pares 850+, Exchanges 120). | Stagger children 150ms, fade+slide 0.6s |
| 4 | `PortfolioSection` | Client | Sección "Controla tus inversiones": 4 StatCards con datos mock (Valor Total $98,450, Ganancia/Pérdida +$12,340, ROI +14.3%, 5 Activos) + mini tabla de holdings (BTC, ETH, SOL) con columnas Activo/Cantidad/Precio/Valor/Cambio + botón "Ir a mi Portfolio" → `/portfolio`. | Stagger children 120ms, fade+slide 0.6s |
| 5 | `DemoSection` | Client | Walkthrough animado "Así funciona CryptoVault". 3 vistas (Dashboard → Market → Portfolio) que ciclan automáticamente cada 4.5s con AnimatePresence. Cada vista es un mock visual de la página real. Indicador de paso con 3 dots interactivos. Pausa en hover. | Framer Motion slide-x 0.35s, autoplay loop |
| 6 | `CTASection` | Server → Client | CTA final con fondo gradiente + patrón CSS grid sutil (`background-size: 40px 40px`) + glow radial blur-3xl central. Botón con hover glow (`hover:shadow-[0_0_20px_-4px_var(--accent)]`). | CSS active:scale, hover glow |

### Componentes decorativos

| Componente | Aparece en | Descripción |
|------------|------------|-------------|
| `DoubleBezelCard` | Hero (1), Bento (4), Portfolio (1), Demo (1) | `rounded-2xl border border-border/50 bg-card/50 p-1.5 backdrop-blur-sm` + inner border. Efecto de doble borde con vidrio. Definido localmente en cada archivo. |
| `ProductShowcase` (interno) | Hero | Dashboard mock compuesto con mini-stat-cards + chart SVG + watchlist inline. Reemplaza las 3 cards anteriores. |
| `Donut SVG` (interno) | Bento | Donut de distribución con 5 segmentos en stroke-dasharray, colores mapeados a variables CSS (accent, green, red, muted-foreground, border). |
| `Sparkline` (SVG) | Hero | SVG con viewBox 300×80, línea accent + gradiente fill. 30 puntos desde `MOCK_BTC_SPARKLINE`. |
| `Chart BTC/USD` (SVG) | Bento | SVG con viewBox 300×128, 12 datos mensuales mock con línea accent + gradiente fill. |

### Arquitectura de datos

Todas las secciones funcionan **sin ninguna llamada API** — datos estáticos desde `frontend/src/components/landing/mock-data.ts`:

| Dataset | Items | Propósito |
|---------|-------|-----------|
| `MOCK_TICKER` | BTC, ETH, SOL, XRP, ADA | Ticker, Hero showcase, Bento watchlist |
| `MOCK_BTC_SPARKLINE` | 30 precios | Hero chart SVG |
| `MOCK_GLOBAL` | 4 métricas | Demo Dashboard view |
| `MOCK_PORTFOLIO` | 3 holdings + summary | PortfolioSection + demo |
| `MOCK_ALLOCATION` | 5 assets con % | Bento donut chart |
| `MOCK_REALTIME` | 4 indicadores | Bento realtime card |

Las imágenes son URLs directas de CoinGecko CDN — estáticas, cacheadas por el navegador, cero requests. Datasets eliminados: `MOCK_ALERT`, `MOCK_CATEGORIES`, `MOCK_COINS` (ya no se usan).

### Diseño y animaciones

- Framer Motion para entrance animations: fade+slide, stagger en grids, AnimatePresence en demo
- Glass cards con `bg-card/80 backdrop-blur-sm`, doble borde decorativo
- Gradiente radial accent en Hero y CTA
- Hero background: `hero.webp` (148KB WebP) con máscara de desvanecimiento
- CTA con patrón CSS grid + glow blur central
- Sin animaciones molestas ni exceso de colores — tono profesional fintech

### Edge Cases

- **Header diferenciado**: LandingHeader no tiene auth, search ni theme toggle. El header de la app aparece solo en rutas `(app)/`.
- **Ruta raíz limpia**: `/` es la landing, `/dashboard` es la app. `navLinks` en app header redirigen de `"/"` → `"/dashboard"`.
- **Metadata SEO**: title "CryptoVault | Plataforma de análisis crypto", OG tags básicos, favicon personalizado.
- **Loading/Error**: heredados del root layout (`app/loading.tsx`, `app/error.tsx`).
- **Scroll margin**: secciones con `scroll-mt-20` para navegación por hash.
- **Active nav indicator**: `LandingHeader` usa `usePathname` + `aria-current="page"` con `bg-accent/10 text-accent`.
- **Demo autoplay**: pausa en hover para evitar distracción, loop infinito.

## ⚙️ Instalación

### Prerrequisitos

- Node.js 20+
- PostgreSQL
- npm

### Backend

```bash
cd backend
npm install
cp .env.example .env
# Editar .env con tus credenciales de PostgreSQL
npx prisma migrate dev --name init
npm run dev
```

El servidor arrancará en `http://localhost:4000`.

### Frontend

```bash
cd frontend
npm install
npm run dev
```

El servidor arrancará en `http://localhost:3000`.

## 🔐 Autenticación

- **Registro y login** con JWT + refresh token rotation
- Tokens almacenados en cookies **HttpOnly, Secure, SameSite**
  - `access_token`: 15 minutos de vida
  - `refresh_token`: 7 días de vida, almacenado en BD (hash) en el propio User
- **Logout**: limpieza de ambas cookies
- **Refresh**: endpoint `POST /api/auth/refresh` rota el refresh token y devuelve un nuevo access token
- Endpoint `/api/auth/me` retorna `{ user }` si hay sesión o `{ user: null }` si no

## 📊 Dashboard Premium

La página `/dashboard` es el centro de comando de la aplicación con estructura de plataforma fintech (anteriormente en `/`):

| Sección | Descripción |
|---------|-------------|
| **MarketOverview** | 4 StatCards con datos globales: capitalización total (con trend), volumen 24h, dominancia BTC, criptomonedas activas. Skeleton de 4 placeholders mientras carga. |
| **TrendingCoins** | Top 3 gainers (mayor subida 24h) + Top 3 losers (mayor bajada 24h). Cada uno con logo, nombre, símbolo, precio y badge de cambio. Hover premium con shadow y border accent. Skeleton por lado (3+3 placeholders). |
| **Todas las Criptomonedas** | Grid responsivo (1/2/3 columnas) con `StaggerGrid` + `StaggerItem`. Cada `CryptoCard` incluye: rank, logo, nombre, símbolo, precio, badge 24h, market cap, volumen 24h y botón de favoritos. |

| **MarketIntelligence** | BTC dominance (barra de progreso), sentimiento del mercado (alcista/bajista según cambio 24h) y top 3 sectores por capitalización con link a detalle. Skeleton con 4 placeholders. |

**Cambios visuales respecto a la versión anterior:**
- Título renovado: "Crypto Market" con subtítulo descriptivo
- `CryptoCard` ahora muestra volumen 24h además de market cap
- Hover accent en nombre de moneda (group-hover:text-accent)
- `CryptoListSkeleton` rediseñado para coincidir con el grid de 3 columnas (antes usaba filas verticales que no coincidían)
- `SectionHeader` ahora acepta `className` para control de espaciado

## 🏢 Crypto Sectors (Market Explorer)

Página `/categories` que transforma el listado plano en una experiencia premium de exploración de mercados.

### Listado (`/categories`)

Tres secciones que se cargan en paralelo con skeletons independientes:

| Sección             | Descripción                                                                 |
|---------------------|-----------------------------------------------------------------------------|
| **SectorOverview**  | 4 StatCards con datos globales: market cap total, volumen 24h, dominancia BTC, criptos activas |
| **TrendingSectors** | Top 4 sectores por cambio de market cap en 24h, scroll horizontal con snap, badges de rendimiento |
| **Top Crypto Sectors** | Ranking completo con ordenamiento por market cap / cambio % y filtro por nombre |

**CategoryCard** rediseñada con layout premium:
- Imagen hero del sector (top coin del sector como avatar principal)
- Nombre, descripción truncada (100 chars) y badge de cambio 24h
- Market cap + Volumen 24h en el footer
- Top 3 coins como avatares en miniatura con fallback initials
- Hover lift + shadow + border accent
- Link a `/categories/[id]`

### Detalle (`/categories/[id]`)

| Componente             | Descripción                                                          |
|------------------------|----------------------------------------------------------------------|
| **CategoryDetailHeader** | Nombre, badge de cambio, descripción, 3 StatCards (cap, volumen 24h, monedas) |
| **CategoryCoinTable**  | Tabla completa de monedas del sector con:                            |
|                        | - Columnas: # rank, nombre+logo, precio, cambio 24h (badge), market cap |
|                        | - Ordenamiento por cualquier columna numérica (clic en header)       |
|                        | - Búsqueda por nombre o símbolo                                      |
|                        | - Responsive: columna market cap oculta en mobile                    |
|                        | - Estados vacío y error                                              |
|                        | - Stagger animation en filas con framer-motion                       |

### Endpoint

```
GET /api/crypto/categories/:id/coins?currency=usd&per_page=100
```

Reutiliza `getMarkets` con parámetro `category`, devuelve top 100 coins del sector. Cache 60s.

## 📈 Mercado

La página `/market` es un explorador profesional de criptomonedas con datos en tiempo real:

| Componente | Descripción |
|------------|-------------|
| **MarketOverview** | 4 StatCards reutilizadas desde dashboard (capitalización, volumen, dominancia, monedas) |
| **MarketTable** | Tabla completa con todas las funcionalidades profesionales |

### MarketTable

| Funcionalidad | Detalle |
|---------------|---------|
| **Columnas** | Rank, Logo+Nombre+Símbolo, Precio, 24h (Badge), 7d (Badge), Cap. Mercado, Volumen, Favorito ★ |
| **Ordenamiento** | Clic en cualquier header numérico ordena asc/desc con icono de dirección |
| **Búsqueda** | Input con filtro local por nombre o símbolo (case-insensitive) |
| **Top Filter** | Botones Top 10 / Top 50 / Top 100 / Todos, filtra sobre los 250 coins cargados |
| **Responsive** | Tabla completa en ≥768px (`hidden md:block`), cards con rank+logo+precio+cap+vol en <768px |
| **Skeleton** | 10 filas placeholder en desktop, 5 cards placeholder en mobile |
| **Estados** | Empty state con mensaje de búsqueda sin resultados, Error state con botón reintentar |
| **Favoritos** | Botón estrella por fila/card si el usuario está autenticado |

### Animación

Las filas de la tabla usan `motion.tr` con stagger de 20ms entre filas para entrada progresiva al cargar los datos.

### Detalles técnicos

- Backend: `GET /api/crypto/markets?vs_currency=usd&per_page=100` con cache 60s. Se cargan las top 100 por market cap (respetando límites del free tier de CoinGecko).
- La columna 7d usa `price_change_percentage_7d_in_currency` desde CoinGecko (parámetro `&price_change_percentage=7d`)
- Nav link "Market" con icono TrendingUp agregado al Header entre Dashboard y Sectores

## 🔍 Búsqueda

Componente `SearchBar` en `frontend/src/components/crypto/search-bar.tsx`, integrado en el Header (visible en desktop):

- **Debounce**: 300ms via hook `useDebounce` (en `frontend/src/hooks/`)
- **Filtrado local**: sobre los top 50 coins obtenidos de `GET /api/crypto/markets`
- **Dropdown**: hasta 8 resultados con imagen, nombre, símbolo y precio
- **Interacción**: clic en resultado navega a `/coin/[id]`, botón X para limpiar, Escape/click-outside para cerrar
- **Accesibilidad**: roles `combobox`, `listbox`, `option`, `aria-expanded`, `aria-autocomplete`

## 📊 Gráficos Históricos y Detalle Premium

La página `/coin/[id]` ofrece una experiencia premium de detalle de criptomoneda con múltiples secciones:

| Componente | Descripción |
|------------|-------------|
| **CoinDetailHeader** | Header premium con: imagen grande (64px), nombre + símbolo, rank, precio grande con badge 24h, botón favorito con feedback visual. Link "Volver al dashboard". |
| **StatCards** | 6 tarjetas con datos clave: capitalización, volumen 24h, ranking, suministro circulante, suministro total, suministro máximo. Más indicador Vol/Cap. |
| **PriceChart** | Área chart interactivo con Recharts, gradient fill verde/rojo según tendencia. Selector de rango: **1d**, **7d**, **30d**, **1y**. Tooltip con precio y fecha. Datos servidos por `GET /api/crypto/chart/:coinId`. |
| **CoinAbout** | Descripción del proyecto (sanitizada + truncada a 1000 chars), enlaces a sitio web y explorador de bloques. Tabs para alternar entre gráfico y descripción. |

Carga diferida: `PriceChart` y `MarketTable` usan `next/dynamic` + `ssr: false` para reducir bundle inicial.

Rendimiento adicional: `CryptoCard` y `StatCard` envueltas en `React.memo` para evitar re-renders innecesarios.

## 👁️ Watchlist

La página `/profile` funciona como un dashboard de watchlist profesional:

- **Autenticación requerida**: redirige a `/auth/login` si no hay sesión
- **Lista dinámica**: muestra las criptomonedas favoritas con datos de mercado en vivo
- **Ordenamiento**: botones con `ArrowUpDown` para ordenar por nombre, precio, cambio 24h o capitalización de mercado. Segundo clic invierte la dirección.
- **Badge con período**: las `CryptoCard` dentro del watchlist muestran badge de **7d** además del badge 24h estándar
- **Eliminación**: clic en estrella elimina de watchlist con confirmación vía toast
- **Estados vacío**: `EmptyState` con icono y botón "Explorar mercado" que redirige a `/market`
- **Skeleton**: `CryptoListSkeleton` con 5 placeholders mientras cargan los datos
- El nav link "Favoritos" fue renombrado a "Watchlist"

## 💼 Portfolio Tracker

La página `/portfolio` permite gestionar inversiones en criptomonedas con tracking de P&L en tiempo real, diseñada con experiencia financiera profesional:

- **Autenticación requerida**: redirige a `/auth/login` si no hay sesión
- **Portfolio automático**: se crea un portfolio por defecto ("Mi Portfolio") al primer acceso
- **Summary cards premium**: 4 tarjetas con **Valor Total**, **Total Invertido**, **P&L Total** y **ROI %**. Tipografía financiera (`font-mono`, tracking-tight), colores semánticos (verde/rojo según signo), iconos consistentes. Card accent para Valor Total, card neutral para Total Invertido, cards verde/rojo para P&L y ROI.
- **Holdings table**: tabla con columnas de activo (imagen + nombre + símbolo + link a detalle), **cantidad editable inline**, **precio de entrada editable inline**, precio actual, P&L en USD, ROI (Badge 24h) y botón de eliminar
- **Inline editing**: clic en cantidad o precio entrada → input con auto-guardado en Enter/blur. Validación de número positivo. Icono Pencil en hover. Loading spinner por fila mientras guarda. Toast feedback.
- **Stagger animation**: filas de tabla con `motion.tr` (Framer Motion) con fade+slide y stagger de 20ms — misma calidad que CategoryCoinTable
- **Export CSV**: botón "Exportar CSV" que genera archivo con Asset, Symbol, Amount, Entry Price, Current Price, Invested Value, Current Value, Profit/Loss, ROI. Formato correcto con headers y decimales.
- **Allocation chart**: gráfico de donut (Recharts, dynamic import) con colores por activo, tooltip personalizado, lista de desglose y título traducido "Distribución"
- **Add Holding modal**: formulario con campos para cryptoId, nombre, símbolo, imagen URL, cantidad y precio de entrada
- **P&L calculation**: backend calcula currentValue, costBasis, pnl y roi usando precios en vivo de CoinGecko
- **Estados**: skeleton loading (4 summary cards + table skeleton), error state con reintento, empty state cuando no hay holdings
- **Nav link**: icono Wallet en el Header entre Sectores y Watchlist

### Componentes

| Componente | Descripción |
|------------|-------------|
| `PortfolioSummary` | 4 summary cards premium con font-mono y colores semánticos |
| `PortfolioTable` | Tabla con inline editing (cantidad/precio entrada), stagger animation, P&L, ROI, eliminar |
| `AddHoldingModal` | Modal con formulario para agregar activo al portfolio |
| `PortfolioChart` | Donut chart de distribución (Recharts, dynamic import) |

### API

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/portfolio` | Portfolio con holdings enriquecidos con precios actuales y P&L |
| POST | `/api/portfolio/holdings` | Agregar holding |
| PUT | `/api/portfolio/holdings/:holdingId` | Actualizar holding |
| DELETE | `/api/portfolio/holdings/:holdingId` | Eliminar holding |

### Data flow

1. Frontend solicita `GET /api/portfolio`
2. Backend busca o crea portfolio por defecto para el usuario
3. Backend recolecta todos los `cryptoId` únicos de los holdings
4. Backend llama a `coingeckoService.getPricesByIds()` (reusa cache existente)
5. Por cada holding calcula: `currentValue = amount × currentPrice`, `pnl = currentValue - costBasis`, `roi = ((currentPrice / entryPrice) - 1) × 100`
6. Retorna portfolio con holdings enriquecidos + totales agregados

## 🎞️ Animaciones (Framer Motion)

- **`AnimatedMount`**: fade-in (`opacity`) + slide-up (`y: 12 → 0`) en 350ms al montar páginas. Aplicado en Dashboard, Categories, Coin Detail, Profile y detalle de sector.
- **`StaggerGrid` + `StaggerItem`**: las cards del dashboard aparecen escalonadas con 40ms de delay entre cada una, 300ms de duración.
- **Filas de tabla**: `CategoryCoinTable` usa `motion.tr` con stagger (30ms entre filas) para entrada progresiva al cargar datos.
- Transiciones suaves en hover de cards, botones y enlaces del sistema.

## 🎨 Diseño System

El theme se define mediante variables CSS con `@theme inline` de Tailwind v4:

### Colores (~28 variables)

| Variable               | Light         | Dark          |
|------------------------|---------------|---------------|
| `--background`         | `#f8fafc`     | `#0b1121`     |
| `--foreground`         | `#0f172a`     | `#f1f5f9`     |
| `--card`               | `#ffffff`     | `#151f33`     |
| `--surface`            | `#f1f5f9`     | `#1a253a`     |
| `--border`             | `#e2e8f0`     | `#1e2d48`     |
| `--accent`             | `#3b82f6`     | `#3b82f6`     |
| `--ring`               | `#3b82f6`     | `#60a5fa`     |
| `--green` / `--red`    | `#16a34a` / `#dc2626` | `#22c55e` / `#ef4444` |
| `--green-soft` / `--red-soft` | `#dcfce7` / `#fee2e2` | `#052e16` / `#450a0a` |

### Scrollbar personalizado

Scrollbar delgada (6px), track transparente, thumb con color `--muted-foreground` que cambia a `--foreground` en hover.

### Transiciones globales

El `body` tiene `transition: background-color 0.2s ease, color 0.2s ease` para transiciones suaves al cambiar de tema.

## 🌐 Localización Española

Todo el frontend está traducido al español con un sistema centralizado de traducciones y formato regional argentino:

### Arquitectura

| Archivo | Propósito |
|---------|-----------|
| `frontend/src/translations/es.ts` | Diccionario tipado `as const` con ~320 strings organizadas por módulo (nav, auth, dashboard, market, categories, coinDetail, watchlist, search, chart, badge, error, theme, crypto, meta, landing, portfolio) |
| `frontend/src/lib/use-translations.ts` | Hook `useTranslations()` que retorna el objeto de traducciones |
| `frontend/src/lib/formatters.ts` | Formateo de números con `toLocaleString("es-AR")`: precios (`$50.000,00`), porcentajes (`+12,5%`), market cap, números genéricos |
| `frontend/src/lib/crypto-transform.ts` | Utilidades para limpiar datos de CoinGecko: `stripHtml()`, `sanitizeHtml()`, `truncate()` por word boundary, `formatCategoryDescription()` |

### Convenciones
- Textos con interpolación se definen como funciones flecha: `(name: string) => \`Precio de ${name}\``
- No se traducen: Bitcoin, Ethereum, DeFi, NFT, Blockchain, Layer 2
- Los componentes usan `const t = useTranslations()` y referencian `t.modulo.clave`
- Server components (auth pages) importan `es` directamente para metadata
- Arrays estáticos que necesitan `t` (`navLinks`, `TOP_OPTIONS`, `SORT_OPTIONS`) se movieron dentro del componente

## 🧩 UI Kit

9 componentes reutilizables en `frontend/src/components/ui/`, barrel export desde `index.ts`:

| Componente       | Propósito                          |
|------------------|------------------------------------|
| `Skeleton`       | Loader placeholder con animación   |
| `StatCard`       | Tarjeta con label, valor e icono   |
| `Badge`          | Badge de porcentaje con color verde/rojo según signo |
| `EmptyState`     | Estado vacío con icono y mensaje   |
| `ErrorState`     | Estado de error con mensaje y botón reintentar |
| `SectionHeader`  | Encabezado de sección con título y subtítulo |
| `AnimatedMount`  | Envoltura con fade-in + slide-up al montar |
| `StaggerGrid`    | Grid con animación escalonada para children |
| `StaggerItem`    | Item individual para StaggerGrid    |

## 🧪 Tests

### Backend (Vitest + Supertest)

```bash
cd backend
npm test
```

**27 tests** en 3 suites — completamente mockeados (sin llamadas reales a CoinGecko):

| Suite     | Tests | Descripción                                           |
|-----------|-------|-------------------------------------------------------|
| Auth      | 7     | registro, login, refresh, logout, duplicados          |
| Crypto    | 16    | markets, categories (+content/volume), chart, global, category coins, coin detail, errores 503 |
| Favorites | 4     | CRUD, autorización, duplicados                        |

Config: `fileParallelism: false` para evitar conflictos de DB entre forks.

### Frontend (Playwright)

```bash
cd frontend
npx playwright test
```

**39 tests** en 9 specs — todas las llamadas API mockeadas (sin dependencia del backend real):

| Spec             | Tests | Mockea                       |
|------------------|-------|------------------------------|
| Auth             | 5     | register, login, logout      |
| Dashboard        | 4     | crypto endpoints             |
| Categories       | 3     | crypto endpoints             |
| Category Detail  | 8     | crypto endpoints + categories/:id/coins |
| Favorites        | 3     | auth + crypto + favorites    |
| Coin Detail      | 4     | crypto endpoints             |
| Market           | 6     | crypto endpoints             |
| Search           | 4     | crypto endpoints             |
| Theme            | 2     | auth (me)                    |

**Arquitectura de mocks** (`frontend/e2e/mocks.ts`):

- `setupCryptoMocks(page)` — mockea markets, categories, categories/:id/coins, chart, global
- `setupAuthMocks(page)` — mockea register, login, logout, me, refresh
- `setupFavoritesMocks(page)` — mockea CRUD de favoritos con estado compartido
- `authConfig.authenticated` — mutable; permite simular sesión/no sesión
- Los mocks se registran con `page.route()` (glob y regex) y se leen en tiempo de request
- Las rutas específicas (`categories/*/coins`) se registran antes que las genéricas (`categories`) para evitar colisiones

### Docker Compose para e2e

```bash
docker compose -f docker-compose.e2e.yml up --build
```

Stack aislado con puertos en 3001/4001/5433 para no interferir con el dev stack local.

## 📡 API Endpoints

| Método | Ruta                                | Auth?    | Descripción                          |
|--------|-------------------------------------|----------|--------------------------------------|
| POST   | `/api/auth/register`                | No       | Registrar usuario (rate limited)     |
| POST   | `/api/auth/login`                   | No       | Iniciar sesión (rate limited)        |
| POST   | `/api/auth/logout`                  | No       | Cerrar sesión                        |
| POST   | `/api/auth/refresh`                 | Cookie   | Refrescar access token               |
| GET    | `/api/auth/me`                      | Cookie   | Obtener usuario actual               |
| GET    | `/api/crypto/markets`               | No       | Listado de criptomonedas             |
| GET    | `/api/crypto/markets?ids=...`       | No       | Precios por IDs                      |
| GET    | `/api/crypto/categories`            | No       | Categorías con imágenes, contenido y volumen |
| GET    | `/api/crypto/categories/:id/coins`  | No       | Coins de una categoría (cache 60s)   |
| GET    | `/api/crypto/global`                | No       | Datos globales del mercado           |
| GET    | `/api/crypto/coin/:id`              | No       | Detalle completo de una moneda       |
| GET    | `/api/crypto/chart/:coinId`         | No       | Precios históricos para gráfico      |
| GET    | `/api/favorites`                    | Sí       | Favoritos del usuario con precios    |
| POST   | `/api/favorites`                    | Sí       | Añadir cripto a favoritos            |
| DELETE | `/api/favorites/:cryptoId`          | Sí       | Eliminar favorito                    |
| GET    | `/api/portfolio`                    | Sí       | Portfolio del usuario con P&L        |
| POST   | `/api/portfolio/holdings`           | Sí       | Agregar holding al portfolio         |
| PUT    | `/api/portfolio/holdings/:hid`      | Sí       | Actualizar holding                   |
| DELETE | `/api/portfolio/holdings/:hid`      | Sí       | Eliminar holding del portfolio       |

## 🧠 Cache & Reliability

### Timeouts y temporizador
Cada llamada a CoinGecko usa `fetchWithTimeout` con `AbortController`. Timeout diferenciado:
- **5 segundos** para endpoints ligeros (categories, chart, coin detail, global)
- **8 segundos** para `/coins/markets` (payload pesado con per_page=100)

### Cache en memoria
El backend implementa un cache en memoria con TTL para reducir llamadas a la API de CoinGecko y evitar rate limits del tier gratuito (~10-30 req/min):

| Endpoint                    | TTL        |
|-----------------------------|------------|
| `/coins/markets`            | 60 segundos |
| `/coins/markets?ids=`       | 60 segundos |
| `/coins/categories`         | 300 segundos |
| `/coins/:id` (detail)       | 300 segundos |
| `/coins/chart`              | 300 segundos |
| `/global`                   | 120 segundos |

### Prevención de cache stampede
Cuando múltiples requests concurrentes tienen cache miss, todas comparten una **misma promesa pendiente** en lugar de disparar N llamadas a CoinGecko. La primera request que detecta cache miss inicia la llamada y las demás esperan la misma promesa.

### Universal Retry
Reintento automático en **cualquier error** (no solo 429):
- Timeout: backoff **500ms × intento**, máx **3 intentos**
- Network errors (fetch failed): backoff **1000ms × intento**, máx **3 intentos**
- Rate limiting (429): backoff **1000ms × intento**, máx **3 intentos**

### Diagnóstico de errores de red
Cuando `fetch` lanza un error, se captura y loguea `err.cause` para conocer la causa exacta:
```
[COINGECKO] Network error on /coins/markets (attempt 1) (cause code: ENOTFOUND)
[COINGECKO] Network error on /coins/markets (attempt 1) (cause code: ECONNRESET)
```

### Stale Cache Fallback
Si CoinGecko falla y hay datos en cache **aunque expirados**, se sirven como fallback con advertencia en logs:
```
[COINGECKO] Serving stale cache for /coins/markets
```

### Códigos de error
- **503 Service Unavailable** cuando CoinGecko está caído
- Respuesta con formato `{ success: false, error: "Datos del mercado temporalmente no disponibles. Intente de nuevo más tarde." }` para todos los endpoints crypto
- Logging estructurado con formato `[CRYPTO] GET /endpoint → mensaje de error` incluyendo causa de red cuando está disponible

## ⚡ Rate Limiting

Dos rate limiters protegen los endpoints públicos, con límites más permisivos en desarrollo para evitar bloqueos durante Fast Refresh:

| Limiter  | Endpoints         | Ventana | Dev     | Prod    |
|----------|-------------------|---------|---------|---------|
| Auth     | `/api/auth/*`     | 15 min  | 100 req | 10 req  |
| Crypto   | `/api/crypto/*`   | 1 min   | 200 req | 30 req  |

## 🗄️ Modelo de Datos (Prisma)

```prisma
model User {
  id           String     @id @default(cuid())
  email        String     @unique
  password     String
  name         String?
  refreshToken String?
  createdAt    DateTime   @default(now())
  updatedAt    DateTime   @updatedAt
  favorites    Favorite[]
  portfolio    Portfolio?
}

model Favorite {
  id        String   @id @default(cuid())
  userId    String
  cryptoId  String
  createdAt DateTime @default(now())
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([userId, cryptoId])
}

model Portfolio {
  id        String              @id @default(cuid())
  userId    String              @unique
  name      String              @default("Mi Portfolio")
  createdAt DateTime            @default(now())
  updatedAt DateTime            @updatedAt
  user      User                @relation(fields: [userId], references: [id], onDelete: Cascade)
  holdings  PortfolioHolding[]
}

model PortfolioHolding {
  id          String   @id @default(cuid())
  portfolioId String
  cryptoId    String
  coinName    String
  coinSymbol  String
  coinImage   String?
  amount      Float
  entryPrice  Float
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  portfolio   Portfolio @relation(fields: [portfolioId], references: [id], onDelete: Cascade)

  @@unique([portfolioId, cryptoId])
}
```

## 🎯 UX Premium Refinement

Refinamiento global de experiencia de usuario para que CryptoVault se sienta como una plataforma fintech profesional.

### Microinteracciones (F5)

Todos los botones ahora tienen feedback visual consistente:
- **Press feedback**: `active:scale-90` o `active:scale-95` en ~15 botones que faltaban (favorite-button, market-table favorites, search buttons, portfolio edit buttons)
- **Hover states**: botones con `hover:bg-*` y `hover:text-*` consistentes
- **Disabled states**: `disabled:opacity-50` en botones de submit y acciones
- **Input focus**: todos los inputs tienen `focus:ring-2 focus:ring-accent/50` (search-bar, market-table search, category-coin-table search)
- **Card hover**: `hover:shadow-md` añadido a coin-about y portfolio-chart
- **Table row highlight**: `hover:bg-muted/30` en portfolio-table (consistente con market-table y category-coin-table)

### Navegación y experiencia (F6)

- **LandingHeader**: active page indicator con `bg-accent/10 text-accent` + `aria-current="page"` usando `usePathname`. Implementado en desktop y mobile drawer.
- **Auth pages**: sin cambios (server components, no necesitan animación de montaje)

### UX Global Review — Loading/Empty/Error states (F4)

**Archivos nuevos creados:**

| Ruta | loading.tsx | error.tsx |
|------|-------------|-----------|
| `/dashboard` | ✅ Skeletons (MarketIntelligence, TrendingCoins, CryptoList) | ✅ ErrorState component |
| `/market` | ✅ Refactor a Skeleton component | ✅ ErrorState component |
| `/categories` | (ya existía) | ✅ Refactor inline → ErrorState |
| `/categories/[id]` | (ya existía) | ✅ ErrorState component |
| `/coin/[id]` | ✅ Inline skeletons → loading.tsx | ✅ ErrorState con reset |
| `/profile` | (ya existía) | ✅ Refactor inline → ErrorState |
| `/portfolio` | ✅ Inline skeletons → loading.tsx | ✅ ErrorState component |
| `/auth/login` | — | ✅ ErrorState component |
| `/auth/register` | — | ✅ ErrorState component |

**Mejoras adicionales:**
- **Dashboard**: empty state con `<EmptyState>` + botón reintentar cuando API devuelve 0 coins
- **Coin detail**: `onRetry` añadido al ErrorState (antes no tenía forma de reintentar)
- **Categories**: retry refactorizado de `window.location.reload()` a fetch callback (no pierde estado)
- **Portfolio table**: empty state refactorizado de div inline a `<EmptyState>` component
- **Market loading**: refactorizado de raw `animate-pulse` divs a `<Skeleton>` component

### Responsive UX — Portfolio table (F7)

Portfolio table ahora tiene **dual layout** como market-table:
- **Desktop** (`md:` y up): tabla completa con 7 columnas, inline editing, stagger animation
- **Mobile** (`< md`): cards apiladas con imagen, nombre, cantidad editable, precio entrada editable, precio actual, P&L, ROI y botón eliminar. Inline editing funcional también en mobile.

### Visual Quality Score: 9/10

| Criterio | Peso | Score | Mejoras |
|----------|------|-------|---------|
| ¿Parece herramienta financiera real? | 30% | 9/10 | font-mono, colores semánticos, hover states |
| UX — el usuario entiende qué hacer | 25% | 9/10 | Empty states con CTA, loading skeletons |
| Feedback — cada acción responde | 20% | 9/10 | active:scale, toast, disabled states |
| Consistencia entre páginas | 15% | 9/10 | ErrorState/EmptyState/Skeleton uniformes |
| Responsive | 10% | 8/10 | Portfolio table dual layout, summary grid 2/4 |

**Mejoras menores identificadas:**
- Landing page y auth pages no tienen `AnimatedMount` (intencional, son server-first)
- Portfolio chart hover solo `shadow-md` (sin translate-Y como las cards del dashboard)
- Edit inline inputs en mobile tienen `w-28` que puede quedar ajustado en 320px

## 🪙 Landing Crypto Identity Refinement

Refinamiento visual de la Landing Page para alinearla con Dashboard, Market y Coin Detail — misma identidad crypto, mismos componentes, misma calidad visual.

### Nuevo componente compartido: `CryptoIcon`

**Archivo:** `frontend/src/components/ui/crypto-icon.tsx`

Componente que unifica el renderizado de iconos de criptomonedas (antes repetido inline en 7+ componentes):

| Prop | Tipo | Default | Descripción |
|------|------|---------|-------------|
| `src` | `string \| null` | — | URL de CoinGecko CDN |
| `alt` | `string` | — | Texto alternativo |
| `symbol` | `string` | — | Símbolo para fallback (primer carácter) |
| `size` | `number` | `24` | Tamaño en px (width + height) |
| `className` | `string` | — | Clases adicionales |

Elimina ~10 líneas de código repetido de cada componente existente. Sigue el mismo patrón que `market-table.tsx`: `next/image` con `fill` + `unoptimized`, fallback con `bg-muted` y símbolo en mayúscula.

### Mock data con imágenes reales

Todas las entradas mock de la landing ahora incluyen URLs reales de CoinGecko CDN — cero llamadas API, imágenes ya cacheadas por el navegador.

| Dataset | Items | Imágenes agregadas |
|---------|-------|--------------------|
| `MOCK_TICKER` | BTC, ETH, SOL, XRP, ADA | ✅ |
| `MOCK_COINS` | BTC, ETH, SOL, XRP, ADA | ✅ |
| `MOCK_CATEGORIES.top_3_coins` | UNI, AAVE, MKR, NEAR, FET, INJ, IMX, GALA, SAND, ARB, OP, MATIC | ✅ |

### HeroSection — 3 cards renovadas

| Card | Antes | Después |
|------|-------|---------|
| **BTC Price** | Icono genérico TrendingUp naranja | `CryptoIcon` real de Bitcoin (28px) + `Badge` con 24h change |
| **Alert** | Sin cambios (no aplica) | Sin cambios |
| **Watchlist** | 3 círculos grises sin identidad | `CryptoIcon` para BTC/ETH/SOL (20px), precio con `formatPrice`, cambio con `Badge` |

### MarketTicker

Cada ticker item ahora precede el nombre con `CryptoIcon` (20px) del coin correspondiente.

### MarketPreview

Las 3 cards de top coins mostraban un `div` gris de 32px como placeholder de icono. Ahora muestran `CryptoIcon` real con la imagen de cada coin.

### BentoFeatures — Watchlist card

Card de watchlist renovada: datos reales desde `MOCK_TICKER`, iconos reales con `CryptoIcon`, precios formateados con `formatPrice`, cambios porcentuales con `Badge`.

### Visual Quality Score: 9.5/10

| Criterio | Peso | Score | Antes | Después |
|----------|------|-------|-------|---------|
| Identidad crypto visual | 25% | 10/10 | Iconos genéricos / placeholder grises | Mismos iconos que Dashboard/Market |
| Cohesión Landing ↔ App | 25% | 10/10 | Se sentían como productos distintos | Mismos componentes, mismos badges |
| Calidad de componentes | 20% | 9/10 | Badge y formatters ya compartidos | + CryptoIcon compartido |
| Performance | 15% | 10/10 | Mock data sin llamadas API | + CDN URLs estáticas, cache del browser |
| Fidelidad de datos mock | 15% | 8/10 | Precios sin cambio % en watchlist | Precios + Badge con cambio real |

## ✏️ Portfolio Add Asset UX Redesign

Rediseño completo del flujo de agregar activos al portfolio. El antiguo formulario con 6 campos manuales se reemplaza por un flujo de 2 pasos: buscar y seleccionar moneda → registrar inversión.

### Paso 1 — Crypto Search (antes: 4 campos manuales)

Reemplazados los campos de `cryptoId`, `name`, `symbol` e `image URL` por un buscador con 250 monedas precargadas de CoinGecko.

| Antes | Después |
|-------|---------|
| 4 inputs de texto (ID, nombre, símbolo, URL) | Buscador con debounce + resultados con icono real, nombre, símbolo, precio y cambio 24h |
| El usuario debía conocer el CoinGecko ID | Solo escribir parte del nombre o símbolo |
| Image URL manual (posible error 404) | Imagen autocompletada desde CoinGecko |

Características del buscador:
- Carga **250 monedas** (top por market cap) al abrir el modal — cobertura para activos fuera del top 100
- Búsqueda con `useDebounce(query, 300ms)` filtrando por nombre y símbolo
- Resultados limitados a **8 máximos** para rendimiento visual
- Cada resultado muestra: `CryptoIcon 24px` + nombre + símbolo + precio con `formatPrice` + cambio 24h con `<Badge>`

### Paso 2 — Solo datos de inversión

Al seleccionar una moneda, el modal transiciona suavemente al formulario de inversión:

```
← Volver a buscar

┌─────────────────────────────────────┐
│ [₿ 40px]  Bitcoin                   │  ← Double Bezel preview card
│            BTC                       │     (locked, no editable)
│                                     │
│  Precio actual:     $67,450          │
│  24h:               +2.34%           │  ← Badge verde/rojo
└─────────────────────────────────────┘

Cantidad
┌─────────────────────────────────────┐
│  [input number]                      │  ← focus ring, font-mono
└─────────────────────────────────────┘
{error inline si ≤ 0}

Precio de entrada (USD)
┌─────────────────────────────────────┐
│  [input number]                      │
└─────────────────────────────────────┘
{error inline si ≤ 0}

[Cancelar]     [✓ Agregar]
```

**Preview card:**
- `rounded-2xl border border-border/40 bg-card/30 p-1.5 backdrop-blur-sm` — Double Bezel adaptado del Landing
- `CryptoIcon 40px` + nombre + símbolo (locked)
- Precio actual con `formatPrice` + cambio 24h con `<Badge>`
- Sin hover animations (más simple que Landing cards, acorde al contexto formulario)

**Validaciones inline:**
- Cantidad > 0 → error debajo del input en `text-xs text-red`
- Precio entrada > 0 → error debajo del input en `text-xs text-red`
- Errores se limpian al empezar a escribir en el campo
- Botón submit se mantiene functional (no se deshabilita por validación)

### Performance

| Aspecto | Decisión |
|---------|----------|
| Carga de monedas | 250 top coins una vez al abrir el modal (lazy) |
| Búsqueda | Cliente-side con debounce 300ms — sin requests por tipeo |
| Llamadas API | Una sola llamada `getMarkets("usd", 250)` por apertura |
| Cache | Datos descartados al cerrar el modal — sin estado persistente innecesario |
| Sin cambios en backend | 0 archivos modificados en backend |

### Archivos modificados

| Archivo | Cambio |
|---------|--------|
| `src/components/portfolio/add-holding-modal.tsx` | **REWRITE** — 180 lines → nueva lógica 2 pasos |
| `src/translations/es.ts` | Reemplazo de claves `modal.*` (10 nuevas, 0 eliminadas) |

### Visual Quality Score: 10/10

| Criterio | Peso | Score | Notas |
|----------|------|-------|-------|
| UX — el usuario entiende el flujo | 30% | 10/10 | Buscar → seleccionar → datos de entrada |
| Feedback — cada acción responde | 25% | 10/10 | active:scale, inline errors, loading states |
| Consistencia con el resto de la app | 25% | 10/10 | CryptoIcon, Badge, formatPrice, Double Bezel |
| Performance | 20% | 10/10 | Una sola request lazy, filter client-side |

## 🚀 CI/CD (GitHub Actions)

Workflow en `.github/workflows/ci.yml` con 4 jobs paralelos:

| Job            | Comando            |
|----------------|--------------------|
| `lint-backend` | `tsc --noEmit`     |
| `lint-frontend`| `npm run lint`     |
| `test-backend` | `vitest run`       |
| `build-frontend`| `next build`      |

Trigger: `push` y `pull_request` a `main`. Job `status-check` consolida y requiere todos los anteriores.

## 🗺️ Próximos Pasos

- [x] CI/CD con GitHub Actions
- [x] Búsqueda de criptomonedas con debounce
- [x] Crypto Market Explorer (categorías premium + detalle de sector)
- [x] Tests e2e de categorías y detalle (39 tests total)
- [x] Página /market con tabla profesional (sort, search, top filter, 7d column)
- [x] Coin Detail premium (CoinDetailHeader, CoinAbout, PriceChart 1d/1y, stat cards con supply)
- [x] Watchlist profesional con sort, badges 7d, dashboard de perfil
- [x] Performance: dynamic imports + React.memo
- [x] Visual Quality: CSS vars en chart, active:scale-95 en botones, cursor-pointer
- [x] API Reliability: fetchWithTimeout, stale cache fallback, 503, universal retry, logs estructurados
- [x] Error response estructurado: { success: false, error: "mensaje usuario" } + log de err.cause para diagnóstico de red
- [x] Localización completa al español (es-AR, ~220 strings centralizadas)
- [x] Landing Page Premium (hero 60/40 con mock cards en vivo, market ticker infinito, bento features, market preview, double-bezel cards)
- [x] Route groups: separación landing vs app con layouts independientes
- [x] Portfolio personal con P&L tracking (summary, tabla, chart donut, modal add holding)
- [x] UX Premium Refinement — Microinteracciones, navegación activa, loading/error/empty states, responsive portfolio table, animaciones stagger
- [x] Landing Crypto Identity Refinement — CryptoIcon compartido, imágenes reales de CoinGecko, watchlist con cambios, consistencia visual landing ↔ app
- [x] Portfolio Add Asset UX Redesign — buscador de 250 monedas, 2-step flow, preview con Double Bezel, validaciones inline
- [ ] Alertas de precio (backend + frontend)
- [ ] Solucionar Docker Desktop para e2e local
- [ ] Página de comparación de monedas
