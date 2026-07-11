import express from 'express';

import { validate } from '../../middleware/validate.middleware.js';
import { USER_ROLES } from '../../shared/constants/user.constants.js';
import { authenticate, authorize } from '../auth/auth.middleware.js';
import {
  createProject,
  listProjects,
  getProject,
  updateProject,
  updateProjectStatus,
  updateProjectMembers,
} from './project.controller.js';
import {
  createProjectSchema,
  getProjectsSchema,
  projectIdParamSchema,
  updateProjectMembersSchema,
  updateProjectSchema,
  updateProjectStatusSchema,
} from './project.validation.js';

const router = express.Router();

router.use(authenticate);

router.post(
  '/',
  authorize(USER_ROLES.ADMIN, USER_ROLES.MANAGER),
  validate(createProjectSchema),
  createProject,
);

router.get('/', validate(getProjectsSchema), listProjects);

router.get('/:projectId', validate(projectIdParamSchema), getProject);

router.patch(
  '/:projectId',
  authorize(USER_ROLES.ADMIN, USER_ROLES.MANAGER),
  validate(updateProjectSchema),
  updateProject,
);

router.patch(
  '/:projectId/status',
  authorize(USER_ROLES.ADMIN, USER_ROLES.MANAGER),
  validate(updateProjectStatusSchema),
  updateProjectStatus,
);

router.patch(
  '/:projectId/members',
  authorize(USER_ROLES.ADMIN, USER_ROLES.MANAGER),
  validate(updateProjectMembersSchema),
  updateProjectMembers,
);

export default router;
