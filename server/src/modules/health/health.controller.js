import { env } from '../../config/env.js';

export const healthCheck = (req, res) => {
  res.status(200).json({
    success: true,
    message: 'TaskFlow API is running',
    environment: env.nodeEnv,
  });
};