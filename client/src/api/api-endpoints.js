export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REFRESH: '/auth/refresh',
    LOGOUT: '/auth/logout',
    ME: '/auth/me',
    CHANGE_PASSWORD: '/auth/change-password',
    RESET_PASSWORD: (userId) => `/auth/reset-password/${userId}`,
  },

  USERS: {
    ROOT: '/users',
    BY_ID: (userId) => `/users/${userId}`,
    EMAIL: (userId) => `/users/${userId}/email`,
    ROLE: (userId) => `/users/${userId}/role`,
    STATUS: (userId) => `/users/${userId}/status`,
    AVATAR: '/users/me/avatar',
  },

  PROJECTS: {
    ROOT: '/projects',
    BY_ID: (projectId) => `/projects/${projectId}`,
    STATUS: (projectId) => `/projects/${projectId}/status`,
    LEAD: (projectId) => `/projects/${projectId}/lead`,
    MEMBERS: (projectId) => `/projects/${projectId}/members`,
    TASKS_BY_PROJECT: (projectId) => `/projects/${projectId}/tasks`,
  },

  TASKS: {
    ROOT: '/tasks',
    BY_ID: (taskId) => `/tasks/${taskId}`,
    STATUS: (taskId) => `/tasks/${taskId}/status`,
    ASSIGNEE: (taskId) => `/tasks/${taskId}/assignee`,
  },

  DASHBOARD: {
    ADMIN: '/dashboard/admin',
    MANAGER: '/dashboard/manager',
    EMPLOYEE: '/dashboard/employee',
  },
};
