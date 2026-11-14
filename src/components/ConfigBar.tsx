import { Clock, Globe, Hash, PenLine, Type } from 'lucide-react';
import { useState } from 'react';
import { LANGUAGES } from '../data/languages';
import { LanguageId } from '../types/typing';

interface ConfigBarProps {
  languageId: LanguageId;
  onSelectLanguage: (id: LanguageId) => void;
  durationSeconds: number;
  onSelectDuration: (seconds: number) => void;
  includePunctuation: boolean;
  onTogglePunctuation: () => void;
  includeNumbers: boolean;
  onToggleNumbers: () => void;
  onOpenCustomText: () => void;
  disabled: boolean;
  isTypingActive: boolean;
}

const DURATION_PRESETS: { seconds: number; label: string }[] = [
  { seconds: 15, label: '15s' },
  { seconds: 30, label: '30s' },
  { seconds: 60, label: '1 min' },
  { seconds: 120, label: '2 min' },
  { seconds: 180, label: '3 min' },
  { seconds: 300, label: '5 min' },
];

export function ConfigBar({
  languageId,
  onSelectLanguage,
  durationSeconds,
  onSelectDuration,
  includePunctuation,
  onTogglePunctuation,
  includeNumbers,
  onToggleNumbers,
  onOpenCustomText,
  disabled,
  isTypingActive,
}: ConfigBarProps) {
  const [showCustomMinutes, setShowCustomMinutes] = useState(false);
  const [minutesInput, setMinutesInput] = useState(() =>
    String(Math.max(1, Math.round(durationSeconds / 60)))
  );

  const isPreset = DURATION_PRESETS.some((p) => p.seconds === durationSeconds);

  const handleApplyCustomMinutes = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = parseFloat(minutesInput.replace(',', '.'));
    if (!Number.isNaN(parsed) && parsed > 0 && parsed <= 60) {
      const secs = Math.max(10, Math.round(parsed * 60));
      onSelectDuration(secs);
      setShowCustomMinutes(false);
    }
  };

  return (
    <div
      className={`mx-auto w-full max-w-5xl transition-opacity duration-200 ${
        isTypingActive ? 'opacity-20 pointer-events-none' : 'opacity-100'
      }`}
    >
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-900/70 px-4 py-2.5">
        {/* Modifiers: Punctuation & Numbers */}
        <div className="flex items-center gap-1">
          <button
            type="button"
            disabled={disabled || languageId === 'custom'}
            onClick={onTogglePunctuation}
            title="Tinish belgilarini qo'shish"
            className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed ${
              includePunctuation && languageId !== 'custom'
                ? 'bg-amber-500/15 text-amber-800 dark:text-amber-300'
                : 'text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200'
            }`}
          >
            <Type className="h-3.5 w-3.5" aria-hidden="true" />
            <span>Tinish belgilari</span>
          </button>

          <button
            type="button"
            disabled={disabled || languageId === 'custom'}
            onClick={onToggleNumbers}
            title="Raqamlarni qo'shish"
            className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed ${
              includeNumbers && languageId !== 'custom'
                ? 'bg-amber-500/15 text-amber-800 dark:text-amber-300'
                : 'text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200'
            }`}
          >
            <Hash className="h-3.5 w-3.5" aria-hidden="true" />
            <span>Raqamlar</span>
          </button>
        </div>

        <div
          aria-hidden="true"
          className="hidden h-5 w-px bg-zinc-200 dark:bg-zinc-800 md:block"
        />

        {/* Language Selector */}
        <div className="flex items-center gap-2">
          <Globe
            className="h-3.5 w-3.5 text-zinc-500 dark:text-zinc-400 shrink-0"
            aria-hidden="true"
          />
          <label htmlFor="typing-language-select" className="sr-only">
            Yozish tili
          </label>
          <select
            id="typing-language-select"
            value={languageId}
            disabled={disabled}
            onChange={(e) => {
              const val = e.target.value as LanguageId;
              if (val === 'custom') {
                onOpenCustomText();
              } else {
                onSelectLanguage(val);
              }
            }}
            className="rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 px-2.5 py-1.5 text-xs font-semibold text-zinc-800 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-amber-500 cursor-pointer"
          >
            {LANGUAGES.map((lang) => (
              <option key={lang.id} value={lang.id}>
                {lang.label}
              </option>
            ))}
            <option value="custom">O‘z matningiz (Istalgan til)</option>
          </select>

          <button
            type="button"
            onClick={onOpenCustomText}
            disabled={disabled}
            title="Istalgan tilda o'z matningizni kiriting"
            className={`inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              languageId === 'custom'
                ? 'bg-amber-500/15 text-amber-800 dark:text-amber-300'
                : 'text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100'
            }`}
          >
            <PenLine className="h-3.5 w-3.5" aria-hidden="true" />
            <span>Matn kiritish</span>
          </button>
        </div>

        <div
          aria-hidden="true"
          className="hidden h-5 w-px bg-zinc-200 dark:bg-zinc-800 md:block"
        />

        {/* Duration Selector (Seconds & Minutes) */}
        <div className="flex flex-wrap items-center gap-1">
          <Clock
            className="mr-1 h-3.5 w-3.5 text-zinc-500 dark:text-zinc-400 shrink-0"
            aria-hidden="true"
          />
          {DURATION_PRESETS.map((preset) => {
            const active = durationSeconds === preset.seconds && !showCustomMinutes;
            return (
              <button
                key={preset.seconds}
                type="button"
                disabled={disabled}
                onClick={() => {
                  setShowCustomMinutes(false);
                  onSelectDuration(preset.seconds);
                }}
                className={`rounded-lg px-2.5 py-1.5 text-xs font-semibold tabular-nums transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  active
                    ? 'bg-amber-600 text-white dark:bg-amber-500 dark:text-zinc-950'
                    : 'text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100'
                }`}
              >
                {preset.label}
              </button>
            );
          })}

          <button
            type="button"
            disabled={disabled}
            onClick={() => {
              setMinutesInput(String(Math.max(1, Math.round(durationSeconds / 60))));
              setShowCustomMinutes((prev) => !prev);
            }}
            className={`rounded-lg px-2.5 py-1.5 text-xs font-semibold tabular-nums transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              !isPreset || showCustomMinutes
                ? 'bg-amber-600 text-white dark:bg-amber-500 dark:text-zinc-950'
                : 'text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100'
            }`}
          >
            {!isPreset
              ? `${Number((durationSeconds / 60).toFixed(1))} min`
              : 'Minut belgilash'}
          </button>
        </div>
      </div>

      {/* Inline Custom Minutes Picker */}
      {showCustomMinutes && (
        <form
          onSubmit={handleApplyCustomMinutes}
          className="mt-2 flex flex-wrap items-center justify-end gap-2 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-4 py-2.5"
        >
          <label
            htmlFor="custom-minutes-input"
            className="text-xs font-medium text-zinc-700 dark:text-zinc-300"
          >
            Mashq davomiyligini daqiqada kiriting (0.5 – 60 min):
          </label>
          <input
            id="custom-minutes-input"
            type="number"
            min="0.5"
            max="60"
            step="0.5"
            value={minutesInput}
            onChange={(e) => setMinutesInput(e.target.value)}
            className="w-24 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 px-2.5 py-1 text-xs font-semibold tabular-nums text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
          <button
            type="submit"
            className="rounded-lg bg-amber-600 dark:bg-amber-500 px-3 py-1.5 text-xs font-semibold text-white dark:text-zinc-950 hover:bg-amber-700 dark:hover:bg-amber-400 transition-colors cursor-pointer"
          >
            Saqlash
          </button>
          <button
            type="button"
            onClick={() => setShowCustomMinutes(false)}
            className="rounded-lg px-2.5 py-1.5 text-xs font-medium text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 cursor-pointer"
          >
            Bekor qilish
          </button>
        </form>
      )}
    </div>
  );
}
