import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import { env } from './config/env.js';
import { errorHandler } from './middlewares/errorHandler.js';
import authRoutes from './routes/auth.js';
import cryptoRoutes from './routes/crypto.js';
import favoritesRoutes from './routes/favorites.js';
import portfolioRoutes from './routes/portfolio.js';
import { authLimiter, cryptoLimiter } from './middlewares/rateLimiter.js';

const app = express();

app.use(helmet());
app.use(cors({ origin: env.CORS_ORIGIN, credentials: true }));
app.use(cookieParser());
app.use(express.json());

app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/crypto', cryptoLimiter, cryptoRoutes);
app.use('/api/favorites', favoritesRoutes);
app.use('/api/portfolio', portfolioRoutes);

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use(errorHandler);

export default app;
