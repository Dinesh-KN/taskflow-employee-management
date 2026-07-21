import { Outlet } from 'react-router-dom';

import { ModeToggle } from '@/components/theme/theme-toggle';

const RootLayout = () => {
  return (
    <div className="bg-background text-foreground relative min-h-screen">
      <div className="fixed top-4 right-4 z-50">
        <ModeToggle />
      </div>

      <Outlet />
    </div>
  );
};

export default RootLayout;
