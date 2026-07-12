import { USER_ROLES } from '../../shared/constants/user.constants.js';
import { isSameId } from './project.utils.js';

export const isAdmin = (user) => user.role === USER_ROLES.ADMIN;

export const isManager = (user) => user.role === USER_ROLES.MANAGER;

export const isProjectMember = (project, user) => {
  return project.members.some((memberId) => isSameId(memberId, user._id));
};

export const canManageProject = (project, user) => {
  if (isAdmin(user)) return true;

  return isManager(user) && isSameId(project.projectLead, user._id);
};

export const canViewProject = (project, user) => {
  if (isAdmin(user)) return true;

  if (isManager(user)) {
    return (
      isSameId(project.createdBy, user._id) || isProjectMember(project, user)
    );
  }

  return isProjectMember(project, user);
};

export const getProjectVisibilityFilter = (user) => {
  if (isAdmin(user)) return {};

  if (isManager(user)) {
    return {
      $or: [{ projectLead: user._id }, { members: user._id }],
    };
  }

  return {
    members: user._id,
  };
};
