import { AppError } from '../../shared/errors/app-error.js';
import { USER_STATUS } from '../../shared/constants/user.constants.js';
import { User } from '../users/user.model.js';
import { verifyAccessToken } from './auth.tokens.js';

export const authenticate = async (req, _res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new AppError('Authentication required', 401);
  }

  const accessToken = authHeader.split(' ')[1];

  let decoded;

  try {
    decoded = verifyAccessToken(accessToken);
  } catch {
    throw new AppError('Invalid or expired access token', 401);
  }

  const user = await User.findById(decoded.sub);

  if (!user) {
    throw new AppError('User no longer exists', 401);
  }

  if (user.status !== USER_STATUS.ACTIVE) {
    throw new AppError(
      'Your account is not active. Please contact admin.',
      403,
    );
  }

  req.user = user;
  next();
};

export const authorize =
  (...allowedRoles) =>
  (req, _res, next) => {
    if (!allowedRoles.includes(req.user.role)) {
      throw new AppError(
        'You do not have permission to perform this action',
        403,
      );
    }
    next();
  };
