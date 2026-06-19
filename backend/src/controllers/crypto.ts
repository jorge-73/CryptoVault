import { Request, Response, NextFunction } from 'express';
import { coingeckoService } from '../services/coingecko.js';
import { AppError } from '../middlewares/errorHandler.js';

export const cryptoController = {
  async getMarkets(req: Request, res: Response, next: NextFunction) {
    try {
      const currency = (req.query.currency as string) || 'usd';
      const perPage = Number(req.query.per_page) || 50;
      const data = await coingeckoService.getMarkets(currency, perPage);
      res.json(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch market data from CoinGecko';
      next(new AppError(message, 502));
    }
  },

  async getCategories(_req: Request, res: Response, next: NextFunction) {
    try {
      const categories = await coingeckoService.getCategories();
      res.json(categories);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch categories from CoinGecko';
      next(new AppError(message, 502));
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
      const message = err instanceof Error ? err.message : 'Failed to fetch category coins from CoinGecko';
      next(new AppError(message, 502));
    }
  },

  async getGlobal(_req: Request, res: Response, next: NextFunction) {
    try {
      const data = await coingeckoService.getGlobal();
      res.json(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch global data from CoinGecko';
      next(new AppError(message, 502));
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
      const message = err instanceof Error ? err.message : 'Failed to fetch chart data from CoinGecko';
      next(new AppError(message, 502));
    }
  },
};
