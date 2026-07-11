import { AppError } from '../../shared/errors/app-error.js';
import { PROJECT_STATUS } from './project.constants.js';
import { Project } from './project.model.js';
import {
  canManageProject,
  canViewProject,
  getProjectVisibilityFilter,
} from './project.permissions.js';
import {
  cleanProjectName,
  escapeRegex,
  getProjectSortOption,
  projectPopulateOptions,
  validateActiveUsers,
  validateProjectDates,
} from './project.utils.js';
import {
  ensureProjectNameIsAvailable,
  hasField,
  getChangedProjectFields,
  haveSameProjectMembers,
} from './project.service.helpers.js';

export const initializeProject = async ({
  currentUser,
  name,
  description = '',
  status,
  priority,
  startDate,
  dueDate,
  members = [],
}) => {
  validateProjectDates({ startDate, dueDate });

  const cleanedName = cleanProjectName(name);

  await ensureProjectNameIsAvailable({
    name: cleanedName,
  });

  const memberIds = await validateActiveUsers(members);

  const project = await Project.create({
    name,
    description,
    status,
    priority,
    startDate,
    dueDate,
    members: memberIds,
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

  if (status) {
    conditions.push({ status });
  }

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
    throw new AppError('Archived projects cannot be updated', 400);
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

  if (haveSameProjectMembers(project.members, memberIds)) {
    const populatedProject = await Project.findById(project._id).populate(
      projectPopulateOptions,
    );

    return {
      project: populatedProject,
      changed: false,
    };
  }

  project.members = memberIds;

  await project.save();

  const populatedProject = await Project.findById(project._id).populate(
    projectPopulateOptions,
  );

  return {
    project: populatedProject,
    changed: true,
  };
};
