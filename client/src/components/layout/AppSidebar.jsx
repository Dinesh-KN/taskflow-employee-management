import { useEffect } from 'react';
import { PanelLeft } from 'lucide-react';
import { NavLink } from 'react-router-dom';

import { selectSidebarCollapsed } from '@/app/app.selectors';
import { setSidebarCollapsed } from '@/app/app.slice';
import BrandLogo, { BrandMark } from '@/components/branding/BrandLogo';
import { Button } from '@/components/ui/button';
import { ROUTES } from '@/constants/route.constants';
import { selectUserRole } from '@/features/auth/auth.selectors';
import { useAppDispatch, useAppSelector } from '@/hooks/use-redux';
import { cn } from '@/lib/utils';

import UserMenu from './UserMenu';
import { getNavigationByRole } from './app-navigation';

const SIDEBAR_STORAGE_KEY = 'taskflow:sidebar-collapsed';

const AppSidebar = () => {
  const dispatch = useAppDispatch();

  const userRole = useAppSelector(selectUserRole);
  const sidebarCollapsed = useAppSelector(selectSidebarCollapsed);

  const navigationItems = getNavigationByRole(userRole);

  useEffect(() => {
    try {
      window.localStorage.setItem(
        SIDEBAR_STORAGE_KEY,
        String(sidebarCollapsed),
      );
    } catch {
      // The sidebar still works when browser storage is unavailable.
    }
  }, [sidebarCollapsed]);

  const expandSidebar = () => {
    dispatch(setSidebarCollapsed(false));
  };

  const collapseSidebar = () => {
    dispatch(setSidebarCollapsed(true));
  };

  return (
    <aside
      aria-label="Primary navigation"
      className={cn(
        'hidden h-svh shrink-0 overflow-hidden bg-sidebar text-sidebar-foreground lg:flex lg:flex-col',
        'transition-[width] duration-200 ease-out motion-reduce:transition-none',
        sidebarCollapsed ? 'w-17' : 'w-65',
      )}
    >
      <div
        className={cn(
          'flex h-16 shrink-0 items-center border-b border-border/60',
          sidebarCollapsed ? 'justify-center px-2' : 'justify-between px-3',
        )}
      >
        {sidebarCollapsed ? (
          <button
            type="button"
            onClick={expandSidebar}
            aria-label="Expand sidebar"
            title="Expand sidebar"
            className={cn(
              'group relative grid size-10 place-items-center rounded-lg',
              'transition-colors hover:bg-sidebar-accent',
              'focus-visible:ring-2 focus-visible:ring-sidebar-ring/50 focus-visible:outline-none',
            )}
          >
            <BrandMark
              className={cn(
                'size-8 rounded-lg shadow-none transition-opacity duration-150',
                'group-hover:opacity-0 group-focus-visible:opacity-0',
              )}
              iconClassName="size-[18px]"
            />

            <PanelLeft
              className={cn(
                'absolute size-5 opacity-0 transition-opacity duration-150',
                'group-hover:opacity-100 group-focus-visible:opacity-100',
              )}
              aria-hidden="true"
            />
          </button>
        ) : (
          <>
            <BrandLogo
              to={ROUTES.DASHBOARD}
              className="gap-2 px-1 py-1"
              markClassName="size-8 rounded-lg shadow-none"
              markIconClassName="size-[18px]"
              labelClassName="text-[15px] font-semibold"
            />

            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="size-9 rounded-lg text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground"
              onClick={collapseSidebar}
              aria-label="Collapse sidebar"
              title="Collapse sidebar"
            >
              <PanelLeft className="size-4.75" aria-hidden="true" />
            </Button>
          </>
        )}
      </div>

      <nav className="min-h-0 flex-1 space-y-0.5 overflow-y-auto px-2 py-2">
        {navigationItems.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.href}
              to={item.href}
              title={sidebarCollapsed ? item.label : undefined}
              aria-label={sidebarCollapsed ? item.label : undefined}
              className={({ isActive }) =>
                cn(
                  'group flex h-10 items-center gap-3 rounded-lg px-2.5 text-sm font-normal',
                  'transition-colors duration-150',
                  'hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
                  isActive
                    ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                    : 'text-sidebar-foreground/80',
                  sidebarCollapsed && 'justify-center px-0',
                )
              }
            >
              <Icon className="size-4.5 shrink-0" aria-hidden="true" />

              {!sidebarCollapsed ? (
                <span className="truncate">{item.label}</span>
              ) : null}
            </NavLink>
          );
        })}
      </nav>

      <div
        className={cn(
          'mt-auto shrink-0 px-2 pb-2 pt-1',
          sidebarCollapsed && 'flex justify-center',
        )}
      >
        <UserMenu collapsed={sidebarCollapsed} />
      </div>
    </aside>
  );
};

export default AppSidebar;
