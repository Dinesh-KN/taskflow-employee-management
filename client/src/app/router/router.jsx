import { createBrowserRouter, Navigate } from 'react-router-dom';

import { ROUTES } from '@/constants/route.constants';
import RootLayout from '@/components/layout/RootLayout';
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
  {
    element: <RootLayout />,
    children: [
      {
        path: '/',
        element: <Navigate to={ROUTES.DASHBOARD} replace />,
      },
      {
        path: ROUTES.LOGIN,
        element: <LoginPage />,
      },
      {
        path: ROUTES.CHANGE_PASSWORD,
        element: <ChangePasswordPage />,
      },
      {
        path: ROUTES.DASHBOARD,
        element: <DashboardPage />,
      },
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
      {
        path: ROUTES.TASKS,
        element: <TasksPage />,
      },
      {
        path: ROUTES.TASK_DETAILS,
        element: <TaskDetailsPage />,
      },
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
      {
        path: ROUTES.PROFILE,
        element: <ProfilePage />,
      },
      {
        path: '*',
        element: <NotFoundPage />,
      },
    ],
  },
]);
