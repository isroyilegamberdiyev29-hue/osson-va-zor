import { CharacterStats, SecondSnapshot, TestResult } from '../types/typing';

const HISTORY_STORAGE_KEY = 'tezyoz_history_v1';
const PREFS_STORAGE_KEY = 'tezyoz_prefs_v1';

export function formatDurationLabel(seconds: number): string {
  if (seconds < 60) {
    return `${seconds} soniya`;
  }
  const mins = Math.floor(seconds / 60);
  const rem = seconds % 60;
  if (rem === 0) {
    return `${mins} daqiqa`;
  }
  return `${mins} daq ${rem} son`;
}

export function formatShortDuration(seconds: number): string {
  if (seconds < 60) {
    return `${seconds}s`;
  }
  const mins = Math.floor(seconds / 60);
  const rem = seconds % 60;
  return rem === 0 ? `${mins} min` : `${mins}m ${rem}s`;
}

export function formatClock(seconds: number): string {
  const safe = Math.max(0, Math.ceil(seconds));
  if (safe < 60) {
    return String(safe);
  }
  const mins = Math.floor(safe / 60);
  const secs = safe % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

export function calculateCharacterStats(
  words: string[],
  typedWords: string[],
  currentWordIndex: number,
  totalKeystrokes: number,
  errorKeystrokes: number
): CharacterStats {
  let correct = 0;
  let incorrect = 0;
  let extra = 0;
  let missed = 0;

  const limit = Math.min(words.length, currentWordIndex + 1);

  for (let wIdx = 0; wIdx < limit; wIdx++) {
    const target = words[wIdx];
    const typed = typedWords[wIdx] || '';
    const isCompletedWord = wIdx < currentWordIndex;

    const minLen = Math.min(target.length, typed.length);
    for (let cIdx = 0; cIdx < minLen; cIdx++) {
      if (typed[cIdx] === target[cIdx]) {
        correct++;
      } else {
        incorrect++;
      }
    }

    if (typed.length > target.length) {
      extra += typed.length - target.length;
    }

    if (isCompletedWord && typed.length < target.length) {
      missed += target.length - typed.length;
    }

    // Count space bar between completed words as a correct character
    if (isCompletedWord) {
      correct++;
    }
  }

  return {
    correct,
    incorrect,
    extra,
    missed,
    totalKeystrokes,
    errorKeystrokes,
  };
}

export function computeWpm(correctChars: number, elapsedSeconds: number): number {
  if (elapsedSeconds <= 0) return 0;
  const minutes = elapsedSeconds / 60;
  return Math.max(0, Math.round(correctChars / 5 / minutes));
}

export function computeRawWpm(totalTypedChars: number, elapsedSeconds: number): number {
  if (elapsedSeconds <= 0) return 0;
  const minutes = elapsedSeconds / 60;
  return Math.max(0, Math.round(totalTypedChars / 5 / minutes));
}

export function computeCpm(correctChars: number, elapsedSeconds: number): number {
  if (elapsedSeconds <= 0) return 0;
  const minutes = elapsedSeconds / 60;
  return Math.max(0, Math.round(correctChars / minutes));
}

export function computeAccuracy(totalKeystrokes: number, errorKeystrokes: number): number {
  if (totalKeystrokes <= 0) return 100;
  const valid = Math.max(0, totalKeystrokes - errorKeystrokes);
  return Math.max(0, Math.min(100, Math.round((valid / totalKeystrokes) * 100)));
}

export function computeConsistency(snapshots: SecondSnapshot[]): number {
  if (snapshots.length < 2) return 100;
  const wpms = snapshots.map((s) => s.rawWpm).filter((v) => v > 0);
  if (wpms.length < 2) return 100;
  const mean = wpms.reduce((acc, v) => acc + v, 0) / wpms.length;
  if (mean === 0) return 100;
  const variance =
    wpms.reduce((acc, v) => acc + Math.pow(v - mean, 2), 0) / wpms.length;
  const stdDev = Math.sqrt(variance);
  const cv = (stdDev / mean) * 100;
  return Math.max(0, Math.min(100, Math.round(100 - cv)));
}

export function loadHistory(): TestResult[] {
  try {
    const raw = localStorage.getItem(HISTORY_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveResultToHistory(result: TestResult): TestResult[] {
  const existing = loadHistory();
  const updated = [result, ...existing].slice(0, 100);
  try {
    localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(updated));
  } catch {
    // Ignore storage quota errors
  }
  return updated;
}

export function clearHistoryStorage(): void {
  try {
    localStorage.removeItem(HISTORY_STORAGE_KEY);
  } catch {
    // Ignore storage errors
  }
}

export interface UserPrefs {
  theme: 'dark' | 'light';
  languageId: string;
  durationSeconds: number;
  includePunctuation: boolean;
  includeNumbers: boolean;
  customText: string;
}

export function loadPrefs(): Partial<UserPrefs> {
  try {
    const raw = localStorage.getItem(PREFS_STORAGE_KEY);
    if (!raw) return {};
    return JSON.parse(raw) || {};
  } catch {
    return {};
  }
}

export function savePrefs(prefs: UserPrefs): void {
  try {
    localStorage.setItem(PREFS_STORAGE_KEY, JSON.stringify(prefs));
  } catch {
    // Ignore storage errors
  }
}
