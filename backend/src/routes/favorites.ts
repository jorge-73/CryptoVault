import { Router } from 'express';
import { favoritesController } from '../controllers/favorites.js';
import { authenticate } from '../middlewares/auth.js';
import { validate } from '../middlewares/validate.js';
import { addFavoriteSchema } from '../schemas/favorites.schema.js';

const router = Router();

router.use(authenticate);

router.get('/', favoritesController.getAll);
router.post('/', validate(addFavoriteSchema), favoritesController.add);
router.delete('/:cryptoId', favoritesController.remove);

export default router;
