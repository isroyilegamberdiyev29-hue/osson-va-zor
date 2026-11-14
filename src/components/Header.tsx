import { Moon, Sun } from 'lucide-react';
import { AppView, ThemeMode } from '../types/typing';

interface HeaderProps {
  activeView: AppView;
  onChangeView: (view: AppView) => void;
  theme: ThemeMode;
  onToggleTheme: () => void;
  isTypingActive: boolean;
}

export function Header({
  activeView,
  onChangeView,
  theme,
  onToggleTheme,
  isTypingActive,
}: HeaderProps) {
  const navItems: { id: AppView; label: string }[] = [
    { id: 'practice', label: 'Mashq' },
    { id: 'history', label: 'Natijalar' },
    { id: 'guide', label: 'Qo‘llanma' },
  ];

  return (
    <header
      className={`w-full border-b border-zinc-200 dark:border-zinc-800/80 transition-opacity duration-200 ${
        isTypingActive ? 'opacity-25 hover:opacity-100' : 'opacity-100'
      }`}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-8 px-6 py-4">
        {/* Zone 1: Single-element brand wordmark */}
        <button
          type="button"
          onClick={() => onChangeView('practice')}
          className="text-left text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 rounded"
        >
          TezYoz
        </button>

        {/* Zone 2: Clean single-line text navigation */}
        <nav
          aria-label="Asosiy menyu"
          className="flex items-center gap-6 sm:gap-8"
        >
          {navItems.map((item) => {
            const isActive = activeView === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onChangeView(item.id)}
                className={`relative py-1 text-sm font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 rounded ${
                  isActive
                    ? 'text-amber-700 dark:text-amber-400'
                    : 'text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100'
                }`}
              >
                {item.label}
                {isActive && (
                  <span
                    aria-hidden="true"
                    className="absolute inset-x-0 -bottom-1 h-0.5 rounded-full bg-amber-600 dark:bg-amber-400"
                  />
                )}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: 1 primary action (Theme Switcher) */}
        <div className="flex items-center shrink-0">
          <button
            type="button"
            onClick={onToggleTheme}
            aria-label={
              theme === 'dark' ? "Yorug' rejimga o'tish" : "Qorong'u rejimga o'tish"
            }
            className="inline-flex items-center gap-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800/70 px-3.5 py-2 text-xs font-semibold text-zinc-800 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
          >
            {theme === 'dark' ? (
              <>
                <Sun className="h-3.5 w-3.5 text-amber-400" aria-hidden="true" />
                <span>Yorug‘ rejim</span>
              </>
            ) : (
              <>
                <Moon className="h-3.5 w-3.5 text-amber-700" aria-hidden="true" />
                <span>Qorong‘u rejim</span>
              </>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
