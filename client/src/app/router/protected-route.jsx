import { Navigate, Outlet, useLocation } from 'react-router-dom';

import LoadingScreen from '@/components/common/LoadingScreen';
import { ROUTES } from '@/constants/route.constants';
import {
  selectIsAuthenticated,
  selectIsAuthChecked,
  selectMustChangePassword,
} from '@/features/auth/auth.selectors';
import { useAppSelector } from '@/hooks/use-redux';

const ProtectedRoute = ({ allowPasswordChange = false }) => {
  const location = useLocation();

  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const isAuthChecked = useAppSelector(selectIsAuthChecked);
  const mustChangePassword = useAppSelector(selectMustChangePassword);

  /*
   * Wait until AuthBootstrap has restored or rejected
   * the previous browser session.
   */
  if (!isAuthChecked) {
    return <LoadingScreen />;
  }

  /*
   * Preserve the requested location so the user can
   * return there after signing in.
   */
  if (!isAuthenticated) {
    return (
      <Navigate
        to={ROUTES.LOGIN}
        replace
        state={{
          from: location,
        }}
      />
    );
  }

  /*
   * A user with a temporary password cannot access the
   * rest of the application until the password is changed.
   */
  if (mustChangePassword && !allowPasswordChange) {
    return <Navigate to={ROUTES.CHANGE_PASSWORD} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
