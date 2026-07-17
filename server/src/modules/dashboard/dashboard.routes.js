import express from 'express';

import { validate } from '../../middleware/validate.middleware.js';
import { USER_ROLES } from '../../shared/constants/user.constants.js';
import { authenticate, authorize } from '../auth/auth.middleware.js';
import {
  getAdminDashboardController,
  getEmployeeDashboardController,
  getManagerDashboardController,
} from './dashboard.controller.js';
import {
  adminDashboardSchema,
  employeeDashboardSchema,
  managerDashboardSchema,
} from './dashboard.validation.js';

const router = express.Router();

router.use(authenticate);

router.get(
  '/admin',
  authorize(USER_ROLES.ADMIN),
  validate(adminDashboardSchema),
  getAdminDashboardController,
);

router.get(
  '/manager',
  authorize(USER_ROLES.MANAGER),
  validate(managerDashboardSchema),
  getManagerDashboardController,
);

router.get(
  '/employee',
  authorize(USER_ROLES.EMPLOYEE),
  validate(employeeDashboardSchema),
  getEmployeeDashboardController,
);

export default router;
