import express from 'express';

import { validate } from '../../middleware/validate.middleware.js';
import { login } from './auth.controller.js';
import { loginRateLimiter } from './auth.rateLimit.js';
import { loginSchema } from './auth.validation.js';

const router = express.Router();

router.post('/login', loginRateLimiter, validate(loginSchema), login);

export default router;
