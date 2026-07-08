import { getRefreshTokenCookieOptions } from './auth.cookie.js';
import { loginUser } from './auth.service.js';

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
