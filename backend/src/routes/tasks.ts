import { Router } from 'express';
import { taskController } from '../controllers';
import { validateBody, v } from '../api';

const router = Router();

/**
 * GET /api/tasks
 */
router.get('/', taskController.list);

/**
 * POST /api/tasks
 */
router.post(
  '/',
  validateBody({
    title: v.string().required().min(1).max(200),
    description: v.string().max(1000),
    difficulty: v.string().required().enum(['easy', 'medium', 'hard']),
    points: v.number().required().min(1).max(30),
    categoryId: v.string().required(),
    dueDate: v.string(), // YYYY-MM-DD
  }),
  taskController.create
);

/**
 * GET /api/tasks/:id
 */
router.get('/:id', taskController.get);

/**
 * PATCH /api/tasks/:id
 */
router.patch(
  '/:id',
  validateBody({
    title: v.string().min(1).max(200),
    description: v.string().max(1000),
    categoryId: v.string(),
  }),
  taskController.update
);

/**
 * DELETE /api/tasks/:id
 */
router.delete('/:id', taskController.delete);

/**
 * POST /api/tasks/:id/complete
 */
router.post('/:id/complete', taskController.complete);

/**
 * POST /api/tasks/:id/uncomplete
 */
router.post('/:id/uncomplete', taskController.uncomplete);

export default router;
