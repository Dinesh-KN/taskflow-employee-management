export const ROUTES = {
  // Public
  LOGIN: '/login',

  // Authenticated user
  CHANGE_PASSWORD: '/change-password',
  DASHBOARD: '/dashboard',
  PROFILE: '/profile',

  // User management
  USERS: '/users',
  USER_DETAILS: '/users/:userId',
  RESET_PASSWORD: '/users/:userId/reset-password',

  // Projects
  PROJECTS: '/projects',
  PROJECT_DETAILS: '/projects/:projectId',
  PROJECT_TASKS: '/projects/:projectId/tasks',

  // Tasks
  TASKS: '/tasks',
  TASK_DETAILS: '/tasks/:taskId',

  // Fallback
  NOT_FOUND: '*',
};
