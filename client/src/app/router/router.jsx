import { createBrowserRouter, Navigate } from 'react-router-dom';

import ProtectedRoute from '@/app/router/protected-route';
import PublicRoute from '@/app/router/public-route';
import RoleRoute from '@/app/router/role-route';
import AppLayout from '@/components/layout/AppLayout';
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
   * Authenticated users should not be able to open these routes.
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
   * Mandatory password-change route.
   *
   * The user must be authenticated.
   *
   * allowPasswordChange allows users with
   * mustChangePassword=true to access this route.
   *
   * This route intentionally stays outside AppLayout so the
   * application sidebar and protected navigation are not shown.
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
   * Normal authenticated application routes.
   *
   * ProtectedRoute handles authentication and password-change
   * enforcement.
   *
   * AppLayout provides the authenticated application shell,
   * such as the sidebar, header, and page content container.
   */
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <AppLayout />,
        children: [
          /*
           * Redirect the root URL to the dashboard.
           */
          {
            path: '/',
            element: <Navigate to={ROUTES.DASHBOARD} replace />,
          },

          /*
           * Available to every authenticated role.
           */
          {
            path: ROUTES.DASHBOARD,
            element: <DashboardPage />,
          },
          {
            path: ROUTES.PROFILE,
            element: <ProfilePage />,
          },

          /*
           * Project routes.
           *
           * The backend must still enforce project-level
           * authorization and membership rules.
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
           * Task routes.
           *
           * The backend must still enforce assignment,
           * project membership, and role permissions.
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
           * Admin-only routes.
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
    ],
  },

  /*
   * Global fallback route.
   */
  {
    path: ROUTES.NOT_FOUND,
    element: <NotFoundPage />,
  },
]);
