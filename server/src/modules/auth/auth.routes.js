import express from 'express';

import { validate } from '../../middleware/validate.middleware.js';
import { authenticate } from './auth.middleware.js';
import {
  login,
  refresh,
  logout,
  getMe,
  changePassword,
} from './auth.controller.js';
import { loginRateLimiter, refreshRateLimiter } from './auth.rate-limit.js';
import { loginSchema, changePasswordSchema } from './auth.validation.js';

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

export default router;
