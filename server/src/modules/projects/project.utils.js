import { AppError } from '../../shared/errors/app-error.js';

import {
  USER_STATUS,
  USER_ROLES,
} from '../../shared/constants/user.constants.js';
import { User } from '../users/user.model.js';

export const cleanProjectName = (name = '') => {
  return name.trim().replace(/\s+/g, ' ');
};

export const normalizeProjectName = (name = '') => {
  return cleanProjectName(name).toLowerCase();
};

export const escapeRegex = (value) => {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};

export const getId = (value) => {
  return value?._id?.toString?.() || value?.toString();
};

export const isSameId = (firstId, secondId) => {
  return getId(firstId) === getId(secondId);
};

export const getUniqueIds = (ids = []) => {
  return [...new Set(ids.map((id) => id.toString()))];
};

export const validateActiveUsers = async (userIds) => {
  const uniqueUserIds = getUniqueIds(userIds);

  if (uniqueUserIds.length === 0) {
    return [];
  }

  const activeUsersCount = await User.countDocuments({
    _id: { $in: uniqueUserIds },
    status: USER_STATUS.ACTIVE,
  });

  if (activeUsersCount !== uniqueUserIds.length) {
    throw new AppError(
      'One or more project members are invalid or inactive',
      400,
    );
  }

  return uniqueUserIds;
};

export const validateProjectLead = async (userId) => {
  const projectLead = await User.findOne({
    _id: userId,
    status: USER_STATUS.ACTIVE,
    role: {
      $in: [USER_ROLES.ADMIN, USER_ROLES.MANAGER],
    },
  }).select('_id');

  if (!projectLead) {
    throw new AppError('Project lead must be an active admin or manager', 400);
  }

  return projectLead._id;
};

export const validateProjectDates = ({ startDate, dueDate }) => {
  if (startDate && dueDate && new Date(dueDate) < new Date(startDate)) {
    throw new AppError('Due date cannot be before start date', 400);
  }
};

export const projectPopulateOptions = [
  {
    path: 'createdBy',
    select: 'firstName lastName email role status',
  },
  {
    path: 'projectLead',
    select: 'firstName lastName email role status',
  },
  {
    path: 'members',
    select: 'firstName lastName email role status',
  },
];

export const getProjectSortOption = (sort) => {
  const sortOptions = {
    createdAt: { createdAt: 1 },
    '-createdAt': { createdAt: -1 },
    dueDate: { dueDate: 1 },
    '-dueDate': { dueDate: -1 },
    name: { name: 1 },
    '-name': { name: -1 },
  };

  return sortOptions[sort] || { createdAt: -1 };
};
