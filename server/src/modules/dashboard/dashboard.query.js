import { User } from '../users/user.model.js';
import { Project } from '../projects/project.model.js';

import { TASK_STATUS } from '../tasks/task.constants.js';
import { Task } from '../tasks/task.model.js';

import {
  ACTIVE_TASK_EXCLUDED_STATUSES,
  toCountMap,
} from './dashboard.utils.js';

export const countByField = async (Model, field, filter = {}) => {
  const rows = await Model.aggregate([
    {
      $match: filter,
    },
    {
      $group: {
        _id: `$${field}`,
        count: {
          $sum: 1,
        },
      },
    },
    {
      $sort: {
        _id: 1,
      },
    },
  ]);

  return toCountMap(rows);
};

export const getOverdueTaskFilter = (extraFilter = {}) => {
  return {
    ...extraFilter,
    dueDate: {
      $lt: new Date(),
    },
    status: {
      $nin: ACTIVE_TASK_EXCLUDED_STATUSES,
    },
  };
};

export const getUpcomingTaskFilter = ({ upcomingDays, extraFilter = {} }) => {
  const now = new Date();
  const upcomingUntil = new Date(now);

  upcomingUntil.setDate(upcomingUntil.getDate() + upcomingDays);

  return {
    ...extraFilter,
    dueDate: {
      $gte: now,
      $lte: upcomingUntil,
    },
    status: {
      $nin: ACTIVE_TASK_EXCLUDED_STATUSES,
    },
  };
};

export const getManagerProjectFilter = (currentUser) => {
  const conditions = [
    { createdBy: currentUser._id },
    { members: currentUser._id },
  ];

  if (Project.schema.path('projectLead')) {
    conditions.push({ projectLead: currentUser._id });
  }

  return {
    $or: conditions,
  };
};

export const getManagerProjectIds = async (currentUser) => {
  const projects = await Project.find(
    getManagerProjectFilter(currentUser),
  ).select('_id');

  return projects.map((project) => project._id);
};

export const getWorkloadByAssignee = async (projectIds) => {
  const workloadRows = await Task.aggregate([
    {
      $match: {
        project: {
          $in: projectIds,
        },
        status: {
          $ne: TASK_STATUS.ARCHIVED,
        },
      },
    },
    {
      $group: {
        _id: '$assignedTo',
        totalTasks: {
          $sum: 1,
        },
        todo: {
          $sum: {
            $cond: [{ $eq: ['$status', TASK_STATUS.TODO] }, 1, 0],
          },
        },
        inProgress: {
          $sum: {
            $cond: [{ $eq: ['$status', TASK_STATUS.IN_PROGRESS] }, 1, 0],
          },
        },
        inReview: {
          $sum: {
            $cond: [{ $eq: ['$status', TASK_STATUS.IN_REVIEW] }, 1, 0],
          },
        },
        completed: {
          $sum: {
            $cond: [{ $eq: ['$status', TASK_STATUS.COMPLETED] }, 1, 0],
          },
        },
      },
    },
    {
      $sort: {
        totalTasks: -1,
      },
    },
  ]);

  const assigneeIds = workloadRows.map((row) => row._id).filter(Boolean);

  const users = await User.find({
    _id: {
      $in: assigneeIds,
    },
  }).select('firstName lastName email role status');

  const userMap = users.reduce((acc, user) => {
    acc[user._id.toString()] = user;

    return acc;
  }, {});

  return workloadRows.map((row) => {
    const assigneeId = row._id?.toString();

    return {
      assignee: userMap[assigneeId] || {
        id: assigneeId,
      },
      totalTasks: row.totalTasks,
      todo: row.todo,
      inProgress: row.inProgress,
      inReview: row.inReview,
      completed: row.completed,
    };
  });
};
