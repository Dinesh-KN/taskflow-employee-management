import { USER_ROLES } from '../constants/user.constants.js';
import { isSameId } from '../utils/id.utils.js';

export const isAdmin = (user) => {
  return user.role === USER_ROLES.ADMIN;
};

export const isManager = (user) => {
  return user.role === USER_ROLES.MANAGER;
};

export const isEmployee = (user) => {
  return user.role === USER_ROLES.EMPLOYEE;
};

export const isProjectMember = (project, user) => {
  return project.members.some((memberId) => isSameId(memberId, user._id));
};
