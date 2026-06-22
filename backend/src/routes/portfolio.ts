import { Router } from 'express';
import { portfolioController } from '../controllers/portfolio.js';
import { authenticate } from '../middlewares/auth.js';
import { validate } from '../middlewares/validate.js';
import { addHoldingSchema, updateHoldingSchema } from '../schemas/portfolio.schema.js';

const router = Router();

router.use(authenticate);

router.get('/', portfolioController.get);
router.post('/holdings', validate(addHoldingSchema), portfolioController.addHolding);
router.put('/holdings/:holdingId', validate(updateHoldingSchema), portfolioController.updateHolding);
router.delete('/holdings/:holdingId', portfolioController.removeHolding);

export default router;
