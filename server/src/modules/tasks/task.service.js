import { AppError } from '../../shared/errors/app-error.js';
import { TASK_STATUS } from './task.constants.js';

import { Task } from './task.model.js';
import {
  canEmployeeUpdateStatus,
  canManageTaskStatusTransition,
  canManageProjectTasks,
  canViewProjectTasks,
  canViewTask,
  isEmployee,
  isManager,
} from './task.permissions.js';
import {
  applyTaskStatus,
  assertProjectCanAcceptTasks,
  assertTaskCanBeUpdated,
  getChangedTaskFields,
  getPopulatedTaskById,
  getProjectByIdOrFail,
  getTaskByIdOrFail,
  getVisibleProjectIdsForUser,
  validateActiveProjectAssignee,
  validateTaskDueDate,
} from './task.service.helpers.js';
import {
  escapeRegex,
  getTaskSortOption,
  isSameId,
  taskPopulateOptions,
} from './task.utils.js';

export const initializeTask = async ({
  currentUser,
  projectId,
  title,
  description = '',
  assignedTo,
  priority,
  dueDate,
}) => {
  const project = await getProjectByIdOrFail(projectId);

  assertProjectCanAcceptTasks(project);

  if (!canManageProjectTasks(project, currentUser)) {
    throw new AppError(
      'You do not have permission to create tasks in this project',
      403,
    );
  }

  await validateActiveProjectAssignee({
    assignedTo,
    project,
  });

  validateTaskDueDate({
    dueDate,
    project,
  });

  const task = await Task.create({
    title,
    description,
    project: project._id,
    assignedTo,
    createdBy: currentUser._id,
    priority,
    dueDate,
  });

  const populatedTask = await getPopulatedTaskById(task._id);

  return {
    task: populatedTask,
  };
};

export const findTasks = async ({
  currentUser,
  search,
  project,
  assignedTo,
  status,
  priority,
  page,
  limit,
  sort,
}) => {
  const conditions = [];

  if (isManager(currentUser)) {
    const visibleProjectIds = await getVisibleProjectIdsForUser(currentUser);

    conditions.push({
      project: { $in: visibleProjectIds },
    });
  }

  if (isEmployee(currentUser)) {
    conditions.push({
      assignedTo: currentUser._id,
    });
  }

  if (search) {
    const safeSearch = escapeRegex(search);

    conditions.push({
      $or: [
        { title: { $regex: safeSearch, $options: 'i' } },
        { description: { $regex: safeSearch, $options: 'i' } },
      ],
    });
  }

  if (project) {
    conditions.push({ project });
  }

  if (assignedTo) {
    conditions.push({ assignedTo });
  }

  if (priority) {
    conditions.push({ priority });
  }

  conditions.push({
    status: status ?? { $ne: TASK_STATUS.ARCHIVED },
  });

  const filter = conditions.length > 0 ? { $and: conditions } : {};

  const skip = (page - 1) * limit;
  const sortBy = getTaskSortOption(sort);

  const [tasks, totalTasks] = await Promise.all([
    Task.find(filter)
      .populate(taskPopulateOptions)
      .sort(sortBy)
      .skip(skip)
      .limit(limit),
    Task.countDocuments(filter),
  ]);

  return {
    tasks,
    pagination: {
      totalTasks,
      currentPage: page,
      totalPages: Math.ceil(totalTasks / limit),
      limit,
    },
  };
};

export const findProjectTasks = async ({
  currentUser,
  projectId,
  search,
  assignedTo,
  status,
  priority,
  page,
  limit,
  sort,
}) => {
  const project = await getProjectByIdOrFail(projectId);

  if (!canViewProjectTasks(project, currentUser)) {
    throw new AppError(
      'You do not have permission to view tasks in this project',
      403,
    );
  }

  const conditions = [{ project: project._id }];

  if (isEmployee(currentUser)) {
    conditions.push({
      assignedTo: currentUser._id,
    });
  }

  if (search) {
    const safeSearch = escapeRegex(search);

    conditions.push({
      $or: [
        { title: { $regex: safeSearch, $options: 'i' } },
        { description: { $regex: safeSearch, $options: 'i' } },
      ],
    });
  }

  if (assignedTo) {
    conditions.push({ assignedTo });
  }

  if (priority) {
    conditions.push({ priority });
  }

  conditions.push({
    status: status ?? { $ne: TASK_STATUS.ARCHIVED },
  });

  const filter = { $and: conditions };

  const skip = (page - 1) * limit;
  const sortBy = getTaskSortOption(sort);

  const [tasks, totalTasks] = await Promise.all([
    Task.find(filter)
      .populate(taskPopulateOptions)
      .sort(sortBy)
      .skip(skip)
      .limit(limit),
    Task.countDocuments(filter),
  ]);

  return {
    tasks,
    pagination: {
      totalTasks,
      currentPage: page,
      totalPages: Math.ceil(totalTasks / limit),
      limit,
    },
  };
};

export const getTaskDetails = async ({ taskId, currentUser }) => {
  const task = await getTaskByIdOrFail(taskId);
  const project = await getProjectByIdOrFail(task.project);

  if (!canViewTask(task, project, currentUser)) {
    throw new AppError('You do not have permission to view this task', 403);
  }

  const populatedTask = await getPopulatedTaskById(task._id);

  return {
    task: populatedTask,
  };
};

export const updateTaskDetails = async ({
  taskId,
  currentUser,
  updateData,
}) => {
  const task = await getTaskByIdOrFail(taskId);
  const project = await getProjectByIdOrFail(task.project);

  assertTaskCanBeUpdated(task, project);

  if (!canManageProjectTasks(project, currentUser)) {
    throw new AppError('You do not have permission to update this task', 403);
  }

  const changes = getChangedTaskFields({
    task,
    updateData,
  });

  if (Object.keys(changes).length === 0) {
    const populatedTask = await getPopulatedTaskById(task._id);

    return {
      task: populatedTask,
      changed: false,
    };
  }

  const hasDueDateChanged = Object.prototype.hasOwnProperty.call(
    changes,
    'dueDate',
  );

  const nextDueDate = hasDueDateChanged ? changes.dueDate : task.dueDate;

  validateTaskDueDate({
    dueDate: nextDueDate,
    project,
  });

  Object.assign(task, changes);

  await task.save();

  const populatedTask = await getPopulatedTaskById(task._id);

  return {
    task: populatedTask,
    changed: true,
  };
};

export const changeTaskStatus = async ({ taskId, currentUser, status }) => {
  const task = await getTaskByIdOrFail(taskId);
  const project = await getProjectByIdOrFail(task.project);

  assertTaskCanBeUpdated(task, project);

  const canManageStatus = canManageProjectTasks(project, currentUser);
  const isAssignedUser = isSameId(task.assignedTo, currentUser._id);

  if (!canManageStatus && !isAssignedUser) {
    throw new AppError(
      'You do not have permission to update this task status',
      403,
    );
  }

  if (task.status === status) {
    const populatedTask = await getPopulatedTaskById(task._id);

    return {
      task: populatedTask,
      changed: false,
    };
  }

  if (canManageStatus) {
    if (!canManageTaskStatusTransition(task.status, status)) {
      throw new AppError(
        `Task status cannot change from ${task.status} to ${status}`,
        409,
      );
    }
  } else if (!canEmployeeUpdateStatus(task.status, status)) {
    throw new AppError(
      `Task status cannot change from ${task.status} to ${status}`,
      409,
    );
  }

  applyTaskStatus(task, status);

  await task.save();

  const populatedTask = await getPopulatedTaskById(task._id);

  return {
    task: populatedTask,
    changed: true,
  };
};

export const reassignTask = async ({ taskId, currentUser, assignedTo }) => {
  const task = await getTaskByIdOrFail(taskId);
  const project = await getProjectByIdOrFail(task.project);

  assertTaskCanBeUpdated(task, project);

  if (!canManageProjectTasks(project, currentUser)) {
    throw new AppError(
      'You do not have permission to update this task assignee',
      403,
    );
  }

  if (isSameId(task.assignedTo, assignedTo)) {
    const populatedTask = await getPopulatedTaskById(task._id);

    return {
      task: populatedTask,
      changed: false,
    };
  }

  const validatedAssignee = await validateActiveProjectAssignee({
    assignedTo,
    project,
  });

  task.assignedTo = validatedAssignee._id;

  await task.save();

  const populatedTask = await getPopulatedTaskById(task._id);

  return {
    task: populatedTask,
    changed: true,
  };
};
