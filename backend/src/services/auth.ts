import bcrypt from 'bcryptjs';
import { prisma } from '../config/prisma.js';
import { AppError } from '../middlewares/errorHandler.js';
import { signRefreshToken, verifyRefreshToken, JwtPayload } from '../utils/jwt.js';

export const authService = {
  async register(email: string, password: string, name?: string) {
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      throw new AppError('Email already registered', 409);
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const user = await prisma.user.create({
      data: { email, password: hashedPassword, name },
      select: { id: true, email: true, name: true, createdAt: true },
    });

    return user;
  },

  async login(email: string, password: string) {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw new AppError('Invalid email or password', 401);
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      throw new AppError('Invalid email or password', 401);
    }

    const payload: JwtPayload = { userId: user.id, email: user.email };
    const refreshToken = signRefreshToken(payload);

    await prisma.user.update({
      where: { id: user.id },
      data: { refreshToken },
    });

    return { id: user.id, email: user.email, name: user.name, refreshToken };
  },

  async refreshTokens(oldRefreshToken: string) {
    let payload: JwtPayload;
    try {
      payload = verifyRefreshToken(oldRefreshToken);
    } catch {
      throw new AppError('Invalid or expired refresh token', 401);
    }

    const user = await prisma.user.findUnique({ where: { id: payload.userId } });
    if (!user || user.refreshToken !== oldRefreshToken) {
      throw new AppError('Invalid refresh token', 401);
    }

    const newPayload: JwtPayload = { userId: user.id, email: user.email };
    const newRefreshToken = signRefreshToken(newPayload);

    await prisma.user.update({
      where: { id: user.id },
      data: { refreshToken: newRefreshToken },
    });

    return { id: user.id, email: user.email, name: user.name, refreshToken: newRefreshToken };
  },
};
