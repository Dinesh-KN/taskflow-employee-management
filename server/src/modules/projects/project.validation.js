import { z } from 'zod';

import {
  PROJECT_PRIORITY_VALUES,
  PROJECT_STATUS_VALUES,
} from './project.constants.js';

const objectIdSchema = z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid User ID');

const projectDateSchema = z.coerce.date({
  invalid_type_error: 'Invalid date format',
});

const validateProjectDates = (data, ctx) => {
  if (data.startDate && data.dueDate && data.dueDate < data.startDate) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Due date cannot be before start date',
      path: ['dueDate'],
    });
  }
};

export const createProjectSchema = z.object({
  body: z
    .object({
      name: z.string().trim().min(2).max(100),
      description: z.string().trim().max(1000).optional(),
      status: z.enum(PROJECT_STATUS_VALUES).optional(),
      priority: z.enum(PROJECT_PRIORITY_VALUES).optional(),
      startDate: projectDateSchema.optional(),
      dueDate: projectDateSchema.optional(),
      members: z.array(objectIdSchema).optional(),
    })
    .strict()
    .superRefine(validateProjectDates),
});

export const getProjectsSchema = z.object({
  query: z.object({
    search: z.string().trim().optional(),
    status: z.enum(PROJECT_STATUS_VALUES).optional(),
    priority: z.enum(PROJECT_PRIORITY_VALUES).optional(),
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(10),
    sort: z
      .enum(['createdAt', '-createdAt', 'dueDate', '-dueDate', 'name', '-name'])
      .default('-createdAt'),
  }),
});

export const projectIdParamSchema = z.object({
  params: z.object({
    projectId: objectIdSchema,
  }),
});

export const updateProjectSchema = z.object({
  params: z.object({
    projectId: objectIdSchema,
  }),

  body: z
    .object({
      name: z.string().trim().min(2).max(100).optional(),
      description: z.string().trim().max(1000).optional(),
      priority: z.enum(PROJECT_PRIORITY_VALUES).optional(),
      startDate: projectDateSchema.optional(),
      dueDate: projectDateSchema.optional(),
    })
    .strict()
    .superRefine(validateProjectDates),
});

export const updateProjectStatusSchema = z.object({
  params: z.object({
    projectId: objectIdSchema,
  }),

  body: z
    .object({
      status: z.enum(PROJECT_STATUS_VALUES),
    })
    .strict(),
});

export const updateProjectLeadSchema = z.object({
  params: z.object({
    projectId: objectIdSchema,
  }),

  body: z
    .object({
      projectLead: objectIdSchema,
    })
    .strict(),
});

export const updateProjectMembersSchema = z.object({
  params: z.object({
    projectId: objectIdSchema,
  }),

  body: z
    .object({
      members: z.array(objectIdSchema),
    })
    .strict(),
});
