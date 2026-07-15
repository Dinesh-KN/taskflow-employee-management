import { USER_ROLES } from '../../shared/constants/user.constants.js';
import {
  EMPLOYEE_TASK_STATUS_TRANSITIONS,
  TASK_STATUS_TRANSITIONS,
} from './task.constants.js';
import { isSameId } from './task.utils.js';

export const isAdmin = (user) => user.role === USER_ROLES.ADMIN;

export const isManager = (user) => user.role === USER_ROLES.MANAGER;

export const isEmployee = (user) => user.role === USER_ROLES.EMPLOYEE;

export const isProjectMember = (project, userId) => {
  return project.members.some((memberId) => isSameId(memberId, userId));
};

export const canManageProjectTasks = (project, user) => {
  if (isAdmin(user)) return true;

  return isManager(user) && isSameId(project.projectLead, user._id);
};

export const canViewProjectTasks = (project, user) => {
  if (isAdmin(user)) return true;

  return isProjectMember(project, user._id);
};

export const canViewTask = (task, project, user) => {
  if (isAdmin(user)) return true;

  if (isManager(user)) {
    return isProjectMember(project, user._id);
  }

  return isEmployee(user) && isSameId(task.assignedTo, user._id);
};

export const canManageTaskStatusTransition = (currentStatus, nextStatus) => {
  const allowedTransitions = TASK_STATUS_TRANSITIONS[currentStatus] ?? [];

  return allowedTransitions.includes(nextStatus);
};

export const canEmployeeUpdateStatus = (currentStatus, nextStatus) => {
  const allowedTransitions =
    EMPLOYEE_TASK_STATUS_TRANSITIONS[currentStatus] ?? [];

  return allowedTransitions.includes(nextStatus);
};
