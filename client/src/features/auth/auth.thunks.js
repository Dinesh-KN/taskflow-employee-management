import { createAsyncThunk } from '@reduxjs/toolkit';

import { clearAccessToken, setAccessToken } from '@/api/axios-instance';

import { authApi } from './auth.api';

export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await authApi.login(credentials);

      const accessToken = response.data?.accessToken;
      const user = response.data?.user;

      setAccessToken(accessToken);

      return {
        user,
      };
    } catch (error) {
      clearAccessToken();

      return rejectWithValue(error);
    }
  },
);

export const fetchCurrentUser = createAsyncThunk(
  'auth/fetchCurrentUser',
  async (_, { rejectWithValue }) => {
    try {
      const response = await authApi.getCurrentUser();

      return {
        user: response.data?.user,
      };
    } catch (error) {
      clearAccessToken();

      return rejectWithValue(error);
    }
  },
);

export const logoutUser = createAsyncThunk(
  'auth/logoutUser',
  async (_, { rejectWithValue }) => {
    try {
      await authApi.logout();

      clearAccessToken();

      return true;
    } catch (error) {
      clearAccessToken();

      return rejectWithValue(error);
    }
  },
);

export const changeCurrentUserPassword = createAsyncThunk(
  'auth/changeCurrentUserPassword',
  async (payload, { rejectWithValue }) => {
    try {
      const response = await authApi.changePassword(payload);

      clearAccessToken();

      return {
        message: response.message,
      };
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);
