import { Request, Response, NextFunction } from 'express';
import { coingeckoService } from '../services/coingecko.js';

export const cryptoController = {
  async getMarkets(req: Request, res: Response, next: NextFunction) {
    try {
      const currency = (req.query.currency as string) || 'usd';
      const perPage = Number(req.query.per_page) || 50;
      const data = await coingeckoService.getMarkets(currency, perPage);
      res.json(data);
    } catch (err) {
      next(err);
    }
  },

  async getCategories(_req: Request, res: Response, next: NextFunction) {
    try {
      const data = await coingeckoService.getCategories();
      res.json(data);
    } catch (err) {
      next(err);
    }
  },
};
