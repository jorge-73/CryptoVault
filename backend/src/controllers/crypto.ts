import { Request, Response, NextFunction } from 'express';
import { coingeckoService } from '../services/coingecko.js';
import { AppError } from '../middlewares/errorHandler.js';

export const cryptoController = {
  async getMarkets(req: Request, res: Response, next: NextFunction) {
    try {
      const currency = (req.query.currency as string) || 'usd';
      const ids = req.query.ids as string | undefined;
      const perPage = Number(req.query.per_page) || 50;

      if (ids) {
        const data = await coingeckoService.getPricesByIds(ids.split(','), currency);
        res.json(data);
        return;
      }

      const data = await coingeckoService.getMarkets(currency, perPage);
      res.json(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch market data';
      console.error(`[CRYPTO] GET /api/crypto/markets → ${message}`);
      next(new AppError(message, 503));
    }
  },

  async getCategories(_req: Request, res: Response, next: NextFunction) {
    try {
      const categories = await coingeckoService.getCategories();
      res.json(categories);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch categories';
      console.error(`[CRYPTO] GET /api/crypto/categories → ${message}`);
      next(new AppError(message, 503));
    }
  },

  async getCategoryCoins(req: Request<{ id: string }>, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const currency = (req.query.currency as string) || 'usd';
      const perPage = Number(req.query.per_page) || 100;

      const data = await coingeckoService.getMarkets(currency, perPage, id);
      res.json(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch category coins';
      console.error(`[CRYPTO] GET /api/crypto/categories/${req.params.id}/coins → ${message}`);
      next(new AppError(message, 503));
    }
  },

  async getGlobal(_req: Request, res: Response, next: NextFunction) {
    try {
      const data = await coingeckoService.getGlobal();
      res.json(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch global data';
      console.error(`[CRYPTO] GET /api/crypto/global → ${message}`);
      next(new AppError(message, 503));
    }
  },

  async getChart(req: Request<{ coinId: string }>, res: Response, next: NextFunction) {
    try {
      const { coinId } = req.params;
      const currency = (req.query.currency as string) || 'usd';
      const days = Number(req.query.days) || 7;

      const data = await coingeckoService.getChart(coinId, currency, days);
      res.json(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch chart data';
      console.error(`[CRYPTO] GET /api/crypto/chart/${req.params.coinId} → ${message}`);
      next(new AppError(message, 503));
    }
  },

  async getCoin(req: Request<{ id: string }>, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const data = await coingeckoService.getCoinDetail(id);
      res.json(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch coin detail';
      console.error(`[CRYPTO] GET /api/crypto/coin/${req.params.id} → ${message}`);
      next(new AppError(message, 503));
    }
  },
};
