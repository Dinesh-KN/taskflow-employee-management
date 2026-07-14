import { z } from 'zod';

import { TASK_PRIORITY_VALUES, TASK_STATUS_VALUES } from './task.constants.js';

const objectIdSchema = z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid ID');

const taskDateSchema = z.coerce.date({
  invalid_type_error: 'Invalid date format',
});

const nullableTaskDateSchema = z.union([taskDateSchema, z.null()]).optional();

const rejectEmptyBody = (data, ctx) => {
  if (Object.keys(data).length === 0) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'At least one field is required',
      path: ['body'],
    });
  }
};

export const createTaskSchema = z.object({
  params: z.object({
    projectId: objectIdSchema,
  }),
  body: z
    .object({
      title: z.string().trim().min(2).max(150),
      description: z.string().trim().max(2000).optional(),
      assignedTo: objectIdSchema,
      priority: z.enum(TASK_PRIORITY_VALUES).optional(),
      dueDate: taskDateSchema.optional(),
    })
    .strict(),
});

export const getTasksSchema = z.object({
  query: z.object({
    search: z.string().trim().optional(),
    project: objectIdSchema.optional(),
    assignedTo: objectIdSchema.optional(),
    status: z.enum(TASK_STATUS_VALUES).optional(),
    priority: z.enum(TASK_PRIORITY_VALUES).optional(),
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(10),
    sort: z
      .enum([
        'createdAt',
        '-createdAt',
        'dueDate',
        '-dueDate',
        'title',
        '-title',
      ])
      .default('-createdAt'),
  }),
});

export const getProjectTasksSchema = z.object({
  params: z.object({
    projectId: objectIdSchema,
  }),
  query: z.object({
    search: z.string().trim().optional(),
    assignedTo: objectIdSchema.optional(),
    status: z.enum(TASK_STATUS_VALUES).optional(),
    priority: z.enum(TASK_PRIORITY_VALUES).optional(),
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(10),
    sort: z
      .enum([
        'createdAt',
        '-createdAt',
        'dueDate',
        '-dueDate',
        'title',
        '-title',
      ])
      .default('-createdAt'),
  }),
});

export const taskIdParamSchema = z.object({
  params: z.object({
    taskId: objectIdSchema,
  }),
});

export const updateTaskSchema = z.object({
  params: z.object({
    taskId: objectIdSchema,
  }),
  body: z
    .object({
      title: z.string().trim().min(2).max(150).optional(),
      description: z.string().trim().max(2000).optional(),
      priority: z.enum(TASK_PRIORITY_VALUES).optional(),
      dueDate: nullableTaskDateSchema,
    })
    .strict()
    .superRefine(rejectEmptyBody),
});

export const updateTaskStatusSchema = z.object({
  params: z.object({
    taskId: objectIdSchema,
  }),
  body: z
    .object({
      status: z.enum(TASK_STATUS_VALUES),
    })
    .strict(),
});

export const updateTaskAssigneeSchema = z.object({
  params: z.object({
    taskId: objectIdSchema,
  }),
  body: z
    .object({
      assignedTo: objectIdSchema,
    })
    .strict(),
});
