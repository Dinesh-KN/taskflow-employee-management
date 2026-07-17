import { z } from 'zod';

import { DASHBOARD_DEFAULTS, DASHBOARD_LIMITS } from './dashboard.constants.js';

export const adminDashboardSchema = z.object({
  query: z.object({
    recentLimit: z.coerce
      .number()
      .int()
      .min(DASHBOARD_LIMITS.MIN_LIMIT)
      .max(DASHBOARD_LIMITS.MAX_RECENT_LIMIT)
      .default(DASHBOARD_DEFAULTS.RECENT_LIMIT),
  }),
});

export const managerDashboardSchema = z.object({
  query: z.object({
    upcomingDays: z.coerce
      .number()
      .int()
      .min(DASHBOARD_LIMITS.MIN_UPCOMING_DAYS)
      .max(DASHBOARD_LIMITS.MAX_UPCOMING_DAYS)
      .default(DASHBOARD_DEFAULTS.UPCOMING_DAYS),

    limit: z.coerce
      .number()
      .int()
      .min(DASHBOARD_LIMITS.MIN_LIMIT)
      .max(DASHBOARD_LIMITS.MAX_LIST_LIMIT)
      .default(DASHBOARD_DEFAULTS.LIST_LIMIT),
  }),
});

export const employeeDashboardSchema = z.object({
  query: z.object({
    upcomingDays: z.coerce
      .number()
      .int()
      .min(DASHBOARD_LIMITS.MIN_UPCOMING_DAYS)
      .max(DASHBOARD_LIMITS.MAX_UPCOMING_DAYS)
      .default(DASHBOARD_DEFAULTS.UPCOMING_DAYS),

    limit: z.coerce
      .number()
      .int()
      .min(DASHBOARD_LIMITS.MIN_LIMIT)
      .max(DASHBOARD_LIMITS.MAX_LIST_LIMIT)
      .default(DASHBOARD_DEFAULTS.LIST_LIMIT),
  }),
});
