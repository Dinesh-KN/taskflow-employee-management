import { User } from '../users/user.model.js';
import { Project } from '../projects/project.model.js';
import { Task } from '../tasks/task.model.js';

import { TASK_STATUS } from '../tasks/task.constants.js';

import {
  countByField,
  getOverdueTaskFilter,
  getUpcomingTaskFilter,
  getManagerProjectFilter,
  getManagerProjectIds,
  getWorkloadByAssignee,
} from './dashboard.query.js';
import {
  projectPopulateOptions,
  taskPopulateOptions,
} from './dashboard.utils.js';

export const getAdminDashboard = async ({ recentLimit }) => {
  const overdueTaskFilter = getOverdueTaskFilter();

  const [
    totalUsers,
    usersByRole,
    usersByStatus,
    totalProjects,
    projectsByStatus,
    totalTasks,
    tasksByStatus,
    overdueTasksCount,
    overdueTasks,
    recentlyCreatedProjects,
    recentlyCreatedTasks,
  ] = await Promise.all([
    User.countDocuments(),
    countByField(User, 'role'),
    countByField(User, 'status'),

    Project.countDocuments(),
    countByField(Project, 'status'),

    Task.countDocuments(),
    countByField(Task, 'status'),

    Task.countDocuments(overdueTaskFilter),

    Task.find(overdueTaskFilter)
      .populate(taskPopulateOptions)
      .sort({
        dueDate: 1,
      })
      .limit(recentLimit),

    Project.find()
      .populate(projectPopulateOptions)
      .sort({
        createdAt: -1,
      })
      .limit(recentLimit),

    Task.find()
      .populate(taskPopulateOptions)
      .sort({
        createdAt: -1,
      })
      .limit(recentLimit),
  ]);

  return {
    summary: {
      users: {
        total: totalUsers,
        byRole: usersByRole,
        byStatus: usersByStatus,
      },
      projects: {
        total: totalProjects,
        byStatus: projectsByStatus,
      },
      tasks: {
        total: totalTasks,
        byStatus: tasksByStatus,
        overdue: overdueTasksCount,
      },
    },
    overdueTasks,
    recentlyCreatedProjects,
    recentlyCreatedTasks,
  };
};

export const getManagerDashboard = async ({
  currentUser,
  upcomingDays,
  limit,
}) => {
  const projectFilter = getManagerProjectFilter(currentUser);
  const projectIds = await getManagerProjectIds(currentUser);

  const taskProjectFilter = {
    project: {
      $in: projectIds,
    },
  };

  const overdueTaskFilter = getOverdueTaskFilter(taskProjectFilter);

  const upcomingTaskFilter = getUpcomingTaskFilter({
    upcomingDays,
    extraFilter: taskProjectFilter,
  });

  const [
    projects,
    projectsByStatus,
    totalTasks,
    tasksByStatus,
    overdueTasksCount,
    overdueTasks,
    upcomingTasks,
    workloadByAssignee,
  ] = await Promise.all([
    Project.find(projectFilter).populate(projectPopulateOptions).sort({
      createdAt: -1,
    }),

    countByField(Project, 'status', projectFilter),

    Task.countDocuments(taskProjectFilter),

    countByField(Task, 'status', taskProjectFilter),

    Task.countDocuments(overdueTaskFilter),

    Task.find(overdueTaskFilter)
      .populate(taskPopulateOptions)
      .sort({
        dueDate: 1,
      })
      .limit(limit),

    Task.find(upcomingTaskFilter)
      .populate(taskPopulateOptions)
      .sort({
        dueDate: 1,
      })
      .limit(limit),

    getWorkloadByAssignee(projectIds),
  ]);

  return {
    summary: {
      projects: {
        total: projects.length,
        byStatus: projectsByStatus,
      },
      tasks: {
        total: totalTasks,
        byStatus: tasksByStatus,
        overdue: overdueTasksCount,
      },
    },
    projects,
    overdueTasks,
    upcomingTasks,
    workloadByAssignee,
  };
};

export const getEmployeeDashboard = async ({
  currentUser,
  upcomingDays,
  limit,
}) => {
  const assignedTaskFilter = {
    assignedTo: currentUser._id,
  };

  const activeAssignedTaskFilter = {
    ...assignedTaskFilter,
    status: {
      $ne: TASK_STATUS.ARCHIVED,
    },
  };

  const overdueTaskFilter = getOverdueTaskFilter(assignedTaskFilter);

  const upcomingTaskFilter = getUpcomingTaskFilter({
    upcomingDays,
    extraFilter: assignedTaskFilter,
  });

  const [
    totalAssignedTasks,
    tasksByStatus,
    assignedTasks,
    overdueTasksCount,
    overdueTasks,
    upcomingTasks,
  ] = await Promise.all([
    Task.countDocuments(activeAssignedTaskFilter),

    countByField(Task, 'status', assignedTaskFilter),

    Task.find(activeAssignedTaskFilter)
      .populate(taskPopulateOptions)
      .sort({
        dueDate: 1,
        createdAt: -1,
      })
      .limit(limit),

    Task.countDocuments(overdueTaskFilter),

    Task.find(overdueTaskFilter)
      .populate(taskPopulateOptions)
      .sort({
        dueDate: 1,
      })
      .limit(limit),

    Task.find(upcomingTaskFilter)
      .populate(taskPopulateOptions)
      .sort({
        dueDate: 1,
      })
      .limit(limit),
  ]);

  return {
    summary: {
      assignedTasks: {
        total: totalAssignedTasks,
        byStatus: tasksByStatus,
        todo: tasksByStatus[TASK_STATUS.TODO] || 0,
        inProgress: tasksByStatus[TASK_STATUS.IN_PROGRESS] || 0,
        inReview: tasksByStatus[TASK_STATUS.IN_REVIEW] || 0,
        completed: tasksByStatus[TASK_STATUS.COMPLETED] || 0,
        overdue: overdueTasksCount,
      },
    },
    assignedTasks,
    overdueTasks,
    upcomingTasks,
  };
};
