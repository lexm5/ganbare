import { Router } from 'express';
import { badgeController } from '../controllers';

const router = Router();

/**
 * GET /api/badges
 */
router.get('/', badgeController.list);

export default router;
