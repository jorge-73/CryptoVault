import rateLimit from 'express-rate-limit';

const isDev = process.env.NODE_ENV !== 'production';

export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: isDev ? 100 : 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests, please try again later' },
});

export const cryptoLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: isDev ? 200 : 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests, please try again later' },
});
