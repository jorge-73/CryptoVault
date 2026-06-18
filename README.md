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
│   │   ├── config/          # env, prisma client
│   │   ├── controllers/     # auth, crypto, favorites
│   │   ├── middlewares/      # auth JWT, error handler, optionalAuth
│   │   ├── routes/          # express routers
│   │   ├── services/        # coingecko, auth, favorites, cache
│   │   ├── utils/           # jwt helpers
│   │   └── index.ts         # entry point
│   └── prisma/
│       └── schema.prisma    # User + Favorite
├── frontend/
│   ├── src/
│   │   ├── app/             # pages (dashboard, categories, auth, profile)
│   │   ├── components/      # crypto cards, auth forms, layout
│   │   ├── providers/       # auth + theme context
│   │   ├── lib/             # api client, utilities
│   │   └── styles/          # globals.css (Tailwind + theme vars)
│   └── next.config.ts       # remote image patterns
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

- **Registro y login** con JWT
- Token almacenado en cookie **HttpOnly, Secure, SameSite**
- **Logout**: limpieza de cookie
- Endpoint `/api/auth/me` retorna `{ user }` si hay sesión o `{ user: null }` si no (no arroja 401)

## 📡 API Endpoints

| Método | Ruta                        | Auth     | Descripción                     |
|--------|-----------------------------|----------|----------------------------------|
| POST   | `/api/auth/register`        | No       | Registrar usuario                |
| POST   | `/api/auth/login`           | No       | Iniciar sesión                   |
| POST   | `/api/auth/logout`          | No       | Cerrar sesión                    |
| GET    | `/api/auth/me`              | Opcional | Obtener usuario actual           |
| GET    | `/api/crypto/markets`       | No       | Listado de criptomonedas         |
| GET    | `/api/crypto/categories`    | No       | Categorías con imágenes          |
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

## 🧪 Próximos Pasos

- [ ] Tests con Vitest (backend) + Playwright (frontend)
- [ ] Docker Compose (1 comando levanta todo)
- [ ] Zod para validación de request bodies
- [ ] Refresh tokens
- [ ] Gráficos de precios históricos
- [ ] Rate limiting en endpoints públicos
