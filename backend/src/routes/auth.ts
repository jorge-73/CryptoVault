import { Router } from 'express';
import { authController } from '../controllers/auth.js';
import { authenticate } from '../middlewares/auth.js';
import { optionalAuth } from '../middlewares/optionalAuth.js';

const router = Router();

router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/logout', authController.logout);
router.get('/me', optionalAuth, authController.me);

export default router;
