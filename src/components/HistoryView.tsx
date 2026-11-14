import { Trash2 } from 'lucide-react';
import { useMemo, useState } from 'react';
import { TestResult } from '../types/typing';
import { formatShortDuration } from '../utils/typingMetrics';

interface HistoryViewProps {
  history: TestResult[];
  onClearHistory: () => void;
  onStartPractice: () => void;
}

export function HistoryView({
  history,
  onClearHistory,
  onStartPractice,
}: HistoryViewProps) {
  const [languageFilter, setLanguageFilter] = useState<string>('all');
  const [confirmClear, setConfirmClear] = useState(false);

  const uniqueLanguages = useMemo(() => {
    const map = new Map<string, string>();
    history.forEach((item) => {
      map.set(item.languageId, item.languageLabel);
    });
    return Array.from(map.entries());
  }, [history]);

  const filtered = useMemo(() => {
    if (languageFilter === 'all') return history;
    return history.filter((item) => item.languageId === languageFilter);
  }, [history, languageFilter]);

  const summary = useMemo(() => {
    if (filtered.length === 0) {
      return { bestWpm: 0, avgWpm: 0, avgAccuracy: 0, totalErrors: 0 };
    }
    const bestWpm = Math.max(...filtered.map((h) => h.wpm));
    const avgWpm = Math.round(
      filtered.reduce((acc, h) => acc + h.wpm, 0) / filtered.length
    );
    const avgAccuracy = Math.round(
      filtered.reduce((acc, h) => acc + h.accuracy, 0) / filtered.length
    );
    const totalErrors = filtered.reduce((acc, h) => acc + h.errorCount, 0);
    return { bestWpm, avgWpm, avgAccuracy, totalErrors };
  }, [filtered]);

  if (history.length === 0) {
    return (
      <section className="mx-auto w-full max-w-4xl rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 p-10 text-center">
        <h1 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
          Hali saqlangan natijalar yo‘q
        </h1>
        <p className="mx-auto mt-2 max-w-md text-sm text-zinc-500 dark:text-zinc-400">
          Kamida bitta tez yozish mashqini yakunlaganingizdan so‘ng, barcha WPM,
          aniqlik va xatolik ko‘rsatkichlaringiz shu yerda saqlanadi.
        </p>
        <button
          type="button"
          onClick={onStartPractice}
          className="mt-6 inline-flex items-center rounded-xl bg-amber-600 dark:bg-amber-500 px-5 py-2.5 text-sm font-semibold text-white dark:text-zinc-950 hover:bg-amber-700 dark:hover:bg-amber-400 transition-colors cursor-pointer"
        >
          Mashqni boshlash
        </button>
      </section>
    );
  }

  return (
    <section
      aria-label="Natijalar tarixi"
      className="mx-auto w-full max-w-5xl space-y-6"
    >
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
            Natijalar tarixi
          </h1>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            Shaxsiy rekordlar va oxirgi mashqlar statistikasi
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {uniqueLanguages.length > 1 && (
            <select
              aria-label="Til bo'yicha saralash"
              value={languageFilter}
              onChange={(e) => setLanguageFilter(e.target.value)}
              className="rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 py-2 text-xs font-semibold text-zinc-800 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-amber-500 cursor-pointer"
            >
              <option value="all">Barcha tillar</option>
              {uniqueLanguages.map(([id, label]) => (
                <option key={id} value={id}>
                  {label}
                </option>
              ))}
            </select>
          )}

          {!confirmClear ? (
            <button
              type="button"
              onClick={() => setConfirmClear(true)}
              className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-3 py-2 text-xs font-semibold text-zinc-600 dark:text-zinc-400 hover:border-red-300 hover:text-red-600 dark:hover:border-red-900 dark:hover:text-red-400 transition-colors cursor-pointer"
            >
              <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
              <span>Tarixni tozalash</span>
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  onClearHistory();
                  setConfirmClear(false);
                }}
                className="rounded-lg bg-red-600 px-3 py-2 text-xs font-semibold text-white hover:bg-red-700 cursor-pointer"
              >
                Tasdiqlash
              </button>
              <button
                type="button"
                onClick={() => setConfirmClear(false)}
                className="rounded-lg px-2.5 py-2 text-xs font-medium text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 cursor-pointer"
              >
                Bekor
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Summary Metrics */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/70 px-5 py-4">
          <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
            Eng yuqori tezlik
          </p>
          <p className="mt-1 font-mono-typing text-3xl font-bold tabular-nums text-amber-700 dark:text-amber-400">
            {summary.bestWpm}{' '}
            <span className="text-xs font-normal text-zinc-500">WPM</span>
          </p>
        </div>

        <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/70 px-5 py-4">
          <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
            O‘rtacha tezlik
          </p>
          <p className="mt-1 font-mono-typing text-3xl font-bold tabular-nums text-zinc-900 dark:text-zinc-100">
            {summary.avgWpm}{' '}
            <span className="text-xs font-normal text-zinc-500">WPM</span>
          </p>
        </div>

        <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/70 px-5 py-4">
          <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
            O‘rtacha aniqlik
          </p>
          <p className="mt-1 font-mono-typing text-3xl font-bold tabular-nums text-emerald-700 dark:text-emerald-400">
            {summary.avgAccuracy}%
          </p>
        </div>

        <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/70 px-5 py-4">
          <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
            Jami mashqlar
          </p>
          <p className="mt-1 font-mono-typing text-3xl font-bold tabular-nums text-zinc-900 dark:text-zinc-100">
            {filtered.length}
          </p>
        </div>
      </div>

      {/* History Table */}
      <div className="overflow-x-auto rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-zinc-200 dark:border-zinc-800 text-xs font-semibold text-zinc-500 dark:text-zinc-400">
            <tr>
              <th className="px-5 py-3.5">Sana</th>
              <th className="px-5 py-3.5">Til</th>
              <th className="px-5 py-3.5">Vaqt</th>
              <th className="px-5 py-3.5 text-right">Tezlik (WPM)</th>
              <th className="px-5 py-3.5 text-right">Aniqlik</th>
              <th className="px-5 py-3.5 text-right">Xatoliklar</th>
              <th className="px-5 py-3.5 text-right">Barqarorlik</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-200/80 dark:divide-zinc-800/80">
            {filtered.map((item) => {
              const dateStr = new Date(item.timestamp).toLocaleString('uz-UZ', {
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              });
              return (
                <tr
                  key={item.id}
                  className="hover:bg-zinc-50 dark:hover:bg-zinc-800/40 transition-colors"
                >
                  <td className="px-5 py-3 text-xs text-zinc-600 dark:text-zinc-400 whitespace-nowrap">
                    {dateStr}
                  </td>
                  <td className="px-5 py-3 font-medium text-zinc-900 dark:text-zinc-100 whitespace-nowrap">
                    {item.languageLabel}
                  </td>
                  <td className="px-5 py-3 font-mono-typing text-xs tabular-nums text-zinc-600 dark:text-zinc-300 whitespace-nowrap">
                    {formatShortDuration(item.durationSeconds)}
                  </td>
                  <td className="px-5 py-3 text-right font-mono-typing font-bold tabular-nums text-amber-700 dark:text-amber-400">
                    {item.wpm}
                  </td>
                  <td className="px-5 py-3 text-right font-mono-typing font-semibold tabular-nums text-emerald-700 dark:text-emerald-400">
                    {item.accuracy}%
                  </td>
                  <td className="px-5 py-3 text-right font-mono-typing tabular-nums text-red-600 dark:text-red-400">
                    {item.errorCount}
                  </td>
                  <td className="px-5 py-3 text-right font-mono-typing tabular-nums text-zinc-600 dark:text-zinc-300">
                    {item.consistency}%
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}
