import express from 'express';

import { validate } from '../../middleware/validate.middleware.js';
import { authenticate, authorize } from '../auth/auth.middleware.js';
import { USER_ROLES } from '../../shared/constants/user.constants.js';
import {
  createUser,
  getUserById,
  getUsers,
  updateUser,
  updateUserEmail,
  updateUserRole,
  updateUserStatus,
} from './user.controller.js';
import {
  createUserSchema,
  userIdParamSchema,
  getUsersSchema,
  updateUserSchema,
  updateUserEmailSchema,
  updateUserRoleSchema,
  updateUserStatusSchema,
} from './user.validation.js';

const router = express.Router();

router.use(authenticate);
router.use(authorize(USER_ROLES.ADMIN));

router.post('/', validate(createUserSchema), createUser);
router.get('/', validate(getUsersSchema), getUsers);
router.get('/:userId', validate(userIdParamSchema), getUserById);
router.patch('/:userId', validate(updateUserSchema), updateUser);
router.patch(
  '/:userId/email',
  validate(updateUserEmailSchema),
  updateUserEmail,
);
router.patch('/:userId/role', validate(updateUserRoleSchema), updateUserRole);
router.patch(
  '/:userId/status',
  validate(updateUserStatusSchema),
  updateUserStatus,
);

export default router;
