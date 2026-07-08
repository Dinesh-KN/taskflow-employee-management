import express from 'express';

import { validate } from '../../middleware/validate.middleware.js';
import { login, refresh, logout } from './auth.controller.js';
import { loginRateLimiter, refreshRateLimiter } from './auth.middleware.js';
import { loginSchema } from './auth.validation.js';

const router = express.Router();

router.post('/login', loginRateLimiter, validate(loginSchema), login);
router.post('/refresh', refreshRateLimiter, refresh);
router.post('/logout', logout);

export default router;
