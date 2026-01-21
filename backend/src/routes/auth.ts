import { Router } from 'express';
import { authController } from '../controllers';
import { validateBody, v, patterns } from '../api';

const router = Router();

/**
 * POST /api/auth/register
 */
router.post(
  '/register',
  validateBody({
    email: v.string().required().pattern(patterns.email, 'メールアドレスの形式が正しくありません'),
    name: v.string().required().min(1).max(100),
    password: v.string().required().min(8, 'パスワードは8文字以上で入力してください'),
  }),
  authController.register
);

/**
 * POST /api/auth/login
 */
router.post(
  '/login',
  validateBody({
    email: v.string().required(),
    password: v.string().required(),
  }),
  authController.login
);

/**
 * POST /api/auth/logout
 */
router.post('/logout', authController.logout);

/**
 * GET /api/auth/me
 */
router.get('/me', authController.me);

export default router;
