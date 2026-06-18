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

      const allCoinIds = [...new Set(categories.flatMap((c) => c.top_3_coins))];
      let imageMap = new Map<string, string | null>();

      if (allCoinIds.length > 0) {
        try {
          const coinData = await coingeckoService.getPricesByIds(allCoinIds);
          imageMap = new Map(coinData.map((c) => [c.id, c.image]));
        } catch {
          // Enrichment failed — images will be null, categories still work
        }
      }

      const result = categories.map((cat) => ({
        ...cat,
        top_3_coins: cat.top_3_coins.map((id) => ({
          id,
          image: imageMap.get(id) ?? null,
        })),
      }));

      res.json(result);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch categories from CoinGecko';
      next(new AppError(message, 502));
    }
  },
};
