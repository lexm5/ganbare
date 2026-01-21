import { Router } from 'express';
import { pomodoroController } from '../controllers';
import { validateBody, v } from '../api';

const router = Router();

/**
 * POST /api/pomodoro/complete
 */
router.post(
  '/complete',
  validateBody({
    duration: v.number().required().min(1),
    type: v.string().required().enum(['work', 'break']),
  }),
  pomodoroController.complete
);

/**
 * GET /api/pomodoro/stats
 */
router.get('/stats', pomodoroController.stats);

export default router;
