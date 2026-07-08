import { getRefreshTokenCookieOptions } from './auth.cookie.js';
import { loginUser, issueNewAccessToken, logoutUser } from './auth.service.js';

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
