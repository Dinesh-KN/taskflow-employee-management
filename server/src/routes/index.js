import express from 'express';

import healthRoutes from '../modules/health/health.routes.js';
import authRoutes from '../modules/auth/auth.routes.js';
import userRoutes from '../modules/users/user.routes.js';
import projectRoutes from '../modules/projects/project.routes.js';
import projectTaskRoutes from '../modules/tasks/project-task.routes.js';
import taskRoutes from '../modules/tasks/task.routes.js';
import dashboardRoutes from '../modules/dashboard/dashboard.routes.js';

const router = express.Router();

router.use('/health', healthRoutes);
router.use('/auth', authRoutes);
router.use('/users', userRoutes);

router.use('/projects', projectTaskRoutes);
router.use('/projects', projectRoutes);

router.use('/tasks', taskRoutes);

router.use('/dashboard', dashboardRoutes);

export default router;
