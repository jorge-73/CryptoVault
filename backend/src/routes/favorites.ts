import { Router } from 'express';
import { favoritesController } from '../controllers/favorites.js';
import { authenticate } from '../middlewares/auth.js';

const router = Router();

router.use(authenticate);

router.get('/', favoritesController.getAll);
router.post('/', favoritesController.add);
router.delete('/:cryptoId', favoritesController.remove);

export default router;
