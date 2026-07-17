import { PROJECT_STATUS } from '../projects/project.constants.js';
import { TASK_STATUS } from '../tasks/task.constants.js';

import { ACTIVE_TASK_EXCLUDED_STATUSES } from './dashboard.constants.js';

export const createActiveProjectFilter = (baseFilter = {}) => {
  return {
    ...baseFilter,

    status: {
      $ne: PROJECT_STATUS.ARCHIVED,
    },
  };
};

export const createActiveTaskFilter = (baseFilter = {}) => {
  return {
    ...baseFilter,

    status: {
      $ne: TASK_STATUS.ARCHIVED,
    },
  };
};

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
  return createActiveProjectFilter({
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
  });
};

export const createEmployeeProjectFilter = (employeeId) => {
  return createActiveProjectFilter({
    members: employeeId,
  });
};

export const createProjectTaskFilter = (projectIds = []) => {
  return {
    project: {
      $in: projectIds,
    },
  };
};
