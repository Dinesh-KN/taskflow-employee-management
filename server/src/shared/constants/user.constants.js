export const USER_ROLES = {
  ADMIN: 'admin',
  MANAGER: 'manager',
  EMPLOYEE: 'employee',
};

export const USER_ROLE_VALUES = Object.values(USER_ROLES);

export const USER_STATUS = {
  ACTIVE: 'active',
  SUSPENDED: 'suspended',
  ARCHIVED: 'archived',
};

export const USER_STATUS_VALUES = Object.values(USER_STATUS);

export const AVATAR_FIELD = 'avatar';

export const AVATAR_LIMITS = {
  FILE_SIZE: 2 * 1024 * 1024, // 2MB
};

export const AVATAR_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/avif',
];
