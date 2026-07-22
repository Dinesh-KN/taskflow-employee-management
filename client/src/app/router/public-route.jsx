import { Navigate, Outlet } from 'react-router-dom';

import LoadingScreen from '@/components/common/LoadingScreen';
import { ROUTES } from '@/constants/route.constants';
import {
  selectIsAuthenticated,
  selectIsAuthChecked,
  selectMustChangePassword,
} from '@/features/auth/auth.selectors';
import { useAppSelector } from '@/hooks/use-redux';

const PublicRoute = () => {
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const isAuthChecked = useAppSelector(selectIsAuthChecked);
  const mustChangePassword = useAppSelector(selectMustChangePassword);

  /*
   * Do not decide whether /login is available until
   * session restoration has completed.
   */
  if (!isAuthChecked) {
    return <LoadingScreen />;
  }

  if (!isAuthenticated) {
    return <Outlet />;
  }

  if (mustChangePassword) {
    return <Navigate to={ROUTES.CHANGE_PASSWORD} replace />;
  }

  return <Navigate to={ROUTES.DASHBOARD} replace />;
};

export default PublicRoute;
