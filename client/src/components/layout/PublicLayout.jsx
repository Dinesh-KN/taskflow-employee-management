import { Outlet } from 'react-router-dom';

import PublicFooter from '@/components/layout/PublicFooter';
import PublicNavbar from '@/components/layout/PublicNavbar';

const PublicLayout = () => {
  return (
    <div className="relative isolate flex min-h-screen flex-col overflow-x-clip bg-background text-foreground">
      <div
        className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
        aria-hidden="true"
      >
        <div className="absolute -top-40 -left-32 size-120 rounded-full bg-primary/10 blur-3xl" />

        <div className="absolute top-1/3 -right-48 size-128 rounded-full bg-primary/10 blur-3xl" />

        <div className="absolute -bottom-56 left-1/3 size-120 rounded-full bg-muted blur-3xl" />

        <div className="absolute inset-0 bg-[linear-gradient(to_right,var(--border)_1px,transparent_1px),linear-gradient(to_bottom,var(--border)_1px,transparent_1px)] bg-size-[64px_64px] opacity-[0.08]" />
      </div>

      <PublicNavbar />

      <main className="relative z-10 flex flex-1">
        <Outlet />
      </main>

      <PublicFooter />
    </div>
  );
};

export default PublicLayout;
