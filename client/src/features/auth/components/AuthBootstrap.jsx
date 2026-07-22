import { useEffect } from 'react';

import {
  hasSessionHint,
  registerUnauthorizedHandler,
} from '@/api/axios-instance';
import LoadingScreen from '@/components/common/LoadingScreen';
import { useAppDispatch, useAppSelector } from '@/hooks/use-redux';

import { selectIsAuthChecked } from '../auth.selectors';
import { clearAuthState } from '../auth.slice';
import { restoreSession } from '../auth.thunks';

const AuthBootstrap = ({ children }) => {
  const dispatch = useAppDispatch();
  const isAuthChecked = useAppSelector(selectIsAuthChecked);

  /*
   * When Axios determines that refresh has failed, immediately
   * clear the Redux authentication state. ProtectedRoute will
   * then redirect the user to /login.
   */
  useEffect(() => {
    return registerUnauthorizedHandler(() => {
      dispatch(clearAuthState());
    });
  }, [dispatch]);

  useEffect(() => {
    if (isAuthChecked) {
      return;
    }

    /*
     * No successful previous login is known, so do not call
     * /auth/refresh or /auth/me.
     */
    if (!hasSessionHint()) {
      dispatch(clearAuthState());
      return;
    }

    /*
     * A previous browser session may exist:
     * 1. Refresh the access token.
     * 2. Fetch the current authenticated user.
     */
    dispatch(restoreSession());
  }, [dispatch, isAuthChecked]);

  if (!isAuthChecked) {
    return <LoadingScreen />;
  }

  return children;
};

export default AuthBootstrap;
