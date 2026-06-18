import { Router } from 'express';
import { authController } from '../controllers/auth.js';
import { authenticate } from '../middlewares/auth.js';
import { optionalAuth } from '../middlewares/optionalAuth.js';
import { validate } from '../middlewares/validate.js';
import { registerSchema, loginSchema } from '../schemas/auth.schema.js';

const router = Router();

router.post('/register', validate(registerSchema), authController.register);
router.post('/login', validate(loginSchema), authController.login);
router.post('/logout', authController.logout);
router.get('/me', optionalAuth, authController.me);

export default router;
