import { Navigate, Outlet } from 'react-router-dom';

import LoadingScreen from '@/components/common/LoadingScreen';
import { ROUTES } from '@/constants/route.constants';
import {
  selectIsAuthenticated,
  selectIsAuthChecked,
  selectUserRole,
} from '@/features/auth/auth.selectors';
import { useAppSelector } from '@/hooks/use-redux';

const RoleRoute = ({ allowedRoles = [] }) => {
  const isAuthChecked = useAppSelector(selectIsAuthChecked);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const userRole = useAppSelector(selectUserRole);

  if (!isAuthChecked) {
    return <LoadingScreen />;
  }

  /*
   * This makes the component safe even if it is accidentally
   * used outside ProtectedRoute in the future.
   */
  if (!isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  if (!allowedRoles.includes(userRole)) {
    return <Navigate to={ROUTES.DASHBOARD} replace />;
  }

  return <Outlet />;
};

export default RoleRoute;
