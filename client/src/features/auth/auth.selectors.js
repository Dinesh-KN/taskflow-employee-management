export const selectAuthUser = (state) => state.auth.user;

export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;

export const selectIsAuthChecked = (state) => state.auth.isAuthChecked;

export const selectAuthStatus = (state) => state.auth.status;

export const selectAuthError = (state) => state.auth.error;

export const selectUserRole = (state) => state.auth.user?.role || null;

export const selectMustChangePassword = (state) =>
  Boolean(state.auth.user?.mustChangePassword);

export const selectPasswordChangeStatus = (state) =>
  state.auth.passwordChangeStatus;

export const selectPasswordChangeError = (state) =>
  state.auth.passwordChangeError;
