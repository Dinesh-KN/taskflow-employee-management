import {
  isAdmin,
  isManager,
  isProjectMember,
} from '../../shared/permissions/role.permissions.js';
import { isSameId } from '../../shared/utils/id.utils.js';

export { isAdmin, isManager, isProjectMember };

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
