import { createStatusTransitions } from '../../shared/utils/create-status-transitions.js';

export const TASK_STATUS = {
  TODO: 'todo',
  IN_PROGRESS: 'in_progress',
  IN_REVIEW: 'in_review',
  COMPLETED: 'completed',
  ARCHIVED: 'archived',
};

export const TASK_STATUS_VALUES = Object.values(TASK_STATUS);

export const TASK_PRIORITY = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  URGENT: 'urgent',
};

export const TASK_PRIORITY_VALUES = Object.values(TASK_PRIORITY);

export const TASK_STATUS_TRANSITIONS = createStatusTransitions({
  [TASK_STATUS.TODO]: [TASK_STATUS.IN_PROGRESS],
  [TASK_STATUS.IN_PROGRESS]: [TASK_STATUS.IN_REVIEW],
  [TASK_STATUS.IN_REVIEW]: [TASK_STATUS.IN_PROGRESS, TASK_STATUS.COMPLETED],
  [TASK_STATUS.COMPLETED]: [TASK_STATUS.IN_PROGRESS, TASK_STATUS.ARCHIVED],
  [TASK_STATUS.ARCHIVED]: [],
});

export const EMPLOYEE_TASK_STATUS_TRANSITIONS = createStatusTransitions({
  [TASK_STATUS.TODO]: [TASK_STATUS.IN_PROGRESS],
  [TASK_STATUS.IN_PROGRESS]: [TASK_STATUS.IN_REVIEW],
  [TASK_STATUS.IN_REVIEW]: [TASK_STATUS.IN_PROGRESS],
  [TASK_STATUS.COMPLETED]: [],
  [TASK_STATUS.ARCHIVED]: [],
});
