import { Router } from 'express';
import { statsController } from '../controllers';

const router = Router();

/**
 * GET /api/stats/overview
 */
router.get('/overview', statsController.overview);

/**
 * GET /api/stats/weekly
 */
router.get('/weekly', statsController.weekly);

export default router;
