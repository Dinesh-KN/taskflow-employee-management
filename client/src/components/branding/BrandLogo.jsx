import { ListChecks } from 'lucide-react';
import { Link } from 'react-router-dom';

import { cn } from '@/lib/utils';

export const BrandMark = ({ className, iconClassName }) => {
  return (
    <span
      className={cn(
        'grid size-10 shrink-0 place-items-center rounded-xl',
        'bg-primary text-primary-foreground shadow-sm',
        className,
      )}
    >
      <ListChecks className={cn('size-5', iconClassName)} aria-hidden="true" />
    </span>
  );
};

const BrandLogo = ({
  className,
  labelClassName,
  showLabel = true,
  to = '/',
}) => {
  return (
    <Link
      to={to}
      aria-label="TaskFlow home"
      className={cn(
        'inline-flex items-center gap-2.5 rounded-md',
        'focus-visible:ring-2 focus-visible:outline-none',
        'focus-visible:ring-ring focus-visible:ring-offset-2',
        className,
      )}
    >
      <BrandMark />

      {showLabel ? (
        <span
          className={cn(
            'text-foreground text-lg font-bold tracking-tight',
            labelClassName,
          )}
        >
          TaskFlow
        </span>
      ) : null}
    </Link>
  );
};

export default BrandLogo;
