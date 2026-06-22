import { prisma } from '../config/prisma.js';

export const portfolioService = {
  async getOrCreatePortfolio(userId: string) {
    let portfolio = await prisma.portfolio.findUnique({
      where: { userId },
      include: { holdings: true },
    });

    if (!portfolio) {
      portfolio = await prisma.portfolio.create({
        data: { userId, name: 'Mi Portfolio' },
        include: { holdings: true },
      });
    }

    return portfolio;
  },

  async addHolding(userId: string, data: {
    cryptoId: string;
    coinName: string;
    coinSymbol: string;
    coinImage?: string;
    amount: number;
    entryPrice: number;
  }) {
    const portfolio = await this.getOrCreatePortfolio(userId);

    return prisma.portfolioHolding.create({
      data: {
        portfolioId: portfolio.id,
        cryptoId: data.cryptoId,
        coinName: data.coinName,
        coinSymbol: data.coinSymbol,
        coinImage: data.coinImage ?? null,
        amount: data.amount,
        entryPrice: data.entryPrice,
      },
    });
  },

  async updateHolding(holdingId: string, data: { amount?: number; entryPrice?: number }) {
    return prisma.portfolioHolding.update({
      where: { id: holdingId },
      data,
    });
  },

  async removeHolding(holdingId: string) {
    return prisma.portfolioHolding.delete({
      where: { id: holdingId },
    });
  },

  async getHoldings(userId: string) {
    const portfolio = await this.getOrCreatePortfolio(userId);
    return portfolio.holdings;
  },

  async getPortfolioByHoldingId(holdingId: string) {
    const holding = await prisma.portfolioHolding.findUnique({
      where: { id: holdingId },
      include: { portfolio: true },
    });
    return holding?.portfolio ?? null;
  },
};
