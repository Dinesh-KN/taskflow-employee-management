import { z } from 'zod';

export const loginSchema = z.object({
  body: z.object({
    email: z
      .string()
      .trim()
      .toLowerCase()
      .email('Please provide a valid email address'),
    password: z.string().min(1, 'Password is required'),
  }),
});

export const changePasswordSchema = z.object({
  body: z
    .object({
      currentPassword: z.string().min(1, 'Current password is required'),

      newPassword: z
        .string()
        .min(8, 'New password must be at least 8 characters')
        .regex(
          /[A-Z]/,
          'New password must contain at least one uppercase letter',
        )
        .regex(
          /[a-z]/,
          'New password must contain at least one lowercase letter',
        )
        .regex(/[0-9]/, 'New password must contain at least one number')
        .regex(
          /[^A-Za-z0-9]/,
          'New password must contain at least one special character',
        ),

      confirmPassword: z.string().min(1, 'Confirm password is required'),
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
      message: 'New password and confirm password do not match',
      path: ['confirmPassword'],
    }),
});
