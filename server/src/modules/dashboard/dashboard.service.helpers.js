import { ACTIVE_TASK_EXCLUDED_STATUSES } from './dashboard.constants.js';

export const createOverdueTaskFilter = ({
  baseFilter = {},
  now = new Date(),
} = {}) => {
  return {
    ...baseFilter,

    dueDate: {
      $lt: now,
    },

    status: {
      $nin: ACTIVE_TASK_EXCLUDED_STATUSES,
    },
  };
};

export const createUpcomingTaskFilter = ({
  baseFilter = {},
  now = new Date(),
  upcomingDays,
} = {}) => {
  const windowEnd = new Date(now);

  windowEnd.setDate(windowEnd.getDate() + upcomingDays);

  return {
    ...baseFilter,

    dueDate: {
      $gte: now,
      $lte: windowEnd,
    },

    status: {
      $nin: ACTIVE_TASK_EXCLUDED_STATUSES,
    },
  };
};

export const createManagerProjectFilter = (managerId) => {
  return {
    $or: [
      {
        createdBy: managerId,
      },
      {
        projectLead: managerId,
      },
      {
        members: managerId,
      },
    ],
  };
};

export const createProjectTaskFilter = (projectIds = []) => {
  return {
    project: {
      $in: projectIds,
    },
  };
};
