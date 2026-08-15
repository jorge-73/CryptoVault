import { Router } from 'express';
import { authController } from '../controllers/auth.js';
import { authenticate } from '../middlewares/auth.js';
import { optionalAuth } from '../middlewares/optionalAuth.js';
import { validate } from '../middlewares/validate.js';
import { loginLimiter } from '../middlewares/rateLimiter.js';
import { registerSchema, loginSchema } from '../schemas/auth.schema.js';

const router = Router();

router.post('/register', loginLimiter, validate(registerSchema), authController.register);
router.post('/login', loginLimiter, validate(loginSchema), authController.login);
router.post('/logout', authController.logout);
router.post('/refresh', authController.refresh);
router.get('/me', optionalAuth, authController.me);

export default router;
