import { AppError } from '../../shared/errors/app-error.js';

import {
  createUserAccount,
  listUsers,
  getUserDetails,
  updateUserProfile,
  changeUserEmail,
  changeUserRole,
  changeUserStatus,
  changeProfilePhoto,
  removeProfilePhoto,
} from './user.service.js';

export const createUser = async (req, res) => {
  const { user, temporaryPassword } = await createUserAccount(
    req.validated.body,
  );

  res.status(201).json({
    success: true,
    message: 'User created successfully',
    data: {
      user,
      temporaryPassword,
    },
  });
};

export const getUsers = async (req, res) => {
  const { users, pagination } = await listUsers(req.validated.query);

  res.status(200).json({
    success: true,
    message: 'Users fetched successfully',
    data: {
      users,
      pagination,
    },
  });
};

export const getUser = async (req, res) => {
  const { userId } = req.validated.params;

  const { user } = await getUserDetails(userId);

  res.status(200).json({
    success: true,
    message: 'User fetched successfully',
    data: {
      user,
    },
  });
};

export const updateUser = async (req, res) => {
  const { userId } = req.validated.params;

  const { user, updated } = await updateUserProfile(userId, req.validated.body);

  res.status(200).json({
    success: true,
    message: updated ? 'User updated successfully' : 'No changes detected',
    data: {
      user,
    },
  });
};

export const updateUserEmail = async (req, res) => {
  const { userId } = req.validated.params;
  const { email } = req.validated.body;

  const { user, emailChanged } = await changeUserEmail(userId, email);

  res.status(200).json({
    success: true,
    message: emailChanged
      ? 'User email updated successfully'
      : 'Email is already up to date',
    data: { user },
  });
};

export const updateUserRole = async (req, res) => {
  const { userId } = req.validated.params;
  const { role } = req.validated.body;

  if (req.user.id === userId) {
    throw new AppError('You cannot update your own role', 400);
  }

  const { user, roleChanged } = await changeUserRole(userId, role);

  res.status(200).json({
    success: true,
    message: roleChanged
      ? 'User role updated successfully'
      : 'User already has this role',
    data: {
      user,
      roleChanged,
    },
  });
};

export const updateUserStatus = async (req, res) => {
  const { userId } = req.validated.params;
  const { status } = req.validated.body;

  if (req.user.id === userId) {
    throw new AppError('You cannot update your own status', 400);
  }

  const { user, statusChanged } = await changeUserStatus(userId, status);

  res.status(200).json({
    success: true,
    message: statusChanged
      ? 'User status updated successfully'
      : 'User already has this status',
    data: {
      user,
      statusChanged,
    },
  });
};

export const updateProfilePhoto = async (req, res) => {
  const { user, updated } = await changeProfilePhoto({
    currentUser: req.user,
    file: req.file,
  });

  res.status(200).json({
    success: true,
    message: updated
      ? 'Profile photo updated successfully'
      : 'No changes detected',
    data: {
      user,
    },
  });
};

export const deleteProfilePhoto = async (req, res) => {
  const { user, removed } = await removeProfilePhoto({
    currentUser: req.user,
  });

  res.status(200).json({
    success: true,
    message: removed
      ? 'Profile photo removed successfully'
      : 'No profile photo to remove',
    data: {
      user,
    },
  });
};
