import express from 'express';

import { validate } from '../../middleware/validate.middleware.js';
import { USER_ROLES } from '../../shared/constants/user.constants.js';
import { authenticate, authorize } from '../auth/auth.middleware.js';
import { createTask, listProjectTasks } from './task.controller.js';
import { createTaskSchema, getProjectTasksSchema } from './task.validation.js';

const router = express.Router();

router.use(authenticate);

router.post(
  '/:projectId/tasks',
  authorize(USER_ROLES.ADMIN, USER_ROLES.MANAGER),
  validate(createTaskSchema),
  createTask,
);

router.get(
  '/:projectId/tasks',
  validate(getProjectTasksSchema),
  listProjectTasks,
);

export default router;
