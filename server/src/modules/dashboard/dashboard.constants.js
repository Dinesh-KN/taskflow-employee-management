export const DASHBOARD_TYPE = {
  ADMIN: 'admin',
  MANAGER: 'manager',
  EMPLOYEE: 'employee',
};

export const DASHBOARD_DEFAULTS = {
  RECENT_LIMIT: 5,
  UPCOMING_DAYS: 7,
  LIST_LIMIT: 5,
};

export const DASHBOARD_LIMITS = {
  MIN_LIMIT: 1,
  MAX_RECENT_LIMIT: 20,
  MAX_LIST_LIMIT: 20,
  MIN_UPCOMING_DAYS: 1,
  MAX_UPCOMING_DAYS: 30,
};

export const ADMIN_DASHBOARD_FEATURES = {
  TOTAL_USERS_BY_ROLE_STATUS: 'totalUsersByRoleStatus',
  TOTAL_PROJECTS_BY_STATUS: 'totalProjectsByStatus',
  TOTAL_TASKS_BY_STATUS: 'totalTasksByStatus',
  OVERDUE_TASKS: 'overdueTasks',
  RECENTLY_CREATED_PROJECTS: 'recentlyCreatedProjects',
  RECENTLY_CREATED_TASKS: 'recentlyCreatedTasks',
};

export const MANAGER_DASHBOARD_FEATURES = {
  MANAGED_PROJECTS: 'managedProjects',
  PROJECT_TASK_COUNTS: 'projectTaskCounts',
  OVERDUE_TASKS: 'overdueTasks',
  UPCOMING_TASKS: 'upcomingTasks',
  WORKLOAD_BY_ASSIGNEE: 'workloadByAssignee',
};

export const EMPLOYEE_DASHBOARD_FEATURES = {
  ASSIGNED_TASKS: 'assignedTasks',
  TODO_TASKS_COUNT: 'todoTasksCount',
  IN_PROGRESS_TASKS_COUNT: 'inProgressTasksCount',
  COMPLETED_TASKS_COUNT: 'completedTasksCount',
  OVERDUE_TASKS: 'overdueTasks',
  UPCOMING_TASKS: 'upcomingTasks',
};
