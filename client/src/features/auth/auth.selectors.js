import { AUTH_STATUS } from './auth.constants';

// Base auth selectors
export const selectAuthUser = (state) => state.auth.user;

export const selectAuthStatus = (state) => state.auth.status;

export const selectAuthError = (state) => state.auth.error;

export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;

export const selectIsAuthChecked = (state) => state.auth.isAuthChecked;

// Derived auth selectors
export const selectIsAuthLoading = (state) =>
  state.auth.status === AUTH_STATUS.LOADING;

export const selectUserRole = (state) => state.auth.user?.role ?? null;

export const selectMustChangePassword = (state) =>
  Boolean(state.auth.user?.mustChangePassword);

// Password-change selectors
export const selectPasswordChangeStatus = (state) =>
  state.auth.passwordChangeStatus;

export const selectPasswordChangeError = (state) =>
  state.auth.passwordChangeError;
