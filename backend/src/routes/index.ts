import { Router } from 'express';
import authRoutes from './auth';
import taskRoutes from './tasks';
import categoryRoutes from './categories';
import habitRoutes from './habits';
import rewardRoutes from './rewards';
import badgeRoutes from './badges';
import pomodoroRoutes from './pomodoro';
import statsRoutes from './stats';

const router = Router();

// 各ルートをマウント
router.use('/auth', authRoutes);
router.use('/tasks', taskRoutes);
router.use('/categories', categoryRoutes);
router.use('/habits', habitRoutes);
router.use('/rewards', rewardRoutes);
router.use('/badges', badgeRoutes);
router.use('/pomodoro', pomodoroRoutes);
router.use('/stats', statsRoutes);

export default router;
