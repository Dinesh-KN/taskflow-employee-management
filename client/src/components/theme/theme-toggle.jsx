import { useRef } from 'react';
import { flushSync } from 'react-dom';
import { Moon, Sun } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { THEME } from '@/constants/theme.constants';

import { useTheme } from './theme-context';
import './theme-transition.css';

const TRANSITION_DURATION_MS = 450;
const TRANSITION_EASING = 'cubic-bezier(0.4, 0, 0.2, 1)';

function getMaximumRadius(x, y) {
  const farthestHorizontalEdge = Math.max(x, window.innerWidth - x);
  const farthestVerticalEdge = Math.max(y, window.innerHeight - y);

  return Math.hypot(farthestHorizontalEdge, farthestVerticalEdge);
}

export function ModeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const isTransitioningRef = useRef(false);

  const isDark = resolvedTheme === THEME.DARK;
  const nextTheme = isDark ? THEME.LIGHT : THEME.DARK;
  const nextThemeLabel = nextTheme === THEME.DARK ? 'dark' : 'light';

  const toggleTheme = async (event) => {
    if (isTransitioningRef.current) {
      return;
    }

    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;

    if (!document.startViewTransition || prefersReducedMotion) {
      setTheme(nextTheme);
      return;
    }

    isTransitioningRef.current = true;

    const buttonRect = event.currentTarget.getBoundingClientRect();
    const originX = buttonRect.left + buttonRect.width / 2;
    const originY = buttonRect.top + buttonRect.height / 2;
    const maximumRadius = getMaximumRadius(originX, originY);

    try {
      const transition = document.startViewTransition(() => {
        // Force React and the root theme class to update inside the snapshot.
        flushSync(() => {
          setTheme(nextTheme);
        });
      });

      await transition.ready;

      document.documentElement.animate(
        {
          clipPath: [
            `circle(0px at ${originX}px ${originY}px)`,
            `circle(${maximumRadius}px at ${originX}px ${originY}px)`,
          ],
        },
        {
          duration: TRANSITION_DURATION_MS,
          easing: TRANSITION_EASING,
          pseudoElement: '::view-transition-new(root)',
        },
      );

      await transition.finished;
    } catch {
      // Fallback if the transition is interrupted or unsupported at runtime.
      setTheme(nextTheme);
    } finally {
      isTransitioningRef.current = false;
    }
  };

  return (
    <Button
      type="button"
      variant="outline"
      size="icon"
      aria-label={`Switch to ${nextThemeLabel} theme`}
      title={`Switch to ${nextThemeLabel} theme`}
      onClick={toggleTheme}
      className="relative rounded-full"
    >
      <Sun className="size-4 rotate-0 scale-100 transition-all duration-300 motion-reduce:transition-none dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute inset-0 m-auto size-4 rotate-90 scale-0 transition-all duration-300 motion-reduce:transition-none dark:rotate-0 dark:scale-100" />
    </Button>
  );
}
