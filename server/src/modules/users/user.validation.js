import { z } from 'zod';

import {
  USER_ROLE_VALUES,
  USER_STATUS_VALUES,
} from '../../shared/constants/user.constants.js';

const objectIdSchema = z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid user ID');

export const createUserSchema = z.object({
  body: z
    .object({
      firstName: z
        .string()
        .trim()
        .min(2, 'First name must be at least 2 characters')
        .max(50),
      lastName: z.string().trim().max(50).optional(),
      email: z
        .string()
        .trim()
        .toLowerCase()
        .email('Please provide a valid email address'),
      role: z.enum(USER_ROLE_VALUES),
    })
    .strict(),
});

export const userIdParamSchema = z.object({
  params: z.object({
    userId: objectIdSchema,
  }),
});

export const getUsersSchema = z.object({
  query: z.object({
    search: z.string().trim().optional(),
    role: z.enum(USER_ROLE_VALUES).optional(),
    status: z.enum(USER_STATUS_VALUES).optional(),
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(10),
    sort: z
      .enum(['createdAt', '-createdAt', 'firstName', '-firstName'])
      .default('-createdAt'),
  }),
});

export const updateUserSchema = z.object({
  params: z.object({
    userId: objectIdSchema,
  }),
  body: z
    .object({
      firstName: z.string().trim().min(2).max(50).optional(),
      lastName: z.string().trim().max(50).optional(),
    })
    .strict(),
});

export const updateUserEmailSchema = z.object({
  params: z.object({
    userId: objectIdSchema,
  }),
  body: z
    .object({
      email: z
        .string()
        .trim()
        .toLowerCase()
        .email('Please provide a valid email address'),
    })
    .strict(),
});

export const updateUserRoleSchema = z.object({
  params: z.object({
    userId: objectIdSchema,
  }),
  body: z
    .object({
      role: z.enum(USER_ROLE_VALUES),
    })
    .strict(),
});

export const updateUserStatusSchema = z.object({
  params: z.object({
    userId: objectIdSchema,
  }),
  body: z
    .object({
      status: z.enum(USER_STATUS_VALUES),
    })
    .strict(),
});
