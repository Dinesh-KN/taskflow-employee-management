import { createAsyncThunk } from '@reduxjs/toolkit';

import {
  clearAccessToken,
  clearSessionHint,
  markSessionActive,
  restoreAccessToken,
  setAccessToken,
} from '@/api/axios-instance';

import { authApi } from './auth.api';

let restoreSessionPromise = null;

const requestSessionRestoration = async () => {
  /*
   * The access token is held only in memory, so it disappears after a
   * browser refresh. Restore it first using the HttpOnly refresh cookie.
   */
  await restoreAccessToken();

  return authApi.getCurrentUser();
};

export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await authApi.login(credentials);

      const accessToken = response.data?.accessToken;
      const user = response.data?.user;

      if (!accessToken || !user) {
        throw new Error('Login response is missing authentication data');
      }

      setAccessToken(accessToken);
      markSessionActive();

      return {
        user,
      };
    } catch (error) {
      clearAccessToken();
      clearSessionHint();

      return rejectWithValue(error);
    }
  },
);

/**
 * Restores a previously authenticated browser session.
 *
 * This is different from fetchCurrentUser:
 * 1. Restore the in-memory access token.
 * 2. Fetch the current user only after refresh succeeds.
 */
export const restoreSession = createAsyncThunk(
  'auth/restoreSession',
  async (_, { rejectWithValue }) => {
    try {
      /*
       * React StrictMode may execute mounting effects more than once in
       * development. Both executions share the same network promise.
       */
      if (!restoreSessionPromise) {
        restoreSessionPromise = requestSessionRestoration().finally(() => {
          restoreSessionPromise = null;
        });
      }

      const response = await restoreSessionPromise;
      const user = response.data?.user;

      if (!user) {
        throw new Error('Current-user response did not include a user');
      }

      return {
        user,
      };
    } catch (error) {
      clearAccessToken();
      clearSessionHint();

      return rejectWithValue(error);
    }
  },
);

export const fetchCurrentUser = createAsyncThunk(
  'auth/fetchCurrentUser',
  async (_, { rejectWithValue }) => {
    try {
      const response = await authApi.getCurrentUser();
      const user = response.data?.user;

      if (!user) {
        throw new Error('Current-user response did not include a user');
      }

      return {
        user,
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

      return true;
    } catch (error) {
      return rejectWithValue(error);
    } finally {
      /*
       * Local logout must always happen, even when the server request fails.
       */
      clearAccessToken();
      clearSessionHint();
    }
  },
);

export const changeCurrentUserPassword = createAsyncThunk(
  'auth/changeCurrentUserPassword',
  async (payload, { rejectWithValue }) => {
    try {
      const response = await authApi.changePassword(payload);

      clearAccessToken();
      clearSessionHint();

      return {
        message: response.message,
      };
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);
