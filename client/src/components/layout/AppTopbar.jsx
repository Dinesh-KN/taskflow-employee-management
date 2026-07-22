import { PanelLeft } from 'lucide-react';
import { useLocation } from 'react-router-dom';

import { openMobileSidebar } from '@/app/app.slice';
import { ModeToggle } from '@/components/theme/theme-toggle';
import { Button } from '@/components/ui/button';
import { useAppDispatch } from '@/hooks/use-redux';
import { getRouteMeta } from '@/utils/route.utils';

const AppTopbar = () => {
  const dispatch = useAppDispatch();
  const location = useLocation();

  const routeMeta = getRouteMeta(location.pathname);

  return (
    <header
      className={[
        'sticky top-0 z-30 flex h-16 shrink-0 items-center gap-3',
        'border-b border-border/60',
        'bg-background/95 px-4 backdrop-blur',
        'supports-backdrop-filter:bg-background/80',
        'sm:px-6',
      ].join(' ')}
    >
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="size-9 shrink-0 rounded-lg lg:hidden"
        onClick={() => dispatch(openMobileSidebar())}
        aria-label="Open sidebar"
        title="Open sidebar"
      >
        <PanelLeft className="size-5" aria-hidden="true" />
      </Button>

      <div className="min-w-0 flex-1">
        <h1 className="truncate text-base font-semibold tracking-tight sm:text-lg">
          {routeMeta.title}
        </h1>

        {/* <p className="hidden truncate text-sm text-muted-foreground sm:block">
          {routeMeta.description}
        </p> */}
      </div>

      <div className="flex shrink-0 items-center">
        <ModeToggle
          variant="ghost"
          className={[
            'size-9 rounded-lg',
            'border border-border/60 bg-background shadow-none',
            'hover:bg-muted',
          ].join(' ')}
        />
      </div>
    </header>
  );
};

export default AppTopbar;
