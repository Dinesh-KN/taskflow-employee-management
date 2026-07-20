import { LayoutDashboard, Moon, Sparkles, Sun } from 'lucide-react';

import { ModeToggle } from '@/components/theme/theme-toggle';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

function App() {
  return (
    <main className="bg-background text-foreground min-h-screen px-4 py-8 sm:px-6 lg:px-8">
      <section className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-6xl flex-col items-center justify-center gap-8 text-center">
        <div className="absolute top-4 right-4 sm:right-6 lg:right-8">
          <ModeToggle />
        </div>

        <Badge variant="secondary" className="rounded-full px-4 py-1">
          <Sparkles className="mr-1 size-3.5" />
          TaskFlow Frontend
        </Badge>

        <div className="space-y-4">
          <h1 className="text-4xl font-bold tracking-tight text-balance sm:text-5xl lg:text-6xl">
            Modern SaaS Dashboard UI
          </h1>

          <p className="text-muted-foreground mx-auto max-w-2xl text-base leading-7 text-pretty sm:text-lg">
            A polished React dashboard foundation with Tailwind CSS, shadcn/ui,
            responsive design, and production-ready light/dark mode.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3">
          <Button>
            <LayoutDashboard className="size-4" />
            Build Dashboard
          </Button>

          <Button variant="outline">
            <Sun className="size-4 dark:hidden" />
            <Moon className="hidden size-4 dark:block" />
            Theme Ready
          </Button>
        </div>

        <div className="grid w-full max-w-5xl gap-4 text-left md:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>Minimal UI</CardTitle>
              <CardDescription>
                Clean shadcn-style components with balanced spacing.
              </CardDescription>
            </CardHeader>
            <CardContent className="text-muted-foreground text-sm">
              Built for a professional SaaS dashboard experience.
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Dark Mode</CardTitle>
              <CardDescription>
                Class-based theme switching with saved preference.
              </CardDescription>
            </CardHeader>
            <CardContent className="text-muted-foreground text-sm">
              Supports light, dark, and system preference.
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Responsive</CardTitle>
              <CardDescription>
                Fluid spacing, scalable icons, and adaptive layouts.
              </CardDescription>
            </CardHeader>
            <CardContent className="text-muted-foreground text-sm">
              Ready for mobile, tablet, laptop, and desktop screens.
            </CardContent>
          </Card>
        </div>
      </section>
    </main>
  );
}

export default App;
