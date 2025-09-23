import { Router } from 'express';
import { AuthController } from '@/controllers/AuthController';
import { validateRequest, loginSchema, registerSchema } from '@/middleware/validation';
import { authenticateToken } from '@/middleware/auth';

const router = Router();
const authController = new AuthController();

// Public routes
router.post('/login', validateRequest(loginSchema), authController.login.bind(authController));
router.post('/register', validateRequest(registerSchema), authController.register.bind(authController));
router.post('/refresh-token', authController.refreshToken.bind(authController));

// Protected routes
router.get('/profile', authenticateToken, authController.getProfile.bind(authController));

export default router;
