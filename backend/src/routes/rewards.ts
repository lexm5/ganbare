import { Router } from 'express';
import { rewardController } from '../controllers';
import { validateBody, v } from '../api';

const router = Router();

/**
 * GET /api/rewards
 */
router.get('/', rewardController.list);

/**
 * POST /api/rewards
 */
router.post(
  '/',
  validateBody({
    name: v.string().required().min(1).max(100),
    description: v.string().required().max(500),
    cost: v.number().required().min(1),
    icon: v.string().max(50),
  }),
  rewardController.create
);

/**
 * DELETE /api/rewards/:id
 */
router.delete('/:id', rewardController.delete);

/**
 * POST /api/rewards/:id/redeem
 */
router.post('/:id/redeem', rewardController.redeem);

export default router;
