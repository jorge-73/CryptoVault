import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middlewares/auth.js';
import { portfolioService } from '../services/portfolio.js';
import { coingeckoService } from '../services/coingecko.js';

export const portfolioController = {
  async get(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const portfolio = await portfolioService.getOrCreatePortfolio(userId);
      const holdings = portfolio.holdings;

      if (holdings.length === 0) {
        res.json({ ...portfolio, holdingsWithPrices: [] });
        return;
      }

      const cryptoIds = [...new Set(holdings.map((h) => h.cryptoId))];
      const prices = await coingeckoService.getPricesByIds(cryptoIds);

      const holdingsWithPrices = holdings.map((h) => {
        const priceData = prices.find((p) => p.id === h.cryptoId);
        const currentPrice = priceData?.current_price ?? null;
        const currentValue = currentPrice != null ? currentPrice * h.amount : null;
        const costBasis = h.entryPrice * h.amount;
        const pnl = currentValue != null ? currentValue - costBasis : null;
        const roi = h.entryPrice > 0 && currentPrice != null
          ? ((currentPrice - h.entryPrice) / h.entryPrice) * 100
          : null;

        return {
          id: h.id,
          cryptoId: h.cryptoId,
          coinName: h.coinName,
          coinSymbol: h.coinSymbol,
          coinImage: h.coinImage,
          amount: h.amount,
          entryPrice: h.entryPrice,
          currentPrice,
          currentValue,
          costBasis,
          pnl,
          roi,
          priceChange24h: priceData?.price_change_percentage_24h ?? null,
          createdAt: h.createdAt,
        };
      });

      const totalValue = holdingsWithPrices.reduce((sum, h) => sum + (h.currentValue ?? 0), 0);
      const totalCostBasis = holdingsWithPrices.reduce((sum, h) => sum + h.costBasis, 0);
      const totalPnl = holdingsWithPrices.reduce((sum, h) => sum + (h.pnl ?? 0), 0);
      const totalRoi = totalCostBasis > 0 ? ((totalValue - totalCostBasis) / totalCostBasis) * 100 : null;

      res.json({
        id: portfolio.id,
        name: portfolio.name,
        totalValue,
        totalCostBasis,
        totalPnl,
        totalRoi,
        holdingsCount: holdings.length,
        holdings: holdingsWithPrices,
      });
    } catch (err) {
      next(err);
    }
  },

  async addHolding(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const data = req.body;
      const holding = await portfolioService.addHolding(userId, data);
      res.status(201).json(holding);
    } catch (err) {
      next(err);
    }
  },

  async updateHolding(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const holdingId = req.params.holdingId as string;

      const portfolio = await portfolioService.getPortfolioByHoldingId(holdingId);
      if (!portfolio || portfolio.userId !== userId) {
        res.status(404).json({ error: 'Holding not found' });
        return;
      }

      const holding = await portfolioService.updateHolding(holdingId, req.body);
      res.json(holding);
    } catch (err) {
      next(err);
    }
  },

  async removeHolding(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const holdingId = req.params.holdingId as string;

      const portfolio = await portfolioService.getPortfolioByHoldingId(holdingId);
      if (!portfolio || portfolio.userId !== userId) {
        res.status(404).json({ error: 'Holding not found' });
        return;
      }

      await portfolioService.removeHolding(holdingId);
      res.json({ message: 'Holding removed' });
    } catch (err) {
      next(err);
    }
  },
};
