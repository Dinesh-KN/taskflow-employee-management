import { createSlice } from '@reduxjs/toolkit';

import { AUTH_SLICE_NAME, AUTH_STATUS } from './auth.constants';
import {
  changeCurrentUserPassword,
  fetchCurrentUser,
  loginUser,
  logoutUser,
  restoreSession,
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
      /*
       * Login
       */
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

      /*
       * Session restoration
       */
      .addCase(restoreSession.pending, (state) => {
        state.status = AUTH_STATUS.LOADING;
        state.error = null;
      })
      .addCase(restoreSession.fulfilled, (state, action) => {
        state.status = AUTH_STATUS.SUCCEEDED;
        state.user = action.payload.user;
        state.isAuthenticated = true;
        state.isAuthChecked = true;
        state.error = null;
      })
      .addCase(restoreSession.rejected, (state) => {
        /*
         * A missing or expired browser session is an expected startup state.
         * Do not expose it as a login-form error.
         */
        state.status = AUTH_STATUS.IDLE;
        state.user = null;
        state.isAuthenticated = false;
        state.isAuthChecked = true;
        state.error = null;
      })

      /*
       * Current user
       */
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

      /*
       * Logout
       */
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
        /*
         * Local credentials are cleared in the thunk even when the server
         * logout request fails.
         */
        state.status = AUTH_STATUS.FAILED;
        state.user = null;
        state.isAuthenticated = false;
        state.isAuthChecked = true;
        state.error = action.payload;
      })

      /*
       * Password change
       */
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
