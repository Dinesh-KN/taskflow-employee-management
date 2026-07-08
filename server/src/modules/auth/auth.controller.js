import { getRefreshTokenCookieOptions } from './auth.cookie.js';
import {
  loginUser,
  issueNewAccessToken,
  logoutUser,
  getCurrentUser,
  updateCurrentUserPassword,
  resetUserPassword,
} from './auth.service.js';

export const login = async (req, res) => {
  const { email, password } = req.validated.body;

  const { accessToken, refreshToken, user } = await loginUser({
    email,
    password,
  });

  res.cookie('refreshToken', refreshToken, getRefreshTokenCookieOptions());

  res.status(200).json({
    success: true,
    message: 'Login successful',
    data: {
      accessToken,
      user,
    },
  });
};

export const refresh = async (req, res) => {
  const refreshToken = req.cookies.refreshToken;

  const { accessToken } = await issueNewAccessToken(refreshToken);

  res.status(200).json({
    success: true,
    message: 'Access token refreshed successfully',
    data: {
      accessToken,
    },
  });
};

export const logout = async (req, res) => {
  const refreshToken = req.cookies.refreshToken;

  await logoutUser(refreshToken);

  res.clearCookie('refreshToken', getRefreshTokenCookieOptions());

  res.status(200).json({
    success: true,
    message: 'Logout successful',
  });
};

export const getMe = async (req, res) => {
  const { user } = await getCurrentUser(req.user.id);

  res.status(200).json({
    success: true,
    message: 'Current user fetched successfully',
    data: {
      user,
    },
  });
};

export const changePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.validated.body;

  await updateCurrentUserPassword({
    userId: req.user.id,
    currentPassword,
    newPassword,
  });

  res.clearCookie('refreshToken', getRefreshTokenCookieOptions());

  res.status(200).json({
    success: true,
    message: 'Password changed successfully. Please login again.',
  });
};

export const resetPassword = async (req, res) => {
  const { userId } = req.validated.params;

  const { temporaryPassword, expiresAt } = await resetUserPassword(userId);

  res.status(200).json({
    success: true,
    message: 'Password reset successfully',
    data: {
      temporaryPassword,
      expiresAt,
    },
  });
};
