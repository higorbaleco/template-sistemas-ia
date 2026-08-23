import { Moon } from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';

export function ThemeToggle() {
  const { toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-lg border border-border bg-card hover:bg-card/80 transition-colors inline-flex items-center gap-2"
      title="Toggle dark mode"
      aria-label="Toggle theme"
    >
      <Moon className="w-4 h-4" />
      <span className="text-sm font-medium text-muted-foreground hidden sm:inline">Dark</span>
    </button>
  );
}
