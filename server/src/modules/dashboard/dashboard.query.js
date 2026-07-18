import { User } from '../users/user.model.js';
import { Project } from '../projects/project.model.js';
import { Task } from '../tasks/task.model.js';

import {
  projectPopulateOptions,
  taskPopulateOptions,
} from './dashboard.utils.js';

export const countDocuments = async (Model, filter = {}) => {
  return Model.countDocuments(filter);
};

export const countByField = async (Model, field, filter = {}) => {
  return Model.aggregate([
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
  ]);
};

export const findProjectIds = async (filter = {}) => {
  return Project.find(filter).distinct('_id');
};

export const findRecentProjects = async ({ filter = {}, limit }) => {
  return Project.find(filter)
    .populate(projectPopulateOptions)
    .sort({
      createdAt: -1,
    })
    .limit(limit);
};

export const findRecentTasks = async ({ filter = {}, limit }) => {
  return Task.find(filter)
    .populate(taskPopulateOptions)
    .sort({
      createdAt: -1,
    })
    .limit(limit);
};

export const findOverdueTasks = async ({ filter = {}, limit }) => {
  return Task.find(filter)
    .populate(taskPopulateOptions)
    .sort({
      dueDate: 1,
    })
    .limit(limit);
};

export const findUpcomingTasks = async ({ filter = {}, limit }) => {
  return Task.find(filter)
    .populate(taskPopulateOptions)
    .sort({
      dueDate: 1,
    })
    .limit(limit);
};

export const getWorkloadByAssignee = async (taskFilter = {}) => {
  const workloadRows = await Task.aggregate([
    {
      $match: taskFilter,
    },
    {
      $group: {
        _id: '$assignedTo',

        total: {
          $sum: 1,
        },

        todo: {
          $sum: {
            $cond: [
              {
                $eq: ['$status', 'todo'],
              },
              1,
              0,
            ],
          },
        },

        inProgress: {
          $sum: {
            $cond: [
              {
                $eq: ['$status', 'in_progress'],
              },
              1,
              0,
            ],
          },
        },

        inReview: {
          $sum: {
            $cond: [
              {
                $eq: ['$status', 'in_review'],
              },
              1,
              0,
            ],
          },
        },

        completed: {
          $sum: {
            $cond: [
              {
                $eq: ['$status', 'completed'],
              },
              1,
              0,
            ],
          },
        },
      },
    },
    {
      $sort: {
        total: -1,
      },
    },
  ]);

  const assigneeIds = workloadRows.map((row) => row._id).filter(Boolean);

  const assignees = await User.find({
    _id: {
      $in: assigneeIds,
    },
  }).select('firstName lastName email role status avatarImage');

  const assigneeMap = new Map(
    assignees.map((assignee) => [
      assignee._id.toString(),
      {
        id: assignee._id.toString(),
        firstName: assignee.firstName,
        lastName: assignee.lastName,
        fullName: assignee.fullName,
        email: assignee.email,
        role: assignee.role,
        status: assignee.status,
        avatar: assignee.avatar,
      },
    ]),
  );

  return workloadRows.map((row) => {
    const assigneeId = row._id?.toString();

    return {
      assignee: assigneeId ? (assigneeMap.get(assigneeId) ?? null) : null,

      total: row.total,

      byStatus: {
        todo: row.todo,
        in_progress: row.inProgress,
        in_review: row.inReview,
        completed: row.completed,
      },
    };
  });
};
