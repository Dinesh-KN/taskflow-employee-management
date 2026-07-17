import { TASK_STATUS } from '../tasks/task.constants.js';

export const ACTIVE_TASK_EXCLUDED_STATUSES = [
  TASK_STATUS.COMPLETED,
  TASK_STATUS.ARCHIVED,
];

export const taskPopulateOptions = [
  {
    path: 'project',
    select: 'name status priority startDate dueDate',
  },
  {
    path: 'assignedTo',
    select: 'firstName lastName email role status',
  },
  {
    path: 'createdBy',
    select: 'firstName lastName email role status',
  },
];

export const projectPopulateOptions = [
  {
    path: 'createdBy',
    select: 'firstName lastName email role status',
  },
  {
    path: 'members',
    select: 'firstName lastName email role status',
  },
];

export const toCountMap = (rows) => {
  return rows.reduce((acc, row) => {
    const key = row._id || 'unknown';

    acc[key] = row.count;

    return acc;
  }, {});
};
