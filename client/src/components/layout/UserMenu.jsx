import { ChevronsUpDown, LogOut, UserCircle } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ROUTES } from '@/constants/route.constants';
import { USER_ROLE_LABELS } from '@/constants/role.constants';
import { selectAuthUser } from '@/features/auth/auth.selectors';
import { logoutUser } from '@/features/auth/auth.thunks';
import { useAppDispatch, useAppSelector } from '@/hooks/use-redux';
import { cn } from '@/lib/utils';

const UserMenu = ({ collapsed = false, mobile = false }) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const user = useAppSelector(selectAuthUser);

  const fullNameFromParts = [user?.firstName, user?.lastName]
    .filter(Boolean)
    .join(' ');

  const displayName =
    user?.fullName || fullNameFromParts || user?.email?.split('@')[0] || 'User';

  const displayEmail =
    user?.email || USER_ROLE_LABELS[user?.role] || 'TaskFlow member';

  const avatarUrl = user?.avatar?.url;

  const avatarInitials =
    user?.avatar?.initials ||
    displayName
      .split(/\s+/)
      .slice(0, 2)
      .map((part) => part.charAt(0))
      .join('')
      .toUpperCase() ||
    'U';

  const handleLogout = async () => {
    const result = await dispatch(logoutUser());

    if (logoutUser.rejected.match(result)) {
      toast.warning(
        'Signed out locally. The server session could not be closed.',
      );
    } else {
      toast.success('Logged out successfully');
    }

    navigate(ROUTES.LOGIN, {
      replace: true,
    });
  };

  /*
   * Expanded sidebar: menu opens above the user card.
   * Collapsed sidebar: menu opens toward the right.
   */
  const menuSide = collapsed && !mobile ? 'right' : 'top';
  const menuAlign = collapsed && !mobile ? 'end' : 'start';

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          aria-label={
            collapsed ? `Open account menu for ${displayName}` : undefined
          }
          title={collapsed ? displayName : undefined}
          className={cn(
            'group/account text-sidebar-foreground',
            collapsed
              ? [
                  /*
                   * 44px button centered within the 68px sidebar.
                   * The avatar is centered inside the button.
                   */
                  'mx-auto size-11 rounded-xl p-0',
                  'bg-transparent shadow-none',
                  'hover:bg-sidebar-accent hover:text-sidebar-foreground',
                  'data-[state=open]:bg-sidebar-accent',
                ]
              : [
                  'h-16 w-full justify-start gap-3 rounded-[14px] px-3 py-2',

                  // Light theme
                  'border border-black/10 bg-background/80',
                  'shadow-[0_1px_2px_rgba(0,0,0,0.04)]',
                  'hover:border-black/15 hover:bg-background',

                  // Dark theme
                  'dark:border-white/10 dark:bg-white/2.5',
                  'dark:hover:border-white/15 dark:hover:bg-white/4.5',

                  // Prevent shadcn's bright focus ring
                  'focus-visible:border-black/15 focus-visible:ring-0',
                  'dark:focus-visible:border-white/15',

                  // Dropdown-open state
                  'data-[state=open]:border-black/15',
                  'data-[state=open]:bg-background',
                  'dark:data-[state=open]:border-white/15',
                  'dark:data-[state=open]:bg-white/4.5',
                ],
          )}
        >
          <Avatar className={cn('shrink-0', collapsed ? 'size-9' : 'size-10')}>
            <AvatarImage src={avatarUrl} alt={displayName} />

            <AvatarFallback className="text-xs font-semibold">
              {avatarInitials}
            </AvatarFallback>
          </Avatar>

          {!collapsed ? (
            <>
              <div className="min-w-0 flex-1 text-left">
                <p className="truncate text-sm font-semibold leading-5">
                  {displayName}
                </p>

                <p className="truncate text-xs leading-4 text-sidebar-foreground/55">
                  {displayEmail}
                </p>
              </div>

              <ChevronsUpDown
                className={cn(
                  'size-4 shrink-0 text-sidebar-foreground/50',
                  'transition-colors',
                  'group-hover/account:text-sidebar-foreground/75',
                )}
                aria-hidden="true"
              />
            </>
          ) : null}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        side={menuSide}
        align={menuAlign}
        sideOffset={10}
        className={cn(
          'rounded-xl border border-border/70 p-1.5 shadow-xl',
          collapsed && !mobile && 'w-64',
        )}
      >
        <DropdownMenuLabel className="px-2 py-2 font-normal">
          <div className="flex items-center gap-3">
            <Avatar className="size-10 shrink-0">
              <AvatarImage src={avatarUrl} alt={displayName} />

              <AvatarFallback className="text-xs font-semibold">
                {avatarInitials}
              </AvatarFallback>
            </Avatar>

            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-popover-foreground">
                {displayName}
              </p>

              <p className="truncate text-xs text-muted-foreground">
                {displayEmail}
              </p>
            </div>
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        <DropdownMenuItem asChild className="h-9 gap-2 px-2.5">
          <Link to={ROUTES.PROFILE}>
            <UserCircle className="size-4.5" aria-hidden="true" />
            Profile
          </Link>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          variant="destructive"
          className="h-9 gap-2 px-2.5"
          onSelect={handleLogout}
        >
          <LogOut className="size-4.5" aria-hidden="true" />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserMenu;
