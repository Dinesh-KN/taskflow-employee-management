import { env } from '../../config/env.js';
import { AppError } from '../../shared/errors/app-error.js';
import { USER_STATUS } from '../../shared/constants/user.constants.js';
import { User } from '../users/user.model.js';
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
  hashToken,
} from './auth.tokens.js';
import { generateTemporaryPassword } from '../../shared/utils/generate-password.js';

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

  if (
    user.mustChangePassword &&
    user.temporaryPasswordExpiresAt &&
    user.temporaryPasswordExpiresAt < new Date()
  ) {
    throw new AppError(
      'Temporary password has expired. Please contact admin.',
      403,
    );
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

export const issueNewAccessToken = async (refreshToken) => {
  if (!refreshToken) {
    throw new AppError('Refresh token is required', 401);
  }

  let decoded;

  try {
    decoded = verifyRefreshToken(refreshToken);
  } catch {
    throw new AppError('Invalid or expired refresh token', 401);
  }

  const refreshTokenHash = hashToken(refreshToken);

  const user = await User.findById(decoded.sub).select('+refreshTokens');

  if (!user) {
    throw new AppError('Invalid refresh token', 401);
  }

  if (user.status !== USER_STATUS.ACTIVE) {
    throw new AppError(
      'Your account is not active. Please contact admin.',
      403,
    );
  }

  const tokenExists = user.refreshTokens.some(
    (storedToken) => storedToken.tokenHash === refreshTokenHash,
  );

  if (!tokenExists) {
    throw new AppError('Invalid refresh token', 401);
  }

  const accessToken = generateAccessToken(user);

  return { accessToken };
};

export const logoutUser = async (refreshToken) => {
  if (!refreshToken) {
    return;
  }

  const refreshTokenHash = hashToken(refreshToken);

  await User.updateOne(
    { 'refreshTokens.tokenHash': refreshTokenHash },
    {
      $pull: {
        refreshTokens: { tokenHash: refreshTokenHash },
      },
    },
  );
};

export const getCurrentUser = async (userId) => {
  const user = await User.findById(userId);

  if (!user) {
    throw new AppError('User not found', 404);
  }

  return { user };
};

export const updateCurrentUserPassword = async ({
  userId,
  currentPassword,
  newPassword,
}) => {
  const user = await User.findById(userId).select('+password +refreshTokens');

  if (!user) {
    throw new AppError('User not found', 404);
  }

  const isPasswordValid = await user.comparePassword(currentPassword);

  if (!isPasswordValid) {
    throw new AppError('Current password is incorrect', 400);
  }

  user.password = newPassword;
  user.mustChangePassword = false;
  user.temporaryPasswordExpiresAt = undefined;
  user.refreshTokens = [];

  await user.save();
};

export const resetUserPassword = async (userId) => {
  const user = await User.findById(userId).select('+refreshTokens');

  if (!user) {
    throw new AppError('User not found', 404);
  }

  const temporaryPassword = generateTemporaryPassword();

  const expiresAt = new Date(
    Date.now() + env.tempPasswordExpiresInHours * 60 * 60 * 1000,
  );

  user.password = temporaryPassword;
  user.mustChangePassword = true;
  user.temporaryPasswordExpiresAt = expiresAt;
  user.refreshTokens = [];

  await user.save();

  return {
    temporaryPassword,
    expiresAt,
  };
};
