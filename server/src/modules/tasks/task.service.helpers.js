import { AppError } from '../../shared/errors/app-error.js';

import { USER_STATUS } from '../../shared/constants/user.constants.js';
import { User } from '../users/user.model.js';
import { PROJECT_STATUS } from '../projects/project.constants.js';
import { Project } from '../projects/project.model.js';
import { TASK_STATUS } from './task.constants.js';
import { Task } from './task.model.js';
import { isAdmin, isManager, isProjectMember } from './task.permissions.js';
import { areDatesEqual } from '../../shared/utils/date.utils.js';
import { hasField } from '../../shared/utils/object.utils.js';
import { taskPopulateOptions } from './task.utils.js';

export const getProjectByIdOrFail = async (projectId) => {
  const project = await Project.findById(projectId);

  if (!project) {
    throw new AppError('Project not found', 404);
  }

  return project;
};

export const getTaskByIdOrFail = async (taskId) => {
  const task = await Task.findById(taskId);

  if (!task) {
    throw new AppError('Task not found', 404);
  }

  return task;
};

export const getVisibleProjectIdsForUser = async (user) => {
  if (isAdmin(user)) {
    return null;
  }

  if (isManager(user)) {
    const projects = await Project.find({
      members: user._id,
    }).select('_id');

    return projects.map((project) => project._id);
  }

  return null;
};

export const assertProjectCanAcceptTasks = (project) => {
  if (project.status === PROJECT_STATUS.ARCHIVED) {
    throw new AppError(
      'Cannot create or update tasks in an archived project',
      400,
    );
  }
};

export const assertTaskCanBeUpdated = (task, project) => {
  if (project.status === PROJECT_STATUS.ARCHIVED) {
    throw new AppError('Tasks in archived projects cannot be updated', 400);
  }

  if (task.status === TASK_STATUS.ARCHIVED) {
    throw new AppError('Archived tasks cannot be updated', 400);
  }
};

export const validateTaskDueDate = ({ dueDate, project }) => {
  if (!dueDate || !project.dueDate) return;

  if (new Date(dueDate) > new Date(project.dueDate)) {
    throw new AppError('Task due date cannot be after project due date', 400);
  }
};

export const validateActiveProjectAssignee = async ({
  assignedTo,
  project,
}) => {
  const user = await User.findOne({
    _id: assignedTo,
    status: USER_STATUS.ACTIVE,
  });

  if (!user) {
    throw new AppError('Task assignee is invalid or inactive', 400);
  }

  if (!isProjectMember(project, user)) {
    throw new AppError('Task assignee must be a project member', 400);
  }

  return user;
};

export const getChangedTaskFields = ({ task, updateData }) => {
  const changes = {};

  if (hasField(updateData, 'title')) {
    const nextTitle = updateData.title.trim();

    if (task.title !== nextTitle) {
      changes.title = nextTitle;
    }
  }

  if (hasField(updateData, 'description')) {
    const nextDescription = updateData.description?.trim() ?? '';

    if ((task.description ?? '') !== nextDescription) {
      changes.description = nextDescription;
    }
  }

  if (hasField(updateData, 'priority')) {
    if (task.priority !== updateData.priority) {
      changes.priority = updateData.priority;
    }
  }

  if (hasField(updateData, 'dueDate')) {
    if (!areDatesEqual(task.dueDate, updateData.dueDate)) {
      changes.dueDate = updateData.dueDate;
    }
  }

  return changes;
};

export const applyTaskStatus = (task, status) => {
  const previousStatus = task.status;

  task.status = status;

  if (status === TASK_STATUS.COMPLETED) {
    task.completedAt ??= new Date();
    return;
  }

  if (status === TASK_STATUS.ARCHIVED) {
    return;
  }

  if (previousStatus === TASK_STATUS.COMPLETED) {
    task.completedAt = null;
  }
};

export const getPopulatedTaskById = async (taskId) => {
  return Task.findById(taskId).populate(taskPopulateOptions);
};
