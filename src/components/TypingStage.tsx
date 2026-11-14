import { AlertCircle, CheckCircle2, Gauge, RotateCcw, Timer } from 'lucide-react';
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { generateWordStream, getLanguageById } from '../data/languages';
import {
  LanguageId,
  SecondSnapshot,
  TestResult,
  TestStatus,
} from '../types/typing';
import {
  calculateCharacterStats,
  computeAccuracy,
  computeConsistency,
  computeCpm,
  computeRawWpm,
  computeWpm,
  formatClock,
} from '../utils/typingMetrics';

interface TypingStageProps {
  sessionKey: number;
  languageId: LanguageId;
  durationSeconds: number;
  includePunctuation: boolean;
  includeNumbers: boolean;
  customText: string;
  presetWords?: string[] | null;
  onStatusChange: (status: TestStatus) => void;
  onComplete: (result: TestResult, sessionWords: string[]) => void;
}

function normalizeCharInput(text: string): string {
  return text.replace(/[\u2018\u2019\u02BB]/g, "'");
}

export function TypingStage({
  sessionKey,
  languageId,
  durationSeconds,
  includePunctuation,
  includeNumbers,
  customText,
  presetWords,
  onStatusChange,
  onComplete,
}: TypingStageProps) {
  const [words, setWords] = useState<string[]>(() =>
    presetWords && presetWords.length > 0
      ? presetWords
      : generateWordStream(languageId, 120, {
          includePunctuation,
          includeNumbers,
          customText,
        })
  );

  const [typedWords, setTypedWords] = useState<string[]>(['']);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [status, setStatus] = useState<TestStatus>('idle');
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [isFocused, setIsFocused] = useState(true);
  const [capsLockOn, setCapsLockOn] = useState(false);

  const [totalKeystrokes, setTotalKeystrokes] = useState(0);
  const [errorKeystrokes, setErrorKeystrokes] = useState(0);

  const inputRef = useRef<HTMLInputElement>(null);
  const wordsContainerRef = useRef<HTMLDivElement>(null);
  const activeCharRef = useRef<HTMLSpanElement>(null);
  const endOfWordRef = useRef<HTMLSpanElement>(null);

  const [caretPos, setCaretPos] = useState({ left: 0, top: 0, height: 32 });
  const [scrollY, setScrollY] = useState(0);

  const startTimeRef = useRef<number | null>(null);
  const lastRecordedSecondRef = useRef<number>(0);
  const errorsInCurrentSecondRef = useRef<number>(0);
  const snapshotsRef = useRef<SecondSnapshot[]>([]);
  const finishedRef = useRef(false);

  // Refs synced with latest state for accurate timer snapshots
  const latestStateRef = useRef({
    words,
    typedWords,
    currentWordIndex,
    totalKeystrokes,
    errorKeystrokes,
  });

  latestStateRef.current = {
    words,
    typedWords,
    currentWordIndex,
    totalKeystrokes,
    errorKeystrokes,
  };

  const resetTest = useCallback(
    (keepWords = false) => {
      finishedRef.current = false;
      startTimeRef.current = null;
      lastRecordedSecondRef.current = 0;
      errorsInCurrentSecondRef.current = 0;
      snapshotsRef.current = [];

      if (!keepWords) {
        setWords(
          presetWords && presetWords.length > 0
            ? presetWords
            : generateWordStream(languageId, 120, {
                includePunctuation,
                includeNumbers,
                customText,
              })
        );
      }

      setTypedWords(['']);
      setCurrentWordIndex(0);
      setStatus('idle');
      onStatusChange('idle');
      setElapsedSeconds(0);
      setTotalKeystrokes(0);
      setErrorKeystrokes(0);
      setScrollY(0);

      requestAnimationFrame(() => {
        inputRef.current?.focus();
      });
    },
    [
      languageId,
      includePunctuation,
      includeNumbers,
      customText,
      presetWords,
      onStatusChange,
    ]
  );

  // Reset when config or sessionKey changes
  useEffect(() => {
    resetTest(false);
  }, [
    sessionKey,
    languageId,
    durationSeconds,
    includePunctuation,
    includeNumbers,
    customText,
    presetWords,
    resetTest,
  ]);

  const finishTest = useCallback(
    (finalElapsed: number) => {
      if (finishedRef.current) return;
      finishedRef.current = true;

      const {
        words: w,
        typedWords: tw,
        currentWordIndex: cwi,
        totalKeystrokes: tk,
        errorKeystrokes: ek,
      } = latestStateRef.current;

      const safeElapsed = Math.max(1, finalElapsed);
      const charStats = calculateCharacterStats(w, tw, cwi, tk, ek);
      const totalTypedCount =
        charStats.correct + charStats.incorrect + charStats.extra;

      const wpm = computeWpm(charStats.correct, safeElapsed);
      const rawWpm = computeRawWpm(totalTypedCount, safeElapsed);
      const cpm = computeCpm(charStats.correct, safeElapsed);
      const accuracy = computeAccuracy(tk, ek);

      const finalSnapshots = [...snapshotsRef.current];
      if (
        finalSnapshots.length === 0 ||
        finalSnapshots[finalSnapshots.length - 1].second < Math.round(safeElapsed)
      ) {
        finalSnapshots.push({
          second: Math.max(1, Math.round(safeElapsed)),
          wpm,
          rawWpm,
          errorsInSecond: errorsInCurrentSecondRef.current,
        });
      }

      const consistency = computeConsistency(finalSnapshots);
      const langLabel =
        languageId === 'custom'
          ? 'Maxsus matn'
          : getLanguageById(languageId).label;

      setStatus('finished');
      onStatusChange('finished');

      onComplete({
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        timestamp: Date.now(),
        languageId,
        languageLabel: langLabel,
        durationSeconds,
        actualElapsedSeconds: Math.round(safeElapsed),
        wpm,
        rawWpm,
        cpm,
        accuracy,
        consistency,
        errorCount: ek,
        characterStats: charStats,
        snapshots: finalSnapshots,
        includePunctuation,
        includeNumbers,
      }, w);
    },
    [
      durationSeconds,
      includeNumbers,
      includePunctuation,
      languageId,
      onComplete,
      onStatusChange,
    ]
  );

  // High-precision timer loop
  useEffect(() => {
    if (status !== 'running') return;

    const interval = window.setInterval(() => {
      if (!startTimeRef.current) return;
      const now = performance.now();
      const elapsed = (now - startTimeRef.current) / 1000;
      const wholeSec = Math.floor(elapsed);

      if (wholeSec > lastRecordedSecondRef.current) {
        for (let s = lastRecordedSecondRef.current + 1; s <= wholeSec; s++) {
          const {
            words: w,
            typedWords: tw,
            currentWordIndex: cwi,
            totalKeystrokes: tk,
            errorKeystrokes: ek,
          } = latestStateRef.current;

          const stats = calculateCharacterStats(w, tw, cwi, tk, ek);
          const totalTyped = stats.correct + stats.incorrect + stats.extra;

          snapshotsRef.current.push({
            second: s,
            wpm: computeWpm(stats.correct, s),
            rawWpm: computeRawWpm(totalTyped, s),
            errorsInSecond:
              s === wholeSec ? errorsInCurrentSecondRef.current : 0,
          });
        }
        lastRecordedSecondRef.current = wholeSec;
        errorsInCurrentSecondRef.current = 0;
      }

      setElapsedSeconds(elapsed);

      if (elapsed >= durationSeconds) {
        window.clearInterval(interval);
        finishTest(durationSeconds);
      }
    }, 100);

    return () => window.clearInterval(interval);
  }, [status, durationSeconds, finishTest]);

  // Global focus shortcut: typing any printable key focuses the stage
  useEffect(() => {
    const handleWindowKeyDown = (e: KeyboardEvent) => {
      if (e.getModifierState && e.getModifierState('CapsLock')) {
        setCapsLockOn(true);
      } else {
        setCapsLockOn(false);
      }

      const activeTag = document.activeElement?.tagName.toLowerCase();
      if (
        activeTag === 'textarea' ||
        activeTag === 'select' ||
        (activeTag === 'input' && document.activeElement !== inputRef.current)
      ) {
        return;
      }

      if (e.key === 'Escape') {
        inputRef.current?.blur();
        return;
      }

      if (
        !e.ctrlKey &&
        !e.metaKey &&
        !e.altKey &&
        e.key.length === 1 &&
        document.activeElement !== inputRef.current
      ) {
        inputRef.current?.focus();
      }
    };

    window.addEventListener('keydown', handleWindowKeyDown);
    return () => window.removeEventListener('keydown', handleWindowKeyDown);
  }, []);

  // Measure caret position & manage 3-line viewport scrolling
  useLayoutEffect(() => {
    const container = wordsContainerRef.current;
    if (!container) return;

    const targetEl = activeCharRef.current || endOfWordRef.current;
    if (!targetEl) return;

    const left = targetEl.offsetLeft;
    const top = targetEl.offsetTop;
    const height = targetEl.offsetHeight || 36;

    setCaretPos({ left, top, height });

    // Approximate single-line step (~48px with leading)
    const lineStep = height + 10;
    if (top > lineStep * 1.45) {
      setScrollY(Math.max(0, top - lineStep));
    } else {
      setScrollY(0);
    }
  }, [words, typedWords, currentWordIndex]);

  // Live metrics
  const liveStats = useMemo(() => {
    const charStats = calculateCharacterStats(
      words,
      typedWords,
      currentWordIndex,
      totalKeystrokes,
      errorKeystrokes
    );
    const activeTime = Math.max(0.5, elapsedSeconds);
    const wpm = status === 'idle' ? 0 : computeWpm(charStats.correct, activeTime);
    const cpm = status === 'idle' ? 0 : computeCpm(charStats.correct, activeTime);
    const accuracy = computeAccuracy(totalKeystrokes, errorKeystrokes);
    const uncorrectedErrors =
      charStats.incorrect + charStats.extra + charStats.missed;

    return {
      wpm,
      cpm,
      accuracy,
      errorKeystrokes,
      uncorrectedErrors,
    };
  }, [
    words,
    typedWords,
    currentWordIndex,
    totalKeystrokes,
    errorKeystrokes,
    elapsedSeconds,
    status,
  ]);

  const currentTypedWord = typedWords[currentWordIndex] || '';

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (status === 'finished') return;

    const rawValue = normalizeCharInput(e.target.value);

    // Start timer on first character
    if (status === 'idle' && rawValue.length > 0) {
      startTimeRef.current = performance.now();
      setStatus('running');
      onStatusChange('running');
    }

    // Handle space-bar word completion
    if (rawValue.endsWith(' ')) {
      const trimmed = rawValue.slice(0, -1);
      if (trimmed.length === 0) {
        return;
      }

      setTotalKeystrokes((prev) => prev + 1);

      const targetWord = words[currentWordIndex] || '';
      if (trimmed !== targetWord) {
        // Count missed chars as an error indicator on jump
        if (trimmed.length < targetWord.length) {
          errorsInCurrentSecondRef.current += 1;
        }
      }

      const nextIndex = currentWordIndex + 1;

      setTypedWords((prev) => {
        const copy = [...prev];
        copy[currentWordIndex] = trimmed;
        if (copy.length <= nextIndex) {
          copy.push('');
        }
        return copy;
      });

      setCurrentWordIndex(nextIndex);

      // Append more words smoothly when getting close to end
      if (words.length - nextIndex < 45) {
        const more = generateWordStream(languageId, 80, {
          includePunctuation,
          includeNumbers,
          customText,
        });
        setWords((prev) => [...prev, ...more]);
      }

      return;
    }

    // Track keystrokes & errors on newly typed characters
    const prevVal = currentTypedWord;
    if (rawValue.length > prevVal.length) {
      const added = rawValue.slice(prevVal.length);
      const targetWord = words[currentWordIndex] || '';
      let newErrors = 0;

      for (let i = 0; i < added.length; i++) {
        const charIdx = prevVal.length + i;
        const ch = added[i];
        if (charIdx >= targetWord.length || ch !== targetWord[charIdx]) {
          newErrors++;
        }
      }

      setTotalKeystrokes((prev) => prev + added.length);
      if (newErrors > 0) {
        setErrorKeystrokes((prev) => prev + newErrors);
        errorsInCurrentSecondRef.current += newErrors;
      }
    }

    setTypedWords((prev) => {
      const copy = [...prev];
      copy[currentWordIndex] = rawValue;
      return copy;
    });
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.getModifierState) {
      setCapsLockOn(e.getModifierState('CapsLock'));
    }

    // Backspace into previous word if current word input is empty & previous word had errors
    if (
      e.key === 'Backspace' &&
      currentTypedWord.length === 0 &&
      currentWordIndex > 0
    ) {
      const prevIdx = currentWordIndex - 1;
      const prevTyped = typedWords[prevIdx] || '';
      const prevTarget = words[prevIdx] || '';
      if (prevTyped !== prevTarget) {
        e.preventDefault();
        setCurrentWordIndex(prevIdx);
      }
    }
  };

  const remainingSeconds = Math.max(0, durationSeconds - elapsedSeconds);
  const progressPct =
    status === 'idle'
      ? 0
      : Math.min(100, (elapsedSeconds / durationSeconds) * 100);

  return (
    <section
      aria-label="Tez yozish maydoni"
      className="mx-auto flex w-full max-w-5xl flex-col gap-6"
    >
      {/* Live Telemetry Bar: Speed, Errors, Accuracy, Remaining Time */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="flex items-center justify-between rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/70 px-4 py-3">
          <div>
            <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
              Qolgan vaqt
            </p>
            <p className="mt-0.5 font-mono-typing text-2xl font-bold tabular-nums text-amber-700 dark:text-amber-400">
              {formatClock(remainingSeconds)}
            </p>
          </div>
          <Timer
            className="h-5 w-5 text-amber-600/70 dark:text-amber-400/70"
            aria-hidden="true"
          />
        </div>

        <div className="flex items-center justify-between rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/70 px-4 py-3">
          <div>
            <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
              Hozirgi tezlik
            </p>
            <div className="mt-0.5 flex items-baseline gap-2">
              <span className="font-mono-typing text-2xl font-bold tabular-nums text-zinc-900 dark:text-zinc-100">
                {liveStats.wpm}
              </span>
              <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
                WPM · {liveStats.cpm} CPM
              </span>
            </div>
          </div>
          <Gauge
            className="h-5 w-5 text-zinc-400 dark:text-zinc-500"
            aria-hidden="true"
          />
        </div>

        <div className="flex items-center justify-between rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/70 px-4 py-3">
          <div>
            <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
              Xatoliklar
            </p>
            <div className="mt-0.5 flex items-baseline gap-2">
              <span
                className={`font-mono-typing text-2xl font-bold tabular-nums ${
                  liveStats.errorKeystrokes > 0
                    ? 'text-red-600 dark:text-red-400'
                    : 'text-zinc-900 dark:text-zinc-100'
                }`}
              >
                {liveStats.errorKeystrokes}
              </span>
              <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
                {liveStats.uncorrectedErrors > 0
                  ? `(${liveStats.uncorrectedErrors} tuzatilmagan)`
                  : 'xato tugma'}
              </span>
            </div>
          </div>
          <AlertCircle
            className={`h-5 w-5 ${
              liveStats.errorKeystrokes > 0
                ? 'text-red-500 dark:text-red-400'
                : 'text-zinc-400 dark:text-zinc-500'
            }`}
            aria-hidden="true"
          />
        </div>

        <div className="flex items-center justify-between rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/70 px-4 py-3">
          <div>
            <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
              Aniqlik
            </p>
            <p className="mt-0.5 font-mono-typing text-2xl font-bold tabular-nums text-emerald-700 dark:text-emerald-400">
              {liveStats.accuracy}%
            </p>
          </div>
          <CheckCircle2
            className="h-5 w-5 text-emerald-600/70 dark:text-emerald-400/70"
            aria-hidden="true"
          />
        </div>
      </div>

      {/* Subtle Progress Bar */}
      <div className="h-1 w-full overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-800">
        <div
          className="h-full bg-amber-600 dark:bg-amber-400 transition-[width] duration-150 ease-linear"
          style={{ width: `${progressPct}%` }}
        />
      </div>

      {/* Main Typing Canvas */}
      <div
        onClick={() => inputRef.current?.focus()}
        className="relative cursor-text rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 px-6 py-8 sm:px-10 sm:py-10 transition-colors"
      >
        {/* Hidden Input Capturing All Scripts & IMEs */}
        <input
          ref={inputRef}
          type="text"
          value={currentTypedWord}
          onChange={handleInputChange}
          onKeyDown={handleInputKeyDown}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          autoCapitalize="off"
          autoComplete="off"
          autoCorrect="off"
          spellCheck={false}
          aria-label="Yozish uchun maydon"
          className="pointer-events-none absolute inset-0 h-full w-full opacity-0"
        />

        {capsLockOn && (
          <div className="mb-4 inline-flex items-center gap-2 rounded-lg border border-amber-300 dark:border-amber-700/60 bg-amber-50 dark:bg-amber-950/50 px-3 py-1.5 text-xs font-semibold text-amber-800 dark:text-amber-300">
            <AlertCircle className="h-3.5 w-3.5" aria-hidden="true" />
            <span>Caps Lock yoqilgan</span>
          </div>
        )}

        {/* 3-line Clipped Word Viewport */}
        <div className="relative h-[148px] overflow-hidden select-none">
          <div
            ref={wordsContainerRef}
            className={`relative flex flex-wrap gap-x-3.5 gap-y-2.5 font-mono-typing text-2xl sm:text-[26px] leading-[40px] transition-transform duration-150 ease-out ${
              !isFocused ? 'blur-[3px] opacity-45' : 'opacity-100'
            }`}
            style={{ transform: `translate3d(0, -${scrollY}px, 0)` }}
          >
            {/* Smooth Sliding Caret */}
            {isFocused && (
              <span
                aria-hidden="true"
                className={`caret-smooth pointer-events-none absolute left-0 top-0 z-10 w-[2.5px] rounded-full bg-amber-600 dark:bg-amber-400 transition-transform duration-75 ease-out ${
                  status === 'idle' ? 'caret-idle' : ''
                }`}
                style={{
                  height: `${Math.max(28, caretPos.height - 4)}px`,
                  transform: `translate3d(${caretPos.left}px, ${caretPos.top + 2}px, 0)`,
                }}
              />
            )}

            {words.map((word, wIdx) => {
              // Render a comfortable window of words around current position for smooth 60fps performance
              if (wIdx < Math.max(0, currentWordIndex - 35)) return null;
              if (wIdx > currentWordIndex + 85) return null;

              const typed = typedWords[wIdx] || '';
              const isPast = wIdx < currentWordIndex;
              const isCurrent = wIdx === currentWordIndex;
              const hasWordError = isPast && typed !== word;
              const extraChars =
                typed.length > word.length ? typed.slice(word.length) : '';

              return (
                <div
                  key={`${wIdx}-${word}`}
                  className={`relative inline-flex ${
                    hasWordError
                      ? 'underline decoration-red-500/70 decoration-2 underline-offset-4'
                      : ''
                  }`}
                >
                  {word.split('').map((char, cIdx) => {
                    const typedChar = typed[cIdx];
                    let colorClass =
                      'text-zinc-400 dark:text-zinc-500';
                    if (typedChar !== undefined) {
                      if (typedChar === char) {
                        colorClass = 'text-zinc-900 dark:text-zinc-100';
                      } else {
                        colorClass =
                          'text-red-600 dark:text-red-400 bg-red-500/10 rounded-xs';
                      }
                    }

                    const isCaretTarget =
                      isCurrent && typed.length === cIdx;

                    return (
                      <span
                        key={cIdx}
                        ref={isCaretTarget ? activeCharRef : undefined}
                        className={colorClass}
                      >
                        {char}
                      </span>
                    );
                  })}

                  {/* Extra Mistyped Characters Beyond Word Length */}
                  {extraChars.split('').map((extraChar, eIdx) => (
                    <span
                      key={`extra-${eIdx}`}
                      className="text-red-700 dark:text-red-300 bg-red-500/20 rounded-xs"
                    >
                      {extraChar}
                    </span>
                  ))}

                  {/* Caret Anchor When Cursor Is At End Of Current Word */}
                  {isCurrent && typed.length >= word.length && (
                    <span
                      ref={endOfWordRef}
                      aria-hidden="true"
                      className="inline-block w-0"
                    >
                      &#8203;
                    </span>
                  )}
                </div>
              );
            })}
          </div>

          {/* Unfocused Overlay Prompt */}
          {!isFocused && (
            <div className="absolute inset-0 flex items-center justify-center">
              <button
                type="button"
                onClick={() => inputRef.current?.focus()}
                className="rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white/95 dark:bg-zinc-900/95 px-5 py-2.5 text-sm font-semibold text-zinc-900 dark:text-zinc-100 shadow-sm cursor-pointer"
              >
                Davom etish uchun bosing yoki tugma bosing
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Restart Control & Keyboard Hint */}
      <div className="flex flex-col items-center justify-center gap-3">
        <button
          type="button"
          onClick={() => resetTest(false)}
          className="inline-flex items-center gap-2 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-4 py-2 text-xs font-semibold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
        >
          <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
          <span>Qayta boshlash</span>
        </button>

        <p className="text-xs text-zinc-500 dark:text-zinc-400">
          Tezkor qayta boshlash:{' '}
          <kbd className="rounded border border-zinc-300 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 font-mono-typing text-[11px]">
            Tab
          </kbd>{' '}
          +{' '}
          <kbd className="rounded border border-zinc-300 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 font-mono-typing text-[11px]">
            Enter
          </kbd>
          <span aria-hidden="true"> · </span>
          <span>Yozishni boshlash uchun istalgan harfni bosing</span>
        </p>
      </div>
    </section>
  );
}
