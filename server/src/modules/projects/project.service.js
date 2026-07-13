import { AppError } from '../../shared/errors/app-error.js';

import {
  PROJECT_STATUS,
  PROJECT_STATUS_TRANSITIONS,
} from './project.constants.js';
import { Project } from './project.model.js';
import {
  isAdmin,
  canManageProject,
  canViewProject,
  getProjectVisibilityFilter,
} from './project.permissions.js';
import {
  ensureProjectNameIsAvailable,
  hasField,
  getChangedProjectFields,
  haveSameProjectMembers,
} from './project.service.helpers.js';
import {
  cleanProjectName,
  escapeRegex,
  getProjectSortOption,
  projectPopulateOptions,
  getUniqueIds,
  isSameId,
  validateActiveUsers,
  validateProjectLead,
  validateProjectDates,
} from './project.utils.js';

export const initializeProject = async ({
  currentUser,
  name,
  description = '',
  status,
  priority,
  startDate,
  dueDate,
  projectLeadId,
  members = [],
}) => {
  validateProjectDates({ startDate, dueDate });

  const cleanedName = cleanProjectName(name);

  await ensureProjectNameIsAvailable({
    name: cleanedName,
  });

  const [validatedProjectLeadId, memberIds] = await Promise.all([
    validateProjectLead(projectLeadId),
    validateActiveUsers(members),
  ]);

  const projectMemberIds = getUniqueIds([...memberIds, validatedProjectLeadId]);

  const project = await Project.create({
    name,
    description,
    status,
    priority,
    startDate,
    dueDate,
    members: projectMemberIds,
    projectLead: validatedProjectLeadId,
    createdBy: currentUser._id,
  });

  const populatedProject = await Project.findById(project._id).populate(
    projectPopulateOptions,
  );

  return {
    project: populatedProject,
  };
};

export const findProjects = async ({
  currentUser,
  search,
  status,
  priority,
  page,
  limit,
  sort,
}) => {
  const conditions = [];

  const visibilityFilter = getProjectVisibilityFilter(currentUser);

  if (Object.keys(visibilityFilter).length > 0) {
    conditions.push(visibilityFilter);
  }

  if (search) {
    const safeSearch = escapeRegex(search);

    conditions.push({
      $or: [
        { name: { $regex: safeSearch, $options: 'i' } },
        { description: { $regex: safeSearch, $options: 'i' } },
      ],
    });
  }

  conditions.push({
    status: status ?? { $ne: PROJECT_STATUS.ARCHIVED },
  });

  if (priority) {
    conditions.push({ priority });
  }

  const filter = conditions.length > 0 ? { $and: conditions } : {};

  const skip = (page - 1) * limit;
  const sortBy = getProjectSortOption(sort);

  const [projects, totalProjects] = await Promise.all([
    Project.find(filter)
      .populate(projectPopulateOptions)
      .sort(sortBy)
      .skip(skip)
      .limit(limit),
    Project.countDocuments(filter),
  ]);

  return {
    projects,
    pagination: {
      totalProjects,
      currentPage: page,
      totalPages: Math.ceil(totalProjects / limit),
      limit,
    },
  };
};

export const getProjectDetails = async ({ projectId, currentUser }) => {
  const project = await Project.findById(projectId).populate(
    projectPopulateOptions,
  );

  if (!project) {
    throw new AppError('Project not found', 404);
  }

  if (!canViewProject(project, currentUser)) {
    throw new AppError('You do not have permission to view this project', 403);
  }

  return {
    project,
  };
};

export const updateProjectDetails = async ({
  projectId,
  currentUser,
  updateData,
}) => {
  if (Object.keys(updateData).length === 0) {
    throw new AppError('At least one field is required to update project', 400);
  }

  const project = await Project.findById(projectId);

  if (!project) {
    throw new AppError('Project not found', 404);
  }

  if (!canManageProject(project, currentUser)) {
    throw new AppError(
      'You do not have permission to update this project',
      403,
    );
  }

  if (project.status === PROJECT_STATUS.ARCHIVED) {
    throw new AppError('Archived projects cannot be updated', 409);
  }

  const changes = await getChangedProjectFields({
    project,
    updateData,
  });

  if (Object.keys(changes).length === 0) {
    const populatedProject = await Project.findById(project._id).populate(
      projectPopulateOptions,
    );

    return {
      project: populatedProject,
      changed: false,
    };
  }

  const nextStartDate = hasField(changes, 'startDate')
    ? changes.startDate
    : project.startDate;

  const nextDueDate = hasField(changes, 'dueDate')
    ? changes.dueDate
    : project.dueDate;

  validateProjectDates({
    startDate: nextStartDate,
    dueDate: nextDueDate,
  });

  Object.assign(project, changes);

  await project.save();

  const populatedProject = await Project.findById(project._id).populate(
    projectPopulateOptions,
  );

  return {
    project: populatedProject,
    changed: true,
  };
};

export const changeProjectStatus = async ({
  projectId,
  currentUser,
  status,
}) => {
  const project = await Project.findById(projectId);

  if (!project) {
    throw new AppError('Project not found', 404);
  }

  if (!canManageProject(project, currentUser)) {
    throw new AppError(
      'You do not have permission to update this project status',
      403,
    );
  }

  if (project.status === status) {
    const populatedProject = await Project.findById(project._id).populate(
      projectPopulateOptions,
    );

    return {
      project: populatedProject,
      changed: false,
    };
  }

  const allowedTransitions = PROJECT_STATUS_TRANSITIONS[project.status] ?? [];

  if (!allowedTransitions.includes(status)) {
    throw new AppError(
      `Project status cannot change from ${project.status} to ${status}`,
      409,
    );
  }

  project.status = status;

  await project.save();

  const populatedProject = await Project.findById(project._id).populate(
    projectPopulateOptions,
  );

  return {
    project: populatedProject,
    changed: true,
  };
};

export const changeProjectLead = async ({
  projectId,
  projectLeadId,
  currentUser,
}) => {
  const project = await Project.findById(projectId);

  if (!project) {
    throw new AppError('Project not found', 404);
  }

  if (
    !isAdmin(currentUser) &&
    !isSameId(project.projectLead, currentUser._id)
  ) {
    throw new AppError(
      'Only an admin or the current project lead can change the project lead',
      403,
    );
  }

  if (project.status === PROJECT_STATUS.ARCHIVED) {
    throw new AppError('Archived project lead cannot be updated', 409);
  }

  if (isSameId(project.projectLead, projectLeadId)) {
    const populatedProject = await Project.findById(project._id).populate(
      projectPopulateOptions,
    );

    return {
      project: populatedProject,
      changed: false,
    };
  }

  const validatedProjectLeadId = await validateProjectLead(projectLeadId);

  project.projectLead = validatedProjectLeadId;

  project.members = getUniqueIds([...project.members, validatedProjectLeadId]);

  await project.save();

  const populatedProject = await Project.findById(project._id).populate(
    projectPopulateOptions,
  );

  return {
    project: populatedProject,
    changed: true,
  };
};

export const assignProjectMembers = async ({
  projectId,
  currentUser,
  members,
}) => {
  const project = await Project.findById(projectId);

  if (!project) {
    throw new AppError('Project not found', 404);
  }

  if (!canManageProject(project, currentUser)) {
    throw new AppError(
      'You do not have permission to update project members',
      403,
    );
  }

  if (project.status === PROJECT_STATUS.ARCHIVED) {
    throw new AppError('Archived project members cannot be updated', 400);
  }

  const memberIds = await validateActiveUsers(members);

  const nextMemberIds = getUniqueIds([...memberIds, project.projectLead]);

  if (haveSameProjectMembers(project.members, nextMemberIds)) {
    const populatedProject = await Project.findById(project._id).populate(
      projectPopulateOptions,
    );

    return {
      project: populatedProject,
      changed: false,
    };
  }

  project.members = nextMemberIds;

  await project.save();

  const populatedProject = await Project.findById(project._id).populate(
    projectPopulateOptions,
  );

  return {
    project: populatedProject,
    changed: true,
  };
};
