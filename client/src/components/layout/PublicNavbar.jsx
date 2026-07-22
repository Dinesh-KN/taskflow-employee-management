import BrandLogo from '@/components/branding/BrandLogo';
import { ModeToggle } from '@/components/theme/theme-toggle';
import { ROUTES } from '@/constants/route.constants';

const navigationItems = [
  {
    label: 'Home',
    href: '#home',
  },
  {
    label: 'About',
    href: '#about',
  },
  {
    label: 'Contact',
    href: '#contact',
  },
];

const PublicNavbar = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/85 backdrop-blur-xl supports-backdrop-filter:bg-background/70">
      <div className="flex h-21 w-full items-center justify-between gap-6 px-6 sm:px-10 lg:px-12 xl:px-16">
        {/* Brand */}
        <BrandLogo to={ROUTES.LOGIN} />

        {/* Desktop navigation */}
        <nav
          aria-label="Public navigation"
          className="hidden items-center gap-1 md:flex"
        >
          {navigationItems.map(({ href, label }) => (
            <a
              key={label}
              href={href}
              className="rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted/60 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              {label}
            </a>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <div className="hidden items-center gap-2 text-xs font-medium text-muted-foreground lg:flex">
            <span className="relative flex size-2">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-primary/40" />

              <span className="relative inline-flex size-2 rounded-full bg-primary" />
            </span>
            Secure access
          </div>

          <div
            className="hidden h-5 w-px bg-border sm:block"
            aria-hidden="true"
          />

          <ModeToggle />
        </div>
      </div>
    </header>
  );
};

export default PublicNavbar;
