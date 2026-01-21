import { Router } from 'express';
import { categoryController } from '../controllers';
import { validateBody, v, patterns } from '../api';

const router = Router();

/**
 * GET /api/categories
 */
router.get('/', categoryController.list);

/**
 * POST /api/categories
 */
router.post(
  '/',
  validateBody({
    name: v.string().required().min(1).max(50),
    color: v.string().required().pattern(patterns.hexColor, 'カラーコードの形式が正しくありません（例: #1976d2）'),
  }),
  categoryController.create
);

/**
 * DELETE /api/categories/:id
 */
router.delete('/:id', categoryController.delete);

export default router;
