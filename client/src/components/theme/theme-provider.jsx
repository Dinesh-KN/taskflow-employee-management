import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useState,
} from 'react';

import { THEME, THEME_STORAGE_KEY } from '@/constants/theme.constants';

import { ThemeProviderContext } from './theme-context';

const SYSTEM_THEME_QUERY = '(prefers-color-scheme: dark)';
const VALID_THEMES = new Set(Object.values(THEME));

function getSystemTheme() {
  if (typeof window === 'undefined') {
    return THEME.LIGHT;
  }

  return window.matchMedia(SYSTEM_THEME_QUERY).matches
    ? THEME.DARK
    : THEME.LIGHT;
}

function getInitialTheme(storageKey, defaultTheme) {
  if (typeof window === 'undefined') {
    return defaultTheme;
  }

  try {
    const storedTheme = window.localStorage.getItem(storageKey);

    return VALID_THEMES.has(storedTheme) ? storedTheme : defaultTheme;
  } catch {
    // localStorage may be unavailable in restricted browser contexts.
    return defaultTheme;
  }
}

function applyThemeToDocument(resolvedTheme) {
  if (typeof document === 'undefined') {
    return;
  }

  const root = document.documentElement;

  root.classList.remove(THEME.LIGHT, THEME.DARK);
  root.classList.add(resolvedTheme);
  root.style.colorScheme = resolvedTheme;
}

export function ThemeProvider({
  children,
  defaultTheme = THEME.SYSTEM,
  storageKey = THEME_STORAGE_KEY,
}) {
  const [theme, setThemeState] = useState(() =>
    getInitialTheme(storageKey, defaultTheme),
  );
  const [systemTheme, setSystemTheme] = useState(getSystemTheme);

  const resolvedTheme = theme === THEME.SYSTEM ? systemTheme : theme;

  // Apply the resolved theme before the browser paints the updated UI.
  useLayoutEffect(() => {
    applyThemeToDocument(resolvedTheme);
  }, [resolvedTheme]);

  // Keep system mode synchronized when the OS preference changes.
  useEffect(() => {
    const mediaQuery = window.matchMedia(SYSTEM_THEME_QUERY);

    const handleSystemThemeChange = (event) => {
      setSystemTheme(event.matches ? THEME.DARK : THEME.LIGHT);
    };

    mediaQuery.addEventListener('change', handleSystemThemeChange);

    return () => {
      mediaQuery.removeEventListener('change', handleSystemThemeChange);
    };
  }, []);

  const setTheme = useCallback(
    (newTheme) => {
      if (!VALID_THEMES.has(newTheme)) {
        console.error(`Unsupported theme: ${newTheme}`);
        return;
      }

      try {
        window.localStorage.setItem(storageKey, newTheme);
      } catch {
        // The theme still works for the current session.
      }

      const nextResolvedTheme =
        newTheme === THEME.SYSTEM ? getSystemTheme() : newTheme;

      // Apply immediately so the View Transition API captures the new theme.
      applyThemeToDocument(nextResolvedTheme);
      setThemeState(newTheme);
    },
    [storageKey],
  );

  const value = useMemo(
    () => ({
      theme,
      resolvedTheme,
      setTheme,
    }),
    [theme, resolvedTheme, setTheme],
  );

  return (
    <ThemeProviderContext.Provider value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}
