import { z } from 'zod';

export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),

  password: z.string().min(1, 'Password is required'),
});

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, 'Current password is required'),

    newPassword: z
      .string()
      .min(8, 'New password must be at least 8 characters long')
      .regex(/[a-z]/, 'New password must include at least one lowercase letter')
      .regex(/[A-Z]/, 'New password must include at least one uppercase letter')
      .regex(/[0-9]/, 'New password must include at least one number')
      .regex(
        /[^a-zA-Z0-9]/,
        'New password must include at least one special character',
      ),

    confirmPassword: z.string().min(1, 'Please confirm your new password'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });
