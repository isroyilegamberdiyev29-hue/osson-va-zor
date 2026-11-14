import { useCallback, useEffect, useState } from 'react';
import { ConfigBar } from './components/ConfigBar';
import { CustomTextModal } from './components/CustomTextModal';
import { GuideView } from './components/GuideView';
import { Header } from './components/Header';
import { HistoryView } from './components/HistoryView';
import { ResultView } from './components/ResultView';
import { TypingStage } from './components/TypingStage';
import {
  AppView,
  LanguageId,
  TestResult,
  TestStatus,
  ThemeMode,
} from './types/typing';
import {
  clearHistoryStorage,
  loadHistory,
  loadPrefs,
  savePrefs,
  saveResultToHistory,
} from './utils/typingMetrics';

export default function App() {
  const initialPrefs = loadPrefs();

  const [theme, setTheme] = useState<ThemeMode>(
    initialPrefs.theme === 'light' ? 'light' : 'dark'
  );
  const [activeView, setActiveView] = useState<AppView>('practice');
  const [languageId, setLanguageId] = useState<LanguageId>(
    (initialPrefs.languageId as LanguageId) || 'uz-latn'
  );
  const [durationSeconds, setDurationSeconds] = useState<number>(
    typeof initialPrefs.durationSeconds === 'number' &&
      initialPrefs.durationSeconds >= 10
      ? initialPrefs.durationSeconds
      : 60
  );
  const [includePunctuation, setIncludePunctuation] = useState<boolean>(
    Boolean(initialPrefs.includePunctuation)
  );
  const [includeNumbers, setIncludeNumbers] = useState<boolean>(
    Boolean(initialPrefs.includeNumbers)
  );
  const [customText, setCustomText] = useState<string>(
    initialPrefs.customText || ''
  );

  const [testStatus, setTestStatus] = useState<TestStatus>('idle');
  const [latestResult, setLatestResult] = useState<TestResult | null>(null);
  const [lastSessionWords, setLastSessionWords] = useState<string[] | null>(null);
  const [presetWords, setPresetWords] = useState<string[] | null>(null);
  const [sessionKey, setSessionKey] = useState<number>(1);
  const [customModalOpen, setCustomModalOpen] = useState<boolean>(false);
  const [history, setHistory] = useState<TestResult[]>(() => loadHistory());

  // Sync Tailwind dark class on <html>
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  // Persist user preferences
  useEffect(() => {
    savePrefs({
      theme,
      languageId,
      durationSeconds,
      includePunctuation,
      includeNumbers,
      customText,
    });
  }, [
    theme,
    languageId,
    durationSeconds,
    includePunctuation,
    includeNumbers,
    customText,
  ]);

  const handleToggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const handleChangeView = (view: AppView) => {
    setActiveView(view);
    if (view !== 'practice') {
      setTestStatus('idle');
    }
  };

  const handleSelectLanguage = (id: LanguageId) => {
    setLanguageId(id);
    setPresetWords(null);
    setLatestResult(null);
    setSessionKey((k) => k + 1);
  };

  const handleSelectDuration = (seconds: number) => {
    setDurationSeconds(seconds);
    setPresetWords(null);
    setLatestResult(null);
    setSessionKey((k) => k + 1);
  };

  const handleTestComplete = useCallback(
    (result: TestResult, wordsUsed: string[]) => {
      setLatestResult(result);
      setLastSessionWords(wordsUsed);
      const updated = saveResultToHistory(result);
      setHistory(updated);
    },
    []
  );

  const handleNextTest = () => {
    setLatestResult(null);
    setPresetWords(null);
    setTestStatus('idle');
    setSessionKey((k) => k + 1);
  };

  const handleRepeatSame = () => {
    setLatestResult(null);
    setPresetWords(lastSessionWords);
    setTestStatus('idle');
    setSessionKey((k) => k + 1);
  };

  const handleSaveCustomText = (text: string) => {
    setCustomText(text);
    setLanguageId('custom');
    setPresetWords(null);
    setLatestResult(null);
    setCustomModalOpen(false);
    setActiveView('practice');
    setSessionKey((k) => k + 1);
  };

  const handleClearHistory = () => {
    clearHistoryStorage();
    setHistory([]);
  };

  const isTypingActive = activeView === 'practice' && testStatus === 'running';

  return (
    <div className="flex min-h-screen flex-col bg-[#f4f3ef] text-zinc-900 dark:bg-[#1c1e24] dark:text-zinc-100 transition-colors duration-200">
      <Header
        activeView={activeView}
        onChangeView={handleChangeView}
        theme={theme}
        onToggleTheme={handleToggleTheme}
        isTypingActive={isTypingActive}
      />

      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col justify-center gap-8 px-4 py-8 sm:px-6 sm:py-10">
        {activeView === 'practice' && (
          <>
            <ConfigBar
              languageId={languageId}
              onSelectLanguage={handleSelectLanguage}
              durationSeconds={durationSeconds}
              onSelectDuration={handleSelectDuration}
              includePunctuation={includePunctuation}
              onTogglePunctuation={() => {
                setIncludePunctuation((p) => !p);
                setPresetWords(null);
                setLatestResult(null);
                setSessionKey((k) => k + 1);
              }}
              includeNumbers={includeNumbers}
              onToggleNumbers={() => {
                setIncludeNumbers((n) => !n);
                setPresetWords(null);
                setLatestResult(null);
                setSessionKey((k) => k + 1);
              }}
              onOpenCustomText={() => setCustomModalOpen(true)}
              disabled={false}
              isTypingActive={isTypingActive}
            />

            {latestResult ? (
              <ResultView
                result={latestResult}
                onNextTest={handleNextTest}
                onRepeatSame={handleRepeatSame}
                onOpenHistory={() => setActiveView('history')}
              />
            ) : (
              <TypingStage
                sessionKey={sessionKey}
                languageId={languageId}
                durationSeconds={durationSeconds}
                includePunctuation={includePunctuation}
                includeNumbers={includeNumbers}
                customText={customText}
                presetWords={presetWords}
                onStatusChange={setTestStatus}
                onComplete={handleTestComplete}
              />
            )}
          </>
        )}

        {activeView === 'history' && (
          <HistoryView
            history={history}
            onClearHistory={handleClearHistory}
            onStartPractice={() => {
              setActiveView('practice');
              handleNextTest();
            }}
          />
        )}

        {activeView === 'guide' && (
          <GuideView onBackToPractice={() => setActiveView('practice')} />
        )}
      </main>

      <footer
        className={`border-t border-zinc-200 dark:border-zinc-800/80 py-4 text-center text-xs text-zinc-500 dark:text-zinc-400 transition-opacity duration-200 ${
          isTypingActive ? 'opacity-20' : 'opacity-100'
        }`}
      >
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-6">
          <span>TezYoz — Ko‘p tilli tez yozish mashqi</span>
          <span>
            {theme === 'dark' ? 'Qorong‘u rejim' : 'Yorug‘ rejim'} · Tab + Enter
            bilan qayta boshlash
          </span>
        </div>
      </footer>

      <CustomTextModal
        isOpen={customModalOpen}
        initialText={customText}
        onClose={() => setCustomModalOpen(false)}
        onSave={handleSaveCustomText}
      />
    </div>
  );
}
