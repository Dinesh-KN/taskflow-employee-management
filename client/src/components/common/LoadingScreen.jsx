import { APP_NAME } from '@/constants/app.constants';

const LoadingScreen = () => {
  return (
    <main className="bg-background flex min-h-svh items-center justify-center px-4">
      <section className="flex flex-col items-center gap-4 text-center">
        <div className="bg-card grid size-12 place-items-center rounded-2xl border shadow-sm">
          <div className="border-muted border-t-foreground size-5 animate-spin rounded-full border-2" />
        </div>

        <div>
          <p className="text-foreground text-sm font-medium">{APP_NAME}</p>
          <p className="text-muted-foreground mt-1 text-sm">
            Preparing your workspace...
          </p>
        </div>
      </section>
    </main>
  );
};

export default LoadingScreen;
