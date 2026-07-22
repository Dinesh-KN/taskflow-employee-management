import { Outlet } from 'react-router-dom';

import AppSidebar from './AppSidebar';
import AppTopbar from './AppTopbar';
import MobileSidebar from './MobileSidebar';

const AppLayout = () => {
  return (
    <div className="flex h-svh overflow-hidden bg-background text-foreground">
      <AppSidebar />
      <MobileSidebar />

      <div className="flex min-w-0 flex-1 flex-col bg-background">
        <AppTopbar />

        <main className="min-h-0 flex-1 overflow-y-auto">
          <div className="mx-auto w-full max-w-7xl px-4 pb-10 pt-4 sm:px-6 lg:px-8 lg:pt-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
