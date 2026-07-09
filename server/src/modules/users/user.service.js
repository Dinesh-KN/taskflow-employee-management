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

export const findUsers = async ({
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

  return {
    users,
    pagination: {
      totalUsers,
      currentPage: page,
      totalPages: Math.ceil(totalUsers / limit),
      limit,
    },
  };
};

export const findUserById = async (userId) => {
  const user = await User.findById(userId);

  if (!user) {
    throw new AppError('User not found', 404);
  }

  return { user };
};

export const updateUserProfileById = async (userId, updateData) => {
  const user = await User.findByIdAndUpdate(userId, updateData, {
    new: true,
    runValidators: true,
  });

  if (!user) {
    throw new AppError('User not found', 404);
  }

  return { user };
};

export const updateUserEmailById = async (userId, email) => {
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

export const updateUserRoleById = async (userId, role) => {
  const user = await User.findByIdAndUpdate(
    userId,
    { role },
    {
      new: true,
      runValidators: true,
    },
  );

  if (!user) {
    throw new AppError('User not found', 404);
  }

  return { user };
};

export const updateUserStatusById = async (userId, status) => {
  const user = await User.findById(userId).select('+refreshTokens');

  if (!user) {
    throw new AppError('User not found', 404);
  }

  user.status = status;
  user.refreshTokens = [];

  await user.save();

  return { user };
};
