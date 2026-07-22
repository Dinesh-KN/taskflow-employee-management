import { createBrowserRouter, Navigate } from 'react-router-dom';

import ProtectedRoute from '@/app/router/protected-route';
import PublicRoute from '@/app/router/public-route';
import RoleRoute from '@/app/router/role-route';
import PublicLayout from '@/components/layout/PublicLayout';
import { ROUTES } from '@/constants/route.constants';
import { USER_ROLES } from '@/constants/role.constants';
import ChangePasswordPage from '@/pages/auth/ChangePasswordPage';
import LoginPage from '@/pages/auth/LoginPage';
import DashboardPage from '@/pages/dashboard/DashboardPage';
import NotFoundPage from '@/pages/NotFoundPage';
import ProfilePage from '@/pages/profile/ProfilePage';
import ProjectDetailsPage from '@/pages/projects/ProjectDetailsPage';
import ProjectTasksPage from '@/pages/projects/ProjectTasksPage';
import ProjectsPage from '@/pages/projects/ProjectsPage';
import TaskDetailsPage from '@/pages/tasks/TaskDetailsPage';
import TasksPage from '@/pages/tasks/TasksPage';
import ResetPasswordPage from '@/pages/users/ResetPasswordPage';
import UserDetailsPage from '@/pages/users/UserDetailsPage';
import UsersPage from '@/pages/users/UsersPage';

export const router = createBrowserRouter([
  /*
   * Public-only routes.
   *
   * Authenticated users cannot open these routes.
   */
  {
    element: <PublicRoute />,
    children: [
      {
        element: <PublicLayout />,
        children: [
          {
            path: ROUTES.LOGIN,
            element: <LoginPage />,
          },
        ],
      },
    ],
  },

  /*
   * Password-change route.
   *
   * The user must be authenticated, but users with
   * mustChangePassword=true must also be allowed through.
   */
  {
    element: <ProtectedRoute allowPasswordChange />,
    children: [
      {
        element: <PublicLayout />,
        children: [
          {
            path: ROUTES.CHANGE_PASSWORD,
            element: <ChangePasswordPage />,
          },
        ],
      },
    ],
  },

  /*
   * Normal authenticated routes.
   *
   * Unauthenticated users are redirected to /login.
   * Users required to change their password are redirected
   * to /change-password.
   */
  {
    element: <ProtectedRoute />,
    children: [
      {
        path: '/',
        element: <Navigate to={ROUTES.DASHBOARD} replace />,
      },

      {
        path: ROUTES.DASHBOARD,
        element: <DashboardPage />,
      },
      {
        path: ROUTES.PROFILE,
        element: <ProfilePage />,
      },

      /*
       * Projects are available to all authenticated roles.
       * The backend must filter accessible projects.
       */
      {
        path: ROUTES.PROJECTS,
        element: <ProjectsPage />,
      },
      {
        path: ROUTES.PROJECT_DETAILS,
        element: <ProjectDetailsPage />,
      },
      {
        path: ROUTES.PROJECT_TASKS,
        element: <ProjectTasksPage />,
      },

      /*
       * Tasks are available to all authenticated roles.
       * The backend must enforce task-level permissions.
       */
      {
        path: ROUTES.TASKS,
        element: <TasksPage />,
      },
      {
        path: ROUTES.TASK_DETAILS,
        element: <TaskDetailsPage />,
      },

      /*
       * User management is admin-only.
       */
      {
        element: <RoleRoute allowedRoles={[USER_ROLES.ADMIN]} />,
        children: [
          {
            path: ROUTES.USERS,
            element: <UsersPage />,
          },
          {
            path: ROUTES.USER_DETAILS,
            element: <UserDetailsPage />,
          },
          {
            path: ROUTES.RESET_PASSWORD,
            element: <ResetPasswordPage />,
          },
        ],
      },
    ],
  },

  {
    path: ROUTES.NOT_FOUND,
    element: <NotFoundPage />,
  },
]);
