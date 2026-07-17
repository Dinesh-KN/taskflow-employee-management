import express from 'express';

import { validate } from '../../middleware/validate.middleware.js';
import { USER_ROLES } from '../../shared/constants/user.constants.js';
import { authenticate, authorize } from '../auth/auth.middleware.js';
import {
  getAdminDashboard,
  getEmployeeDashboard,
  getManagerDashboard,
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
  getAdminDashboard,
);

router.get(
  '/manager',
  authorize(USER_ROLES.MANAGER),
  validate(managerDashboardSchema),
  getManagerDashboard,
);

router.get(
  '/employee',
  authorize(USER_ROLES.EMPLOYEE),
  validate(employeeDashboardSchema),
  getEmployeeDashboard,
);

export default router;
