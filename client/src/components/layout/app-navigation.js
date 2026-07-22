import { FolderKanban, LayoutDashboard, ListTodo, Users } from 'lucide-react';

import { ROUTES } from '@/constants/route.constants';
import { USER_ROLES } from '@/constants/role.constants';

export const APP_NAVIGATION = [
  {
    label: 'Dashboard',
    href: ROUTES.DASHBOARD,
    icon: LayoutDashboard,
    allowedRoles: [USER_ROLES.ADMIN, USER_ROLES.MANAGER, USER_ROLES.EMPLOYEE],
  },
  {
    label: 'Projects',
    href: ROUTES.PROJECTS,
    icon: FolderKanban,
    allowedRoles: [USER_ROLES.ADMIN, USER_ROLES.MANAGER, USER_ROLES.EMPLOYEE],
  },
  {
    label: 'Tasks',
    href: ROUTES.TASKS,
    icon: ListTodo,
    allowedRoles: [USER_ROLES.ADMIN, USER_ROLES.MANAGER, USER_ROLES.EMPLOYEE],
  },
  {
    label: 'Users',
    href: ROUTES.USERS,
    icon: Users,
    allowedRoles: [USER_ROLES.ADMIN],
  },
];

export const getNavigationByRole = (role) => {
  return APP_NAVIGATION.filter((item) => item.allowedRoles.includes(role));
};
