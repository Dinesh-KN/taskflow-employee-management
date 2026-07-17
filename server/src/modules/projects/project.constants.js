import { createStatusTransitions } from '../../shared/utils/create-status-transitions.js';

export const PROJECT_STATUS = {
  PLANNING: 'planning',
  ACTIVE: 'active',
  ON_HOLD: 'on_hold',
  COMPLETED: 'completed',
  ARCHIVED: 'archived',
};

export const PROJECT_STATUS_VALUES = Object.values(PROJECT_STATUS);

export const PROJECT_PRIORITY = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  URGENT: 'urgent',
};

export const PROJECT_PRIORITY_VALUES = Object.values(PROJECT_PRIORITY);

export const PROJECT_STATUS_TRANSITIONS = createStatusTransitions({
  [PROJECT_STATUS.PLANNING]: [PROJECT_STATUS.ACTIVE, PROJECT_STATUS.ARCHIVED],

  [PROJECT_STATUS.ACTIVE]: [
    PROJECT_STATUS.ON_HOLD,
    PROJECT_STATUS.COMPLETED,
    PROJECT_STATUS.ARCHIVED,
  ],

  [PROJECT_STATUS.ON_HOLD]: [PROJECT_STATUS.ACTIVE, PROJECT_STATUS.ARCHIVED],

  [PROJECT_STATUS.COMPLETED]: [PROJECT_STATUS.ACTIVE, PROJECT_STATUS.ARCHIVED],

  [PROJECT_STATUS.ARCHIVED]: [PROJECT_STATUS.ACTIVE],
});
