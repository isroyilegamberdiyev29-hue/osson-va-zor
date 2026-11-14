import { ArrowRight, History, RotateCcw } from 'lucide-react';
import { useState } from 'react';
import { SecondSnapshot, TestResult } from '../types/typing';
import { formatDurationLabel } from '../utils/typingMetrics';

interface ResultViewProps {
  result: TestResult;
  onNextTest: () => void;
  onRepeatSame: () => void;
  onOpenHistory: () => void;
}

function WpmTimelineChart({ snapshots }: { snapshots: SecondSnapshot[] }) {
  const [hoverIdx, setHoverIdx] = useState<number | null>(null);

  if (!snapshots || snapshots.length === 0) {
    return (
      <div className="flex h-52 items-center justify-center rounded-xl border border-zinc-200 dark:border-zinc-800 text-xs text-zinc-500 dark:text-zinc-400">
        Grafik uchun yetarli ma‘lumot to‘planmadi.
      </div>
    );
  }

  const width = 760;
  const height = 220;
  const padLeft = 42;
  const padRight = 18;
  const padTop = 20;
  const padBottom = 28;
  const chartW = width - padLeft - padRight;
  const chartH = height - padTop - padBottom;

  const maxVal = Math.max(
    40,
    ...snapshots.map((s) => Math.max(s.wpm, s.rawWpm))
  );
  const yMax = Math.ceil(maxVal / 20) * 20;

  const getX = (idx: number) => {
    if (snapshots.length === 1) return padLeft + chartW / 2;
    return padLeft + (idx / (snapshots.length - 1)) * chartW;
  };

  const getY = (val: number) => {
    return padTop + chartH - (val / yMax) * chartH;
  };

  const wpmPath = snapshots
    .map((s, i) => `${i === 0 ? 'M' : 'L'} ${getX(i)} ${getY(s.wpm)}`)
    .join(' ');

  const rawPath = snapshots
    .map((s, i) => `${i === 0 ? 'M' : 'L'} ${getX(i)} ${getY(s.rawWpm)}`)
    .join(' ');

  const areaPath = `${wpmPath} L ${getX(snapshots.length - 1)} ${
    padTop + chartH
  } L ${getX(0)} ${padTop + chartH} Z`;

  const yTicks = [0, Math.round(yMax * 0.25), Math.round(yMax * 0.5), Math.round(yMax * 0.75), yMax];

  const xLabelStep = Math.max(1, Math.ceil(snapshots.length / 8));

  const hovered = hoverIdx !== null ? snapshots[hoverIdx] : null;

  return (
    <div className="relative w-full">
      <div className="mb-2 flex flex-wrap items-center justify-between gap-2 text-xs text-zinc-500 dark:text-zinc-400">
        <span className="font-semibold text-zinc-700 dark:text-zinc-300">
          Vaqt bo‘yicha tezlik va xatoliklar dinamikasi
        </span>
        <div className="flex items-center gap-4">
          <span className="inline-flex items-center gap-1.5">
            <span className="h-0.5 w-4 bg-amber-600 dark:bg-amber-400 inline-block" />
            <span>WPM</span>
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="h-0.5 w-4 border-t-2 border-dashed border-zinc-400 dark:border-zinc-500 inline-block" />
            <span>Xom WPM</span>
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="font-mono-typing font-bold text-red-600 dark:text-red-400">
              ×
            </span>
            <span>Xato</span>
          </span>
        </div>
      </div>

      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="h-56 w-full overflow-visible"
        role="img"
        aria-label="Tezlik va xatoliklar grafigi"
      >
        <defs>
          <linearGradient id="wpmFillGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#d97706" stopOpacity="0.22" />
            <stop offset="100%" stopColor="#d97706" stopOpacity="0.0" />
          </linearGradient>
        </defs>

        {/* Horizontal Grid Lines */}
        {yTicks.map((tick) => {
          const y = getY(tick);
          return (
            <g key={tick}>
              <line
                x1={padLeft}
                y1={y}
                x2={width - padRight}
                y2={y}
                className="stroke-zinc-200 dark:stroke-zinc-800"
                strokeWidth="1"
              />
              <text
                x={padLeft - 8}
                y={y + 4}
                textAnchor="end"
                className="fill-zinc-400 dark:fill-zinc-500 font-mono-typing text-[10px]"
              >
                {tick}
              </text>
            </g>
          );
        })}

        {/* X Axis Labels */}
        {snapshots.map((s, idx) => {
          if (
            idx % xLabelStep !== 0 &&
            idx !== snapshots.length - 1
          ) {
            return null;
          }
          return (
            <text
              key={s.second}
              x={getX(idx)}
              y={height - 6}
              textAnchor="middle"
              className="fill-zinc-400 dark:fill-zinc-500 font-mono-typing text-[10px]"
            >
              {s.second}s
            </text>
          );
        })}

        {/* Area Fill */}
        {snapshots.length > 1 && (
          <path d={areaPath} fill="url(#wpmFillGrad)" />
        )}

        {/* Raw WPM Dashed Line */}
        <path
          d={rawPath}
          fill="none"
          className="stroke-zinc-400 dark:stroke-zinc-600"
          strokeWidth="1.75"
          strokeDasharray="4 4"
        />

        {/* Net WPM Main Line */}
        <path
          d={wpmPath}
          fill="none"
          className="stroke-amber-600 dark:stroke-amber-400"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Data Points & Error Crosses */}
        {snapshots.map((s, idx) => {
          const cx = getX(idx);
          const cy = getY(s.wpm);
          const isHovered = hoverIdx === idx;
          return (
            <g key={s.second}>
              {s.errorsInSecond > 0 && (
                <text
                  x={cx}
                  y={cy - 10}
                  textAnchor="middle"
                  className="fill-red-600 dark:fill-red-400 font-mono-typing text-xs font-bold"
                >
                  ×
                </text>
              )}
              <circle
                cx={cx}
                cy={cy}
                r={isHovered ? 5 : 2.8}
                className="fill-amber-600 dark:fill-amber-400 transition-all"
              />
              <rect
                x={cx - Math.max(8, chartW / snapshots.length / 2)}
                y={padTop}
                width={Math.max(16, chartW / snapshots.length)}
                height={chartH}
                fill="transparent"
                onMouseEnter={() => setHoverIdx(idx)}
                onMouseLeave={() => setHoverIdx(null)}
              />
            </g>
          );
        })}
      </svg>

      {hovered && (
        <div className="mt-2 flex flex-wrap items-center justify-between gap-2 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 px-3 py-1.5 text-xs font-mono-typing tabular-nums">
          <span className="text-zinc-600 dark:text-zinc-400">
            Vaqt: <strong className="text-zinc-900 dark:text-zinc-100">{hovered.second}s</strong>
          </span>
          <span className="text-amber-700 dark:text-amber-400">
            WPM: <strong>{hovered.wpm}</strong>
          </span>
          <span className="text-zinc-600 dark:text-zinc-300">
            Xom WPM: <strong>{hovered.rawWpm}</strong>
          </span>
          <span className={hovered.errorsInSecond > 0 ? 'text-red-600 dark:text-red-400' : 'text-zinc-500'}>
            Xatolar: <strong>{hovered.errorsInSecond}</strong>
          </span>
        </div>
      )}
    </div>
  );
}

export function ResultView({
  result,
  onNextTest,
  onRepeatSame,
  onOpenHistory,
}: ResultViewProps) {
  const { characterStats: cs } = result;

  return (
    <section
      aria-label="Test natijalari"
      className="mx-auto w-full max-w-5xl space-y-6"
    >
      {/* Top Primary Summary + Chart Split */}
      <div className="grid grid-cols-1 gap-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/70 p-6 sm:p-8 lg:grid-cols-12">
        {/* Left: Core Big Figures */}
        <div className="flex flex-col justify-between gap-6 border-b border-zinc-200 dark:border-zinc-800 pb-6 lg:col-span-3 lg:border-b-0 lg:border-r lg:pb-0 lg:pr-6">
          <div>
            <p className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">
              Tezlik (WPM)
            </p>
            <p className="mt-1 font-mono-typing text-5xl font-bold tracking-tight tabular-nums text-amber-700 dark:text-amber-400">
              {result.wpm}
            </p>
            <p className="mt-1 text-xs font-mono-typing tabular-nums text-zinc-500 dark:text-zinc-400">
              {result.cpm} belgi / daqiqa
            </p>
          </div>

          <div>
            <p className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">
              Aniqlik
            </p>
            <p className="mt-1 font-mono-typing text-4xl font-bold tracking-tight tabular-nums text-emerald-700 dark:text-emerald-400">
              {result.accuracy}%
            </p>
          </div>

          <div>
            <p className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">
              Jami xatoliklar
            </p>
            <p
              className={`mt-1 font-mono-typing text-3xl font-bold tracking-tight tabular-nums ${
                result.errorCount > 0
                  ? 'text-red-600 dark:text-red-400'
                  : 'text-zinc-900 dark:text-zinc-100'
              }`}
            >
              {result.errorCount}
            </p>
          </div>
        </div>

        {/* Right: Speed & Errors Timeline Chart */}
        <div className="lg:col-span-9">
          <WpmTimelineChart snapshots={result.snapshots} />
        </div>
      </div>

      {/* Secondary Detailed Breakdown Row */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-5">
        <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 px-4 py-3.5">
          <p className="text-xs text-zinc-500 dark:text-zinc-400">Til</p>
          <p className="mt-1 truncate text-sm font-semibold text-zinc-900 dark:text-zinc-100">
            {result.languageLabel}
          </p>
        </div>

        <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 px-4 py-3.5">
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            Davomiyligi
          </p>
          <p className="mt-1 font-mono-typing text-sm font-semibold tabular-nums text-zinc-900 dark:text-zinc-100">
            {formatDurationLabel(result.durationSeconds)}
          </p>
        </div>

        <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 px-4 py-3.5">
          <p className="text-xs text-zinc-500 dark:text-zinc-400">Xom WPM</p>
          <p className="mt-1 font-mono-typing text-sm font-semibold tabular-nums text-zinc-900 dark:text-zinc-100">
            {result.rawWpm}
          </p>
        </div>

        <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 px-4 py-3.5">
          <p className="text-xs text-zinc-500 dark:text-zinc-400">Barqarorlik</p>
          <p className="mt-1 font-mono-typing text-sm font-semibold tabular-nums text-zinc-900 dark:text-zinc-100">
            {result.consistency}%
          </p>
        </div>

        <div className="col-span-2 sm:col-span-1 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 px-4 py-3.5">
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            Belgilar (t / x / q / o‘)
          </p>
          <p
            title="To'g'ri / Xato / Qo'shimcha / O'tkazib yuborilgan"
            className="mt-1 font-mono-typing text-sm font-semibold tabular-nums text-zinc-900 dark:text-zinc-100"
          >
            {cs.correct}/{cs.incorrect}/{cs.extra}/{cs.missed}
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
        <button
          type="button"
          onClick={onNextTest}
          className="inline-flex items-center gap-2 rounded-xl bg-amber-600 dark:bg-amber-500 px-5 py-2.5 text-sm font-semibold text-white dark:text-zinc-950 hover:bg-amber-700 dark:hover:bg-amber-400 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
        >
          <span>Keyingi mashq</span>
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </button>

        <button
          type="button"
          onClick={onRepeatSame}
          className="inline-flex items-center gap-2 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-5 py-2.5 text-sm font-semibold text-zinc-800 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
        >
          <RotateCcw className="h-4 w-4" aria-hidden="true" />
          <span>Qayta yozish</span>
        </button>

        <button
          type="button"
          onClick={onOpenHistory}
          className="inline-flex items-center gap-2 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-transparent px-4 py-2.5 text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors cursor-pointer"
        >
          <History className="h-4 w-4" aria-hidden="true" />
          <span>Natijalar tarixi</span>
        </button>
      </div>
    </section>
  );
}
