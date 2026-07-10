import { AppError } from '../../shared/errors/app-error.js';
import { generateTemporaryPassword } from '../../shared/utils/generate-password.js';
import { User } from './user.model.js';

export const createUserAccount = async ({
  firstName,
  lastName = '',
  email,
  role,
}) => {
  const existingUser = await User.findOne({ email });

  if (existingUser) {
    throw new AppError('User with this email already exists', 409);
  }

  const temporaryPassword = generateTemporaryPassword();

  const user = await User.create({
    firstName,
    lastName,
    email,
    role,
    password: temporaryPassword,
    mustChangePassword: true,
  });

  return {
    user,
    temporaryPassword,
  };
};

export const listUsers = async ({
  search,
  role,
  status,
  page,
  limit,
  sort,
}) => {
  const filter = {};

  if (search) {
    filter.$or = [
      { firstName: { $regex: search, $options: 'i' } },
      { lastName: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
    ];
  }

  if (role) {
    filter.role = role;
  }

  if (status) {
    filter.status = status;
  }

  const skip = (page - 1) * limit;

  const [users, totalUsers] = await Promise.all([
    User.find(filter).sort(sort).skip(skip).limit(limit),
    User.countDocuments(filter),
  ]);

  const totalPages = Math.ceil(totalUsers / limit);

  return {
    users,
    pagination: {
      page,
      limit,
      totalItems: totalUsers,
      totalPages,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1,
    },
  };
};

export const getUserDetails = async (userId) => {
  const user = await User.findById(userId);

  if (!user) {
    throw new AppError('User not found', 404);
  }

  return { user };
};

export const updateUserProfile = async (userId, updateData) => {
  const user = await User.findById(userId);

  if (!user) {
    throw new AppError('User not found', 404);
  }

  const fieldsToCheck = ['firstName', 'lastName'];

  const hasChanges = fieldsToCheck.some(
    (field) =>
      Object.hasOwn(updateData, field) && updateData[field] !== user[field],
  );

  if (!hasChanges) {
    return {
      user,
      updated: false,
    };
  }

  Object.assign(user, updateData);
  await user.save();

  return {
    user,
    updated: true,
  };
};

export const changeUserEmail = async (userId, email) => {
  const user = await User.findById(userId).select('+refreshTokens');

  if (!user) {
    throw new AppError('User not found', 404);
  }

  if (user.email === email) {
    return { user, emailChanged: false };
  }

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    throw new AppError('User with this email already exists', 409);
  }

  user.email = email;
  user.refreshTokens = [];

  await user.save();

  return { user, emailChanged: true };
};

export const changeUserRole = async (userId, role) => {
  const user = await User.findById(userId).select('+refreshTokens');

  if (!user) {
    throw new AppError('User not found', 404);
  }

  if (user.role === role) {
    return {
      user,
      roleChanged: false,
    };
  }

  user.role = role;
  user.refreshTokens = [];

  await user.save();

  return {
    user,
    roleChanged: true,
  };
};

export const changeUserStatus = async (userId, status) => {
  const user = await User.findById(userId).select('+refreshTokens');

  if (!user) {
    throw new AppError('User not found', 404);
  }

  if (user.status === status) {
    return {
      user,
      statusChanged: false,
    };
  }

  user.status = status;
  user.refreshTokens = [];

  await user.save();

  return {
    user,
    statusChanged: true,
  };
};
