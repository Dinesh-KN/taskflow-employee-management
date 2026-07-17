import { Project } from '../projects/project.model.js';
import { Task } from '../tasks/task.model.js';
import { User } from '../users/user.model.js';

import {
  DASHBOARD_DEFAULTS,
  DASHBOARD_TASK_STATUS_KEYS,
} from './dashboard.constants.js';

import {
  countByField,
  countDocuments,
  findOverdueTasks,
  findProjectIds,
  findRecentProjects,
  findRecentTasks,
  findUpcomingTasks,
  getWorkloadByAssignee,
} from './dashboard.query.js';

import { createStatusCountMap, toCountMap } from './dashboard.utils.js';

import {
  createActiveProjectFilter,
  createActiveTaskFilter,
  createEmployeeProjectFilter,
  createOverdueTaskFilter,
  createUpcomingTaskFilter,
  createManagerProjectFilter,
  createProjectTaskFilter,
} from './dashboard.service.helpers.js';

export const buildAdminDashboard = async ({
  recentLimit = DASHBOARD_DEFAULTS.RECENT_LIMIT,
} = {}) => {
  const now = new Date();

  const activeProjectFilter = createActiveProjectFilter();

  const activeProjectIds = await findProjectIds(activeProjectFilter);

  const projectTaskFilter = createProjectTaskFilter(activeProjectIds);

  const activeProjectTaskFilter = createActiveTaskFilter(projectTaskFilter);

  const overdueTaskFilter = createOverdueTaskFilter({
    baseFilter: projectTaskFilter,
    now,
  });

  const [
    totalUsers,
    usersByRoleRows,
    usersByStatusRows,

    totalProjects,
    projectsByStatusRows,

    totalTasks,
    tasksByStatusRows,

    overdueTaskTotal,

    recentProjects,
    recentTasks,
  ] = await Promise.all([
    countDocuments(User),

    countByField(User, 'role'),

    countByField(User, 'status'),

    countDocuments(Project, activeProjectFilter),

    countByField(Project, 'status', activeProjectFilter),

    countDocuments(Task, activeProjectTaskFilter),

    countByField(Task, 'status', activeProjectTaskFilter),

    countDocuments(Task, overdueTaskFilter),

    findRecentProjects({
      filter: activeProjectFilter,
      limit: recentLimit,
    }),

    findRecentTasks({
      filter: activeProjectTaskFilter,
      limit: recentLimit,
    }),
  ]);

  return {
    userSummary: {
      total: totalUsers,
      byRole: toCountMap(usersByRoleRows),
      byStatus: toCountMap(usersByStatusRows),
    },

    projectSummary: {
      total: totalProjects,
      byStatus: toCountMap(projectsByStatusRows),
    },

    taskSummary: {
      total: totalTasks,

      byStatus: createStatusCountMap(
        tasksByStatusRows,
        DASHBOARD_TASK_STATUS_KEYS,
      ),

      overdue: overdueTaskTotal,
    },

    recentProjects: {
      limit: recentLimit,
      items: recentProjects,
    },

    recentTasks: {
      limit: recentLimit,
      items: recentTasks,
    },
  };
};

export const buildManagerDashboard = async (
  currentUser,
  {
    upcomingDays = DASHBOARD_DEFAULTS.UPCOMING_DAYS,
    limit = DASHBOARD_DEFAULTS.LIST_LIMIT,
  } = {},
) => {
  const now = new Date();

  const managerProjectFilter = createManagerProjectFilter(currentUser._id);

  const projectIds = await findProjectIds(managerProjectFilter);

  const projectTaskFilter = createProjectTaskFilter(projectIds);

  const activeProjectTaskFilter = createActiveTaskFilter(projectTaskFilter);

  const overdueTaskFilter = createOverdueTaskFilter({
    baseFilter: projectTaskFilter,
    now,
  });

  const upcomingTaskFilter = createUpcomingTaskFilter({
    baseFilter: projectTaskFilter,
    now,
    upcomingDays,
  });

  const [
    totalProjects,
    projectsByStatusRows,

    totalTasks,
    tasksByStatusRows,

    overdueTaskTotal,
    overdueTasks,

    upcomingTaskTotal,
    upcomingTasks,

    recentProjects,
    recentTasks,

    workloadByAssignee,
  ] = await Promise.all([
    countDocuments(Project, managerProjectFilter),

    countByField(Project, 'status', managerProjectFilter),

    countDocuments(Task, activeProjectTaskFilter),

    countByField(Task, 'status', activeProjectTaskFilter),

    countDocuments(Task, overdueTaskFilter),

    findOverdueTasks({
      filter: overdueTaskFilter,
      limit,
    }),

    countDocuments(Task, upcomingTaskFilter),

    findUpcomingTasks({
      filter: upcomingTaskFilter,
      limit,
    }),

    findRecentProjects({
      filter: managerProjectFilter,
      limit,
    }),

    findRecentTasks({
      filter: activeProjectTaskFilter,
      limit,
    }),

    getWorkloadByAssignee(activeProjectTaskFilter),
  ]);

  return {
    projectSummary: {
      total: totalProjects,
      byStatus: toCountMap(projectsByStatusRows),
    },

    taskSummary: {
      total: totalTasks,

      byStatus: createStatusCountMap(
        tasksByStatusRows,
        DASHBOARD_TASK_STATUS_KEYS,
      ),

      overdue: overdueTaskTotal,
    },

    overdueTasks: {
      total: overdueTaskTotal,
      items: overdueTasks,
    },

    upcomingTasks: {
      total: upcomingTaskTotal,
      windowDays: upcomingDays,
      items: upcomingTasks,
    },

    recentProjects: {
      limit,
      items: recentProjects,
    },

    recentTasks: {
      limit,
      items: recentTasks,
    },

    workloadByAssignee,
  };
};

export const buildEmployeeDashboard = async (
  currentUser,
  {
    upcomingDays = DASHBOARD_DEFAULTS.UPCOMING_DAYS,
    limit = DASHBOARD_DEFAULTS.LIST_LIMIT,
  } = {},
) => {
  const now = new Date();

  const employeeProjectFilter = createEmployeeProjectFilter(currentUser._id);

  const employeeProjectIds = await findProjectIds(employeeProjectFilter);

  const projectTaskFilter = createProjectTaskFilter(employeeProjectIds);

  const assignedTaskFilter = createActiveTaskFilter({
    ...projectTaskFilter,
    assignedTo: currentUser._id,
  });

  const overdueTaskFilter = createOverdueTaskFilter({
    baseFilter: assignedTaskFilter,
    now,
  });

  const upcomingTaskFilter = createUpcomingTaskFilter({
    baseFilter: assignedTaskFilter,
    now,
    upcomingDays,
  });

  const [
    assignedTaskTotal,
    tasksByStatusRows,

    assignedTasks,

    overdueTaskTotal,
    overdueTasks,

    upcomingTaskTotal,
    upcomingTasks,
  ] = await Promise.all([
    countDocuments(Task, assignedTaskFilter),

    countByField(Task, 'status', assignedTaskFilter),

    findRecentTasks({
      filter: assignedTaskFilter,
      limit,
    }),

    countDocuments(Task, overdueTaskFilter),

    findOverdueTasks({
      filter: overdueTaskFilter,
      limit,
    }),

    countDocuments(Task, upcomingTaskFilter),

    findUpcomingTasks({
      filter: upcomingTaskFilter,
      limit,
    }),
  ]);

  return {
    taskSummary: {
      total: assignedTaskTotal,

      byStatus: createStatusCountMap(
        tasksByStatusRows,
        DASHBOARD_TASK_STATUS_KEYS,
      ),

      overdue: overdueTaskTotal,
    },

    assignedTasks: {
      total: assignedTaskTotal,
      limit,
      items: assignedTasks,
    },

    overdueTasks: {
      total: overdueTaskTotal,
      items: overdueTasks,
    },

    upcomingTasks: {
      total: upcomingTaskTotal,
      windowDays: upcomingDays,
      items: upcomingTasks,
    },
  };
};
