import { AppError } from '../shared/errors/app-error.js';

const hasDangerousKey = (value) => {
  if (!value || typeof value !== 'object') return false;

  return Object.keys(value).some((key) => {
    if (key.startsWith('$') || key.includes('.')) {
      return true;
    }

    return hasDangerousKey(value[key]);
  });
};

export const sanitizeRequest = (req, _res, next) => {
  if (
    hasDangerousKey(req.body) ||
    hasDangerousKey(req.params) ||
    hasDangerousKey(req.query)
  ) {
    throw new AppError('Invalid request payload', 400);
  }

  next();
};
