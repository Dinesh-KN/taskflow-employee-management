import crypto from 'crypto';
import jwt from 'jsonwebtoken';

import { env } from '../../config/env.js';

export const generateAccessToken = (user) => {
  return jwt.sign(
    {
      sub: user._id.toString(),
      role: user.role,
    },
    env.accessTokenSecret,
    {
      expiresIn: env.accessTokenExpiresIn,
    },
  );
};

export const generateRefreshToken = (user) => {
  return jwt.sign(
    {
      sub: user._id.toString(),
    },
    env.refreshTokenSecret,
    {
      expiresIn: env.refreshTokenExpiresIn,
    },
  );
};

export const hashToken = (token) => {
  return crypto.createHash('sha256').update(token).digest('hex');
};
