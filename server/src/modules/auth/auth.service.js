import { AppError } from '../../shared/errors/app-error.js';
import { USER_STATUS } from '../../shared/constants/user.constants.js';
import { User } from '../users/user.model.js';
import {
  generateAccessToken,
  generateRefreshToken,
  hashToken,
} from './auth.tokens.js';

export const loginUser = async ({ email, password }) => {
  const user = await User.findOne({ email }).select('+password +refreshTokens');

  if (!user) {
    throw new AppError('Invalid email or password', 401);
  }

  if (user.status !== USER_STATUS.ACTIVE) {
    throw new AppError(
      'Your account is not active. Please contact admin.',
      403,
    );
  }

  const isPasswordValid = await user.comparePassword(password);

  if (!isPasswordValid) {
    throw new AppError('Invalid email or password', 401);
  }

  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  user.refreshTokens.push({
    tokenHash: hashToken(refreshToken),
  });

  await user.save();

  return {
    accessToken,
    refreshToken,
    user,
  };
};
