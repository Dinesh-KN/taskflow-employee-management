import BrandLogo from '@/components/branding/BrandLogo';
import { ROUTES } from '@/constants/route.constants';

const footerSections = [
  {
    title: 'Product',
    items: ['Projects', 'Tasks', 'Dashboard'],
  },
  {
    title: 'Resources',
    items: ['Documentation', 'Guides', 'Support'],
  },
  {
    title: 'Company',
    items: ['About', 'Contact', 'Security'],
  },
];

const legalItems = ['Terms of Service', 'Privacy Policy'];

const PublicFooter = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative z-20 w-full border-t border-border/60 bg-card/75 backdrop-blur-xl">
      <div className="mx-auto w-full px-5 py-7 sm:px-8 sm:py-9 lg:px-12 lg:py-10 xl:px-16">
        {/* Main footer content */}
        <div className="grid gap-9 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1.6fr)] lg:gap-16">
          {/* Brand */}
          <div className="mx-auto flex max-w-md flex-col items-center space-y-4 text-center sm:mx-0 sm:items-start sm:text-left">
            <BrandLogo to={ROUTES.LOGIN} />

            <p className="text-sm leading-6 text-muted-foreground">
              TaskFlow helps teams organize projects, manage tasks, and keep
              work moving with clarity and accountability.
            </p>
          </div>

          {/* Navigation sections */}
          <nav
            aria-label="Footer navigation"
            className="hidden gap-x-8 gap-y-8 sm:grid sm:grid-cols-3"
          >
            {footerSections.map(({ items, title }) => (
              <section key={title} className="min-w-0 space-y-3">
                <h2 className="text-sm font-semibold text-foreground">
                  {title}
                </h2>

                <ul className="space-y-2.5 text-sm text-muted-foreground">
                  {items.map((item) => (
                    <li key={item}>
                      <span className="transition-colors hover:text-foreground">
                        {item}
                      </span>
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </nav>
        </div>

        {/* Legal section */}
        <div className="mt-8 flex flex-col items-center gap-3 border-t border-border/60 pt-5 text-center text-xs text-muted-foreground sm:flex-row sm:justify-between sm:text-left">
          <p>© {currentYear} TaskFlow. All rights reserved.</p>

          <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 sm:justify-end">
            {legalItems.map((item) => (
              <span
                key={item}
                className="transition-colors hover:text-foreground"
              >
                {item}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default PublicFooter;
