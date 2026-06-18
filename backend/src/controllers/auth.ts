import { Request, Response, NextFunction } from 'express';
import { authService } from '../services/auth.js';
import { signAccessToken } from '../utils/jwt.js';
import { env } from '../config/env.js';

const ACCESS_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  maxAge: 15 * 60 * 1000,
};

const REFRESH_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

export const authController = {
  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password, name } = req.body;
      const user = await authService.register(email, password, name);

      const payload = { userId: user.id, email: user.email };
      const accessToken = signAccessToken(payload);
      const { refreshToken } = await authService.login(email, password);

      res.cookie('access_token', accessToken, ACCESS_COOKIE_OPTIONS);
      res.cookie('refresh_token', refreshToken, REFRESH_COOKIE_OPTIONS);

      res.status(201).json({ user });
    } catch (err) {
      next(err);
    }
  },

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;
      const { id, name, refreshToken } = await authService.login(email, password);
      const accessToken = signAccessToken({ userId: id, email });

      res.cookie('access_token', accessToken, ACCESS_COOKIE_OPTIONS);
      res.cookie('refresh_token', refreshToken, REFRESH_COOKIE_OPTIONS);

      res.json({ user: { id, email, name } });
    } catch (err) {
      next(err);
    }
  },

  async logout(_req: Request, res: Response) {
    res.clearCookie('access_token', { httpOnly: true, secure: env.NODE_ENV === 'production', sameSite: 'lax' });
    res.clearCookie('refresh_token', { httpOnly: true, secure: env.NODE_ENV === 'production', sameSite: 'lax' });
    res.json({ message: 'Logged out successfully' });
  },

  async refresh(req: Request, res: Response, next: NextFunction) {
    try {
      const refreshToken = req.cookies?.refresh_token;

      if (!refreshToken) {
        res.status(401).json({ error: 'Refresh token required' });
        return;
      }

      const { id, email, name } = await authService.refreshTokens(refreshToken);
      const accessToken = signAccessToken({ userId: id, email });

      res.cookie('access_token', accessToken, ACCESS_COOKIE_OPTIONS);
      res.cookie('refresh_token', refreshToken, REFRESH_COOKIE_OPTIONS);

      res.json({ user: { id, email, name } });
    } catch (err) {
      next(err);
    }
  },

  async me(req: Request, res: Response, next: NextFunction) {
    try {
      const authReq = req as any;
      if (!authReq.user?.userId) {
        res.json({ user: null });
        return;
      }

      const { prisma } = await import('../config/prisma.js');

      const user = await prisma.user.findUnique({
        where: { id: authReq.user.userId },
        select: { id: true, email: true, name: true, createdAt: true },
      });

      res.json({ user: user || null });
    } catch (err) {
      next(err);
    }
  },
};
