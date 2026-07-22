import { PanelLeft } from 'lucide-react';
import { NavLink } from 'react-router-dom';

import { selectMobileSidebarOpen } from '@/app/app.selectors';
import { closeMobileSidebar } from '@/app/app.slice';
import BrandLogo from '@/components/branding/BrandLogo';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { ROUTES } from '@/constants/route.constants';
import { selectUserRole } from '@/features/auth/auth.selectors';
import { useAppDispatch, useAppSelector } from '@/hooks/use-redux';
import { cn } from '@/lib/utils';

import UserMenu from './UserMenu';
import { getNavigationByRole } from './app-navigation';

const MobileSidebar = () => {
  const dispatch = useAppDispatch();

  const open = useAppSelector(selectMobileSidebarOpen);
  const userRole = useAppSelector(selectUserRole);

  const navigationItems = getNavigationByRole(userRole);

  const handleOpenChange = (nextOpen) => {
    if (!nextOpen) {
      dispatch(closeMobileSidebar());
    }
  };

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetContent
        side="left"
        showCloseButton={false}
        className="gap-0 border-0 p-0 shadow-xl data-[side=left]:w-[min(88vw,260px)] data-[side=left]:sm:max-w-none"
      >
        <SheetHeader className="sr-only">
          <SheetTitle>Navigation menu</SheetTitle>
        </SheetHeader>

        <div className="flex h-full flex-col bg-sidebar text-sidebar-foreground">
          <div className="flex h-14 shrink-0 items-center justify-between px-3">
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
              onClick={() => dispatch(closeMobileSidebar())}
              aria-label="Close sidebar"
              title="Close sidebar"
            >
              <PanelLeft className="size-4.75" aria-hidden="true" />
            </Button>
          </div>

          <nav className="min-h-0 flex-1 space-y-0.5 overflow-y-auto px-2 py-2">
            {navigationItems.map((item) => {
              const Icon = item.icon;

              return (
                <NavLink
                  key={item.href}
                  to={item.href}
                  onClick={() => dispatch(closeMobileSidebar())}
                  className={({ isActive }) =>
                    cn(
                      'flex h-10 items-center gap-3 rounded-lg px-2.5 text-sm font-normal',
                      'transition-colors duration-150',
                      'hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
                      isActive
                        ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                        : 'text-sidebar-foreground/80',
                    )
                  }
                >
                  <Icon className="size-4.5 shrink-0" aria-hidden="true" />
                  <span className="truncate">{item.label}</span>
                </NavLink>
              );
            })}
          </nav>

          <div className="mt-auto shrink-0 p-2">
            <UserMenu mobile />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MobileSidebar;
