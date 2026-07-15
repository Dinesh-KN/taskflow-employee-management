import express from 'express';

import { validate } from '../../middleware/validate.middleware.js';
import { USER_ROLES } from '../../shared/constants/user.constants.js';
import { authenticate, authorize } from '../auth/auth.middleware.js';
import {
  listTasks,
  getTask,
  updateTask,
  updateTaskStatus,
  updateTaskAssignee,
} from './task.controller.js';
import {
  taskIdParamSchema,
  getTasksSchema,
  updateTaskSchema,
  updateTaskStatusSchema,
  updateTaskAssigneeSchema,
} from './task.validation.js';

const router = express.Router();

router.use(authenticate);

router.get('/', validate(getTasksSchema), listTasks);

router.get('/:taskId', validate(taskIdParamSchema), getTask);

router.patch(
  '/:taskId',
  authorize(USER_ROLES.ADMIN, USER_ROLES.MANAGER),
  validate(updateTaskSchema),
  updateTask,
);

router.patch(
  '/:taskId/status',
  validate(updateTaskStatusSchema),
  updateTaskStatus,
);

router.patch(
  '/:taskId/assignee',
  authorize(USER_ROLES.ADMIN, USER_ROLES.MANAGER),
  validate(updateTaskAssigneeSchema),
  updateTaskAssignee,
);

export default router;
