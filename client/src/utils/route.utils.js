import { matchPath } from 'react-router-dom';

import { ROUTES } from '@/constants/route.constants';

const ROUTE_TITLES = [
  {
    path: ROUTES.DASHBOARD,
    title: 'Dashboard',
    description: 'Overview of your workspace activity.',
  },
  {
    path: ROUTES.USERS,
    title: 'Users',
    description: 'Manage organization users and roles.',
  },
  {
    path: ROUTES.USER_DETAILS,
    title: 'User Details',
    description: 'View and manage user information.',
  },
  {
    path: ROUTES.RESET_PASSWORD,
    title: 'Reset Password',
    description: 'Generate a temporary password for a user.',
  },
  {
    path: ROUTES.PROJECTS,
    title: 'Projects',
    description: 'Track projects, members, priorities, and progress.',
  },
  {
    path: ROUTES.PROJECT_DETAILS,
    title: 'Project Details',
    description: 'View project information and related activity.',
  },
  {
    path: ROUTES.PROJECT_TASKS,
    title: 'Project Tasks',
    description: 'View tasks linked to this project.',
  },
  {
    path: ROUTES.TASKS,
    title: 'Tasks',
    description: 'Manage assigned and project-based tasks.',
  },
  {
    path: ROUTES.TASK_DETAILS,
    title: 'Task Details',
    description: 'View and update task information.',
  },
  {
    path: ROUTES.PROFILE,
    title: 'Profile',
    description: 'Manage your account and profile settings.',
  },
];

export const getRouteMeta = (pathname) => {
  const matchedRoute = ROUTE_TITLES.find((route) =>
    matchPath(
      {
        path: route.path,
        end: true,
      },
      pathname,
    ),
  );

  return (
    matchedRoute || {
      title: 'TaskFlow',
      description: 'Manage projects, tasks, and team productivity.',
    }
  );
};
