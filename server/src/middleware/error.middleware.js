import { env } from '../config/env.js';

export const globalErrorHandler = (err, _req, res, _next) => {
  const statusCode = err.statusCode || 500;

  const response = {
    success: false,
    message: err.isOperational ? err.message : 'Internal server error',
  };

  if (env.nodeEnv === 'development') {
    response.stack = err.stack;
  }

  res.status(statusCode).json(response);
};
