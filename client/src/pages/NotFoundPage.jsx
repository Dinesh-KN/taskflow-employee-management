import { Link } from 'react-router-dom';

import { Button } from '@/components/ui/button';
import { ROUTES } from '@/constants/route.constants';

const NotFoundPage = () => {
  return (
    <main className="bg-background flex min-h-svh items-center justify-center px-4">
      <section className="max-w-md text-center">
        <p className="text-muted-foreground text-sm font-medium">404</p>

        <h1 className="mt-3 text-3xl font-semibold tracking-tight">
          Page not found
        </h1>

        <p className="text-muted-foreground mt-3 text-sm">
          The page you are looking for does not exist or has been moved.
        </p>

        <Button asChild className="mt-6">
          <Link to={ROUTES.DASHBOARD}>Go to Dashboard</Link>
        </Button>
      </section>
    </main>
  );
};

export default NotFoundPage;
