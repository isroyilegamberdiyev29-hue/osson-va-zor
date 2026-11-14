export type LanguageId =
  | 'uz-latn'
  | 'uz-cyrl'
  | 'en'
  | 'ru'
  | 'tr'
  | 'de'
  | 'fr'
  | 'es'
  | 'custom';

export type ThemeMode = 'dark' | 'light';

export type AppView = 'practice' | 'history' | 'guide';

export type TestStatus = 'idle' | 'running' | 'finished';

export interface LanguageConfig {
  id: LanguageId;
  label: string;
  shortLabel: string;
  scriptNote: string;
  words: string[];
}

export interface SecondSnapshot {
  second: number;
  wpm: number;
  rawWpm: number;
  errorsInSecond: number;
}

export interface CharacterStats {
  correct: number;
  incorrect: number;
  extra: number;
  missed: number;
  totalKeystrokes: number;
  errorKeystrokes: number;
}

export interface TestResult {
  id: string;
  timestamp: number;
  languageId: LanguageId;
  languageLabel: string;
  durationSeconds: number;
  actualElapsedSeconds: number;
  wpm: number;
  rawWpm: number;
  cpm: number;
  accuracy: number;
  consistency: number;
  errorCount: number;
  characterStats: CharacterStats;
  snapshots: SecondSnapshot[];
  includePunctuation: boolean;
  includeNumbers: boolean;
}
