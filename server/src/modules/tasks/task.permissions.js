import {
  isAdmin,
  isManager,
  isEmployee,
  isProjectMember,
} from '../../shared/permissions/role.permissions.js';
import {
  EMPLOYEE_TASK_STATUS_TRANSITIONS,
  TASK_STATUS_TRANSITIONS,
} from './task.constants.js';
import { isSameId } from '../../shared/utils/id.utils.js';

export { isAdmin, isManager, isEmployee, isProjectMember };

export const canManageProjectTasks = (project, user) => {
  if (isAdmin(user)) return true;

  return isManager(user) && isSameId(project.projectLead, user._id);
};

export const canViewProjectTasks = (project, user) => {
  if (isAdmin(user)) return true;

  return isProjectMember(project, user);
};

export const canViewTask = (task, project, user) => {
  if (isAdmin(user)) return true;

  if (isManager(user)) {
    return isProjectMember(project, user);
  }

  return isEmployee(user) && isSameId(task.assignedTo, user._id);
};

export const canEmployeeUpdateStatus = (currentStatus, nextStatus) => {
  const allowedTransitions =
    EMPLOYEE_TASK_STATUS_TRANSITIONS[currentStatus] ?? [];

  return allowedTransitions.includes(nextStatus);
};

export const canTransitionTaskStatus = (currentStatus, nextStatus) => {
  const allowedTransitions = TASK_STATUS_TRANSITIONS[currentStatus] ?? [];

  return allowedTransitions.includes(nextStatus);
};
