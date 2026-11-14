import { X } from 'lucide-react';
import { useEffect, useState } from 'react';

interface CustomTextModalProps {
  isOpen: boolean;
  initialText: string;
  onClose: () => void;
  onSave: (text: string) => void;
}

const SAMPLE_SNIPPETS: { label: string; text: string }[] = [
  {
    label: "O'zbekcha hikmat",
    text: "Ilm olish igna bilan quduq qazishga o'xshaydi. Har kuni oz-ozdan mashq qilsangiz, natija albatta yuksak bo'ladi.",
  },
  {
    label: 'English quote',
    text: 'Consistency beats intensity when building muscle memory on a keyboard. Focus on accuracy first and speed will naturally follow.',
  },
  {
    label: 'Қазақша / Kirill',
    text: 'Тіл байлығы мен жылдам жазу дағдысы күнделікті тәжірибе арқылы қалыптасады.',
  },
];

export function CustomTextModal({
  isOpen,
  initialText,
  onClose,
  onSave,
}: CustomTextModalProps) {
  const [text, setText] = useState(initialText);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      setText(initialText);
      setError('');
    }
  }, [isOpen, initialText]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleaned = text.trim();
    if (cleaned.split(/\s+/).filter(Boolean).length < 3) {
      setError('Kamida 3 ta so‘zdan iborat matn kiriting.');
      return;
    }
    onSave(cleaned);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="custom-text-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs"
    >
      <div className="w-full max-w-xl rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 shadow-xl">
        <div className="flex items-center justify-between gap-4 border-b border-zinc-200 dark:border-zinc-800 pb-4">
          <div>
            <h2
              id="custom-text-title"
              className="text-lg font-bold text-zinc-900 dark:text-zinc-100"
            >
              O‘z matningizni kiriting
            </h2>
            <p className="mt-0.5 text-xs text-zinc-500 dark:text-zinc-400">
              Istalgan til va alifboda matn joylashtirib tezlikni sinashingiz mumkin.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Yopish"
            className="rounded-lg p-1.5 text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100 cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div>
            <div className="mb-2 flex flex-wrap items-center gap-2">
              <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
                Namuna:
              </span>
              {SAMPLE_SNIPPETS.map((sample) => (
                <button
                  key={sample.label}
                  type="button"
                  onClick={() => {
                    setText(sample.text);
                    setError('');
                  }}
                  className="rounded-md border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 px-2.5 py-1 text-xs font-medium text-zinc-700 dark:text-zinc-300 hover:border-amber-500 dark:hover:border-amber-400 cursor-pointer"
                >
                  {sample.label}
                </button>
              ))}
            </div>

            <textarea
              rows={5}
              value={text}
              onChange={(e) => {
                setText(e.target.value);
                if (error) setError('');
              }}
              placeholder="Bu yerga o'z matningizni yozing yoki joylashtiring..."
              className="w-full rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-950/60 p-3.5 font-mono-typing text-sm text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
            {error && (
              <p className="mt-1.5 text-xs font-medium text-red-600 dark:text-red-400">
                {error}
              </p>
            )}
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg px-4 py-2 text-xs font-semibold text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer"
            >
              Bekor qilish
            </button>
            <button
              type="submit"
              className="rounded-lg bg-amber-600 dark:bg-amber-500 px-5 py-2 text-xs font-semibold text-white dark:text-zinc-950 hover:bg-amber-700 dark:hover:bg-amber-400 transition-colors cursor-pointer"
            >
              Matn bilan boshlash
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
