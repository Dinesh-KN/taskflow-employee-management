import {
  createUserAccount,
  findUsers,
  findUserById,
  updateUserProfileById,
  updateUserEmailById,
  updateUserRoleById,
  updateUserStatusById,
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
  const { users, pagination } = await findUsers(req.validated.query);

  res.status(200).json({
    success: true,
    message: 'Users fetched successfully',
    data: {
      users,
      pagination,
    },
  });
};

export const getUserById = async (req, res) => {
  const { userId } = req.validated.params;

  const { user } = await findUserById(userId);

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

  const { user } = await updateUserProfileById(userId, req.validated.body);

  res.status(200).json({
    success: true,
    message: 'User updated successfully',
    data: {
      user,
    },
  });
};

export const updateUserEmail = async (req, res) => {
  const { userId } = req.validated.params;
  const { email } = req.validated.body;

  const { user, emailChanged } = await updateUserEmailById(userId, email);

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

  const { user } = await updateUserRoleById(userId, role);

  res.status(200).json({
    success: true,
    message: 'User role updated successfully',
    data: {
      user,
    },
  });
};

export const updateUserStatus = async (req, res) => {
  const { userId } = req.validated.params;
  const { status } = req.validated.body;

  const { user } = await updateUserStatusById(userId, status);

  res.status(200).json({
    success: true,
    message: 'User status updated successfully',
    data: {
      user,
    },
  });
};
