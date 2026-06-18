import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middlewares/auth.js';
import { favoritesService } from '../services/favorites.js';
import { coingeckoService } from '../services/coingecko.js';

export const favoritesController = {
  async getAll(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const favorites = await favoritesService.getFavorites(userId);

      if (favorites.length === 0) {
        res.json([]);
        return;
      }

      const cryptoIds = favorites.map((f) => f.cryptoId);
      const prices = await coingeckoService.getPricesByIds(cryptoIds);

      const result = prices.map((coin) => {
        const fav = favorites.find((f) => f.cryptoId === coin.id);
        return { ...coin, favoritedAt: fav?.createdAt };
      });

      res.json(result);
    } catch (err) {
      next(err);
    }
  },

  async add(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const { cryptoId } = req.body;

      await favoritesService.addFavorite(userId, cryptoId);
      res.status(201).json({ message: 'Added to favorites' });
    } catch (err) {
      next(err);
    }
  },

  async remove(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const cryptoId = req.params.cryptoId as string;

      await favoritesService.removeFavorite(userId, cryptoId);
      res.json({ message: 'Removed from favorites' });
    } catch (err) {
      next(err);
    }
  },
};
