import { Router } from 'express';
import { cryptoController } from '../controllers/crypto.js';

const router = Router();

router.get('/markets', cryptoController.getMarkets);
router.get('/categories', cryptoController.getCategories);

export default router;
