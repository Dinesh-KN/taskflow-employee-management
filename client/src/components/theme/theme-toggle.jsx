import { Laptop, Moon, Sun } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { THEME } from '@/constants/theme.constants';

import { useTheme } from './theme-context';

export function ModeToggle() {
  const { setTheme } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" aria-label="Toggle theme">
          <Sun className="size-4 scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
          <Moon className="absolute size-4 scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setTheme(THEME.LIGHT)}>
          <Sun className="mr-2 size-4" />
          Light
        </DropdownMenuItem>

        <DropdownMenuItem onClick={() => setTheme(THEME.DARK)}>
          <Moon className="mr-2 size-4" />
          Dark
        </DropdownMenuItem>

        <DropdownMenuItem onClick={() => setTheme(THEME.SYSTEM)}>
          <Laptop className="mr-2 size-4" />
          System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
