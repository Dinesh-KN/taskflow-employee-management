import {
  ChartNoAxesCombined,
  FolderKanban,
  ListChecks,
  ShieldCheck,
  UsersRound,
} from 'lucide-react';

import LoginForm from '@/features/auth/components/LoginForm';

const workspaceFeatures = [
  {
    title: 'Projects',
    description: 'Organize deliverables, members, and project progress.',
    icon: FolderKanban,
  },
  {
    title: 'Tasks',
    description: 'Assign responsibilities and track work through completion.',
    icon: ListChecks,
  },
  {
    title: 'Teams',
    description:
      'Maintain clear ownership across every level of the workspace.',
    icon: UsersRound,
  },
];

const LoginPage = () => {
  return (
    <section className="grid w-full flex-1 lg:grid-cols-[minmax(0,3fr)_minmax(380px,2fr)] xl:grid-cols-[minmax(0,2fr)_minmax(400px,1fr)]">
      {/* Information section */}
      <aside className="relative isolate flex min-h-135 flex-col overflow-hidden border-b border-border/60 bg-muted/30 px-6 py-10 sm:px-10 sm:py-12 lg:min-h-0 lg:border-r lg:border-b-0 lg:px-12 lg:py-14 xl:px-16">
        {/* Decorative background */}
        <div
          className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
          aria-hidden="true"
        >
          <div className="absolute -top-40 -left-32 size-120 rounded-full bg-primary/10 blur-3xl" />

          <div className="absolute top-1/4 -right-52 size-136 rounded-full bg-primary/5 blur-3xl" />

          <div className="absolute -bottom-52 left-1/3 size-128 rounded-full bg-muted-foreground/5 blur-3xl" />

          <div className="absolute inset-0 bg-[linear-gradient(to_right,var(--border)_1px,transparent_1px),linear-gradient(to_bottom,var(--border)_1px,transparent_1px)] bg-size-[64px_64px] opacity-[0.12]" />

          <div className="absolute inset-0 bg-linear-to-br from-background/10 via-transparent to-background/40" />
        </div>

        {/* Top label */}
        <div className="inline-flex w-fit items-center gap-2 rounded-full border border-border/70 bg-background/70 px-3 py-1.5 text-xs font-medium text-muted-foreground shadow-sm backdrop-blur-sm">
          <ChartNoAxesCombined
            className="size-3.5 text-primary"
            aria-hidden="true"
          />
          Employee task management
        </div>

        {/* Main message */}
        <div className="my-auto max-w-3xl py-14 lg:py-16 xl:py-20">
          <p className="mb-5 text-sm font-medium text-primary">
            Clear work. Clear ownership. Better delivery.
          </p>

          <h1 className="max-w-3xl text-4xl font-semibold leading-[1.08] tracking-tight text-balance sm:text-5xl xl:text-6xl">
            Keep projects, tasks, and teams moving in one direction.
          </h1>

          <p className="mt-6 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg sm:leading-8">
            TaskFlow provides a structured workspace for assigning work,
            tracking progress, and maintaining accountability across your
            organization.
          </p>

          <div className="mt-8 flex max-w-2xl items-start gap-3">
            <ShieldCheck
              className="mt-0.5 size-5 shrink-0 text-primary"
              aria-hidden="true"
            />

            <p className="text-sm leading-6 text-muted-foreground">
              Secure role-based access for administrators, managers, and
              employees.
            </p>
          </div>
        </div>

        {/* Feature row */}
        <div className="grid border-y border-border/60 sm:grid-cols-3 sm:divide-x sm:divide-border/60">
          {workspaceFeatures.map(({ description, icon: Icon, title }) => (
            <article
              key={title}
              className="border-b border-border/60 py-5 last:border-b-0 sm:border-b-0 sm:px-5 sm:first:pl-0 sm:last:pr-0"
            >
              <div className="mb-4 grid size-9 place-items-center rounded-xl border border-border/70 bg-background/70 text-primary shadow-sm">
                <Icon className="size-4" aria-hidden="true" />
              </div>

              <h2 className="text-sm font-semibold text-foreground">{title}</h2>

              <p className="mt-1.5 max-w-xs text-xs leading-5 text-muted-foreground">
                {description}
              </p>
            </article>
          ))}
        </div>
      </aside>

      {/* Login section */}
      <div className="flex min-h-140 items-center justify-center bg-background px-6 py-12 sm:px-10 lg:min-h-0 lg:px-12 xl:px-14">
        <div className="w-full max-w-105">
          <LoginForm />
        </div>
      </div>
    </section>
  );
};

export default LoginPage;
