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
│   │   ├── controllers/     # auth, crypto, favorites
│   │   ├── middlewares/      # auth JWT, error handler, rate limiter, optionalAuth, validate
│   │   ├── routes/          # express routers
│   │   ├── schemas/         # Zod schemas
│   │   ├── services/        # coingecko, auth, favorites, cache
│   │   ├── utils/           # jwt helpers
│   │   └── index.ts         # entry point
│   └── prisma/
│       └── schema.prisma    # User + Favorite
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
│   │   │   │   └── profile/    # Watchlist con sort
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
│   │   │   │   ├── social-proof.tsx
│   │   │   │   ├── features-section.tsx
│   │   │   │   ├── market-explorer-section.tsx
│   │   │   │   ├── analytics-section.tsx
│   │   │   │   ├── watchlist-section.tsx
│   │   │   │   ├── cta-section.tsx
│   │   │   │   ├── footer.tsx
│   │   │   │   └── mock-data.ts
│   │   │   ├── layout/      # Header (app), ThemeToggle
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

## 🏠 Landing Page

La raíz (`/`) es una landing page de marketing con estrategia SaaS, construida con route groups independientes del layout de la aplicación:

```
(landing)/layout.tsx    ← LandingHeader + Footer
(landing)/page.tsx     ← Landing page en /
(app)/layout.tsx       ← Header app (search bar, theme, auth) para rutas internas
```

### Secciones

| Componente | Tipo | Descripción |
|------------|------|-------------|
| `LandingHeader` | Client | Navbar minimalista (logo, nav: Mercado/Categorías/Características, CTA "Comenzar"). Drawer animado en mobile. Sin search, theme toggle ni auth. |
| `HeroSection` | Client | Título h1 + subtítulo + CTAs (Comenzar ahora / Explorar mercado) + mockup visual con StatCards y mini chart SVG. Animación fade+slide. |
| `SocialProof` | Server | 3 métricas de confianza: +10.500 criptos, +500 sectores, CoinGecko. Stats minimalistas. |
| `FeaturesSection` | Client | 3 pilares (Market Intelligence, Crypto Explorer, Asset Analysis) con iconos, copy y mockups visuales. Stagger animation. |
| `MarketExplorerSection` | Client | Tabla parcial con 5 coins hardcodeados, stagger en filas, link a /market. |
| `AnalyticsSection` | Client | 4 CategoryCards mock (DeFi, AI, Gaming, Layer 2) con stagger grid. |
| `WatchlistSection` | Client | 3 CryptoCards mock con estrella favorita, badge 24h, link a /profile. |
| `CTASection` | Server | CTA final con gradiente, "Entrar a CryptoVault" → /dashboard. |
| `Footer` | Server | 3 columnas: marca + descripción, Producto (Dashboard/Mercado/Categorías), Recursos (CoinGecko API, disclaimer, copyright). |

### Diseño y animaciones

- Mockups visuales sin llamadas API usando `mock-data.ts` con datos estáticos
- Reutilización de componentes existentes (`StatCard`, `Badge`)
- Framer Motion para entrance animations (fade+slide, stagger)
- Glass cards con `bg-card/80 backdrop-blur-sm`
- Gradientes suaves en CTA (`bg-gradient-to-br from-accent/5`)
- Sin animaciones molestas ni exceso de colores

### Edge Cases

- **Header diferenciado**: LandingHeader no tiene auth ni search. El header de la app aparece solo en rutas `(app)/`.
- **Ruta raíz limpia**: `/` es la landing, `/dashboard` es la app. `navLinks` en app header actualizado a `"/"` → `"/dashboard"`.
- **Metadata SEO**: title "CryptoVault | Plataforma de análisis crypto", OG tags básicos.
- **Loading/Error**: heredados del root layout (`app/loading.tsx`, `app/error.tsx`).

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
| `frontend/src/translations/es.ts` | Diccionario tipado `as const` con ~220 strings organizadas por módulo (nav, auth, dashboard, market, categories, coinDetail, watchlist, search, chart, badge, error, theme, crypto) |
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
}

model Favorite {
  id        String   @id @default(cuid())
  userId    String
  cryptoId  String
  createdAt DateTime @default(now())
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([userId, cryptoId])
}
```

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
- [ ] Portfolio personal (módulo de inversión)
- [ ] Alertas de precio (backend + frontend)
- [ ] Solucionar Docker Desktop para e2e local
- [ ] Página de comparación de monedas
