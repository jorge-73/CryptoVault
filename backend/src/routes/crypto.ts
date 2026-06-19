import { Router } from 'express';
import { cryptoController } from '../controllers/crypto.js';

const router = Router();

router.get('/markets', cryptoController.getMarkets);
router.get('/coin/:id', cryptoController.getCoin);
router.get('/categories', cryptoController.getCategories);
router.get('/categories/:id/coins', cryptoController.getCategoryCoins);
router.get('/global', cryptoController.getGlobal);
router.get('/chart/:coinId', cryptoController.getChart);

export default router;
