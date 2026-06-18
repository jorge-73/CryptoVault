import { prisma } from '../config/prisma.js';

export const favoritesService = {
  async getFavorites(userId: string) {
    return prisma.favorite.findMany({
      where: { userId },
      select: { cryptoId: true, createdAt: true },
      orderBy: { createdAt: 'desc' },
    });
  },

  async addFavorite(userId: string, cryptoId: string) {
    return prisma.favorite.create({
      data: { userId, cryptoId },
    });
  },

  async removeFavorite(userId: string, cryptoId: string) {
    return prisma.favorite.deleteMany({
      where: { userId, cryptoId },
    });
  },
};
