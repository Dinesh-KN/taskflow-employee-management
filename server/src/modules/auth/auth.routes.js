import express from 'express';

import { validate } from '../../middleware/validate.middleware.js';
import { authenticate, authorize } from './auth.middleware.js';
import {
  login,
  refresh,
  logout,
  getMe,
  changePassword,
  resetPassword,
} from './auth.controller.js';
import { loginRateLimiter, refreshRateLimiter } from './auth.rate-limit.js';
import {
  loginSchema,
  changePasswordSchema,
  resetPasswordSchema,
} from './auth.validation.js';
import { USER_ROLES } from '../../shared/constants/user.constants.js';

const router = express.Router();

router.post('/login', loginRateLimiter, validate(loginSchema), login);
router.post('/refresh', refreshRateLimiter, refresh);
router.post('/logout', logout);
router.get('/me', authenticate, getMe);
router.patch(
  '/change-password',
  authenticate,
  validate(changePasswordSchema),
  changePassword,
);
router.patch(
  '/reset-password/:userId',
  authenticate,
  authorize(USER_ROLES.ADMIN),
  validate(resetPasswordSchema),
  resetPassword,
);

export default router;
