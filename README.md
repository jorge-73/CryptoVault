# CryptoVault 🪙

Dashboard de criptomonedas en tiempo real con autenticación, categorías y sistema de favoritos.

## 🚀 Stack

| Capa        | Tecnología                         |
|-------------|------------------------------------|
| Frontend    | Next.js 16 (App Router) + Tailwind CSS v4 |
| Backend     | Node.js + Express + TypeScript     |
| Base de Datos | PostgreSQL                       |
| ORM         | Prisma 6                           |
| API Datos   | CoinGecko (free tier)              |
| Autenticación | JWT en cookies HttpOnly          |
| UI          | next-themes, sonner, lucide-react  |

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
│       └── schema.prisma    # User + Favorite + RefreshToken
├── frontend/
│   ├── e2e/                 # Playwright tests (6 specs, 21 tests)
│   │   ├── auth.spec.ts
│   │   ├── dashboard.spec.ts
│   │   ├── categories.spec.ts
│   │   ├── favorites.spec.ts
│   │   ├── coin-detail.spec.ts
│   │   ├── theme.spec.ts
│   │   └── mocks.ts         # mock data + setup functions
│   ├── src/
│   │   ├── app/             # pages (dashboard, categories, auth, profile, coin/[id])
│   │   ├── components/      # crypto cards, price chart, auth forms, layout
│   │   ├── providers/       # auth + theme context
│   │   ├── lib/             # api client, utilities
│   │   └── styles/          # globals.css (Tailwind + theme vars)
│   ├── playwright.config.ts
│   └── next.config.ts       # remote image patterns
├── docker-compose.e2e.yml   # Stack aislado para tests e2e
└── .gitignore
```

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
  - `refresh_token`: 7 días de vida, almacenado en BD con hash
- **Logout**: limpieza de ambas cookies + invalidación del refresh token
- **Refresh**: endpoint `POST /api/auth/refresh` rota el refresh token y devuelve un nuevo access token
- Endpoint `/api/auth/me` retorna `{ user }` si hay sesión o 401 si no

## 📊 Gráficos Históricos

La página `/coin/[id]` muestra un gráfico interactivo de precios usando **Recharts**:

- **AreaChart** con gradient fill (verde si sube, rojo si baja)
- Selector de rango temporal: **7d**, **30d**, **90d**
- Tooltip con precio formateado y fecha
- Datos servidos por `GET /api/crypto/chart/:coinId`

## 🧪 Tests

### Backend (Vitest + Supertest)

```bash
cd backend
npm test
```

21 tests en 3 suites — completamente mockeados (sin llamadas reales a CoinGecko):

| Suite       | Tests | Descripción                               |
|-------------|-------|-------------------------------------------|
| Auth        | 7     | registro, login, refresh, logout, duplicados |
| Crypto      | 10    | markets, categories, chart, errores 502   |
| Favorites   | 4     | CRUD, autorización, duplicados            |

Config: `fileParallelism: false` para evitar conflictos de DB entre forks.

### Frontend (Playwright)

```bash
cd frontend
npx playwright test
```

21 tests en 6 specs — todas las llamadas API mockeadas (sin dependencia del backend real):

| Spec             | Tests | Mockea                   |
|------------------|-------|--------------------------|
| Auth             | 5     | register, login, logout  |
| Dashboard        | 4     | crypto endpoints         |
| Categories       | 3     | crypto endpoints         |
| Favorites        | 3     | auth + crypto + favorites|
| Coin Detail      | 4     | crypto endpoints         |
| Theme            | 2     | auth (me)                |

**Arquitectura de mocks** (`frontend/e2e/mocks.ts`):

- `setupCryptoMocks(page)` — mockea markets, categories, chart
- `setupAuthMocks(page)` — mockea register, login, logout, me, refresh
- `setupFavoritesMocks(page)` — mockea CRUD de favoritos con estado compartido
- `authConfig.authenticated` — mutable; permite simular sesión/no sesión
- Los mocks se registran con `page.route()` y se leen en tiempo de request

### Docker Compose para e2e

```bash
docker compose -f docker-compose.e2e.yml up --build
```

Stack aislado con puertos en 3001/4001/5433 para no interferir con el dev stack local.

## 📡 API Endpoints

| Método | Ruta                        | Auth     | Descripción                     |
|--------|-----------------------------|----------|----------------------------------|
| POST   | `/api/auth/register`        | No       | Registrar usuario (rate limited)  |
| POST   | `/api/auth/login`           | No       | Iniciar sesión (rate limited)     |
| POST   | `/api/auth/logout`          | No       | Cerrar sesión                    |
| POST   | `/api/auth/refresh`         | Sí       | Refrescar access token           |
| GET    | `/api/auth/me`              | Sí       | Obtener usuario actual           |
| GET    | `/api/crypto/markets`       | No       | Listado de criptomonedas (rate limited) |
| GET    | `/api/crypto/categories`    | No       | Categorías con imágenes          |
| GET    | `/api/crypto/chart/:coinId` | No       | Precios históricos para gráfico  |
| GET    | `/api/favorites`            | Sí       | Favoritos del usuario con precios |
| POST   | `/api/favorites`            | Sí       | Añadir cripto a favoritos        |
| DELETE | `/api/favorites/:cryptoId`  | Sí       | Eliminar favorito                |

## 🧠 Cache

El backend implementa un cache en memoria con TTL para reducir llamadas a la API de CoinGecko y evitar rate limits del tier gratuito:

| Endpoint              | TTL      |
|-----------------------|----------|
| `/coins/markets`      | 60 segundos |
| `/coins/categories`   | 300 segundos |
| `/coins/markets?ids=` | 60 segundos |
| `/coins/chart`        | 300 segundos |

## ⚡ Rate Limiting

Dos rate limiters protegen los endpoints públicos:

| Limiter    | Endpoints               | Ventana | Máximo |
|------------|-------------------------|---------|--------|
| Auth       | `/api/auth/*`           | 15 min  | 10 req |
| Crypto     | `/api/crypto/*`         | 1 min   | 30 req |

## 🗄️ Modelo de Datos (Prisma)

```prisma
model User {
  id        String     @id @default(cuid())
  email     String     @unique
  password  String
  name      String?
  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt
  favorites Favorite[]
  refreshTokens RefreshToken[]
}

model RefreshToken {
  id        String   @id @default(cuid())
  token     String   @unique
  userId    String
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  expiresAt DateTime
  createdAt DateTime @default(now())
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

## 🗺️ Próximos Pasos

- [ ] CI/CD con GitHub Actions (Playwright + Vitest en cada PR)
- [ ] Paginación en el dashboard
- [ ] Búsqueda de criptomonedas
- [ ] Modo oscuro persistente con next-themes (ya implementado a nivel UI)
