import { createSlice } from '@reduxjs/toolkit';

import { AUTH_SLICE_NAME, AUTH_STATUS } from './auth.constants';
import {
  changeCurrentUserPassword,
  fetchCurrentUser,
  loginUser,
  logoutUser,
} from './auth.thunks';

const initialState = {
  user: null,
  isAuthenticated: false,
  isAuthChecked: false,

  status: AUTH_STATUS.IDLE,
  error: null,

  passwordChangeStatus: AUTH_STATUS.IDLE,
  passwordChangeError: null,
};

const authSlice = createSlice({
  name: AUTH_SLICE_NAME,
  initialState,
  reducers: {
    clearAuthError: (state) => {
      state.error = null;
      state.passwordChangeError = null;
    },

    resetPasswordChangeState: (state) => {
      state.passwordChangeStatus = AUTH_STATUS.IDLE;
      state.passwordChangeError = null;
    },

    setCurrentUser: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = Boolean(action.payload);
      state.isAuthChecked = true;
    },

    clearAuthState: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.isAuthChecked = true;
      state.status = AUTH_STATUS.IDLE;
      state.error = null;
      state.passwordChangeStatus = AUTH_STATUS.IDLE;
      state.passwordChangeError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.status = AUTH_STATUS.LOADING;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.status = AUTH_STATUS.SUCCEEDED;
        state.user = action.payload.user;
        state.isAuthenticated = true;
        state.isAuthChecked = true;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = AUTH_STATUS.FAILED;
        state.user = null;
        state.isAuthenticated = false;
        state.isAuthChecked = true;
        state.error = action.payload;
      })

      .addCase(fetchCurrentUser.pending, (state) => {
        state.status = AUTH_STATUS.LOADING;
        state.error = null;
      })
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.status = AUTH_STATUS.SUCCEEDED;
        state.user = action.payload.user;
        state.isAuthenticated = true;
        state.isAuthChecked = true;
        state.error = null;
      })
      .addCase(fetchCurrentUser.rejected, (state, action) => {
        state.status = AUTH_STATUS.FAILED;
        state.user = null;
        state.isAuthenticated = false;
        state.isAuthChecked = true;
        state.error = action.payload;
      })

      .addCase(logoutUser.pending, (state) => {
        state.status = AUTH_STATUS.LOADING;
        state.error = null;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.status = AUTH_STATUS.IDLE;
        state.user = null;
        state.isAuthenticated = false;
        state.isAuthChecked = true;
        state.error = null;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.status = AUTH_STATUS.FAILED;
        state.user = null;
        state.isAuthenticated = false;
        state.isAuthChecked = true;
        state.error = action.payload;
      })

      .addCase(changeCurrentUserPassword.pending, (state) => {
        state.passwordChangeStatus = AUTH_STATUS.LOADING;
        state.passwordChangeError = null;
      })
      .addCase(changeCurrentUserPassword.fulfilled, (state) => {
        state.passwordChangeStatus = AUTH_STATUS.SUCCEEDED;
        state.user = null;
        state.isAuthenticated = false;
        state.isAuthChecked = true;
        state.passwordChangeError = null;
      })
      .addCase(changeCurrentUserPassword.rejected, (state, action) => {
        state.passwordChangeStatus = AUTH_STATUS.FAILED;
        state.passwordChangeError = action.payload;
      });
  },
});

export const {
  clearAuthError,
  clearAuthState,
  resetPasswordChangeState,
  setCurrentUser,
} = authSlice.actions;

export default authSlice.reducer;
