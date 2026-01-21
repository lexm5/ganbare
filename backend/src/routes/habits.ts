import { Router } from 'express';
import { habitController } from '../controllers';
import { validateBody, v } from '../api';

const router = Router();

/**
 * GET /api/habits
 */
router.get('/', habitController.list);

/**
 * POST /api/habits
 */
router.post(
  '/',
  validateBody({
    name: v.string().required().min(1).max(100),
    icon: v.string().max(50),
  }),
  habitController.create
);

/**
 * DELETE /api/habits/:id
 */
router.delete('/:id', habitController.delete);

/**
 * POST /api/habits/:id/check
 */
router.post('/:id/check', habitController.check);

/**
 * DELETE /api/habits/:id/check
 */
router.delete('/:id/check', habitController.uncheck);

export default router;
