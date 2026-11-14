interface GuideViewProps {
  onBackToPractice: () => void;
}

export function GuideView({ onBackToPractice }: GuideViewProps) {
  return (
    <section
      aria-label="Qo'llanma va qisqa yo'llar"
      className="mx-auto w-full max-w-4xl space-y-8"
    >
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
          Foydalanish qo‘llanmasi
        </h1>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          Tezlik, aniqlik va xatolik ko‘rsatkichlari qanday hisoblanishi haqida
          qisqacha ma‘lumot.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 p-6 space-y-3">
          <h2 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
            Asosiy ko‘rsatkichlar
          </h2>
          <dl className="space-y-3 text-sm">
            <div>
              <dt className="font-semibold text-amber-700 dark:text-amber-400">
                WPM (So‘z / Daqiqa)
              </dt>
              <dd className="mt-0.5 text-zinc-600 dark:text-zinc-400">
                Har 5 ta to‘g‘ri kiritilgan belgi (probel bilan birga) 1 ta
                standart so‘z sifatida hisoblanadi va daqiqaga bo‘linadi.
              </dd>
            </div>
            <div>
              <dt className="font-semibold text-zinc-900 dark:text-zinc-100">
                Xom WPM va CPM
              </dt>
              <dd className="mt-0.5 text-zinc-600 dark:text-zinc-400">
                Xom WPM — xatolarni ayirmagan holdagi umumiy yozish tezligi. CPM
                esa daqiqasiga to‘g‘ri bosilgan belgilar sonini bildiradi.
              </dd>
            </div>
            <div>
              <dt className="font-semibold text-red-600 dark:text-red-400">
                Xatoliklar va Aniqlik (%)
              </dt>
              <dd className="mt-0.5 text-zinc-600 dark:text-zinc-400">
                Har bir noto‘g‘ri bosilgan tugma xato sifatida qayd etiladi.
                Aniqlik to‘g‘ri tugmalarning jami bosilgan tugmalarga nisbatidan
                kelib chiqadi.
              </dd>
            </div>
          </dl>
        </div>

        <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 p-6 space-y-3">
          <h2 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
            Klaviatura qisqa yo‘llari va imkoniyatlar
          </h2>
          <ul className="space-y-3 text-sm text-zinc-600 dark:text-zinc-400">
            <li className="flex items-start justify-between gap-4">
              <span>Mashqni tez qayta boshlash</span>
              <span className="shrink-0 font-mono-typing text-xs text-zinc-800 dark:text-zinc-200">
                Tab + Enter
              </span>
            </li>
            <li className="flex items-start justify-between gap-4">
              <span>Maydondan fokusni chiqarish</span>
              <span className="shrink-0 font-mono-typing text-xs text-zinc-800 dark:text-zinc-200">
                Esc
              </span>
            </li>
            <li className="flex items-start justify-between gap-4">
              <span>Oldingi xato so‘zga qaytish</span>
              <span className="shrink-0 font-mono-typing text-xs text-zinc-800 dark:text-zinc-200">
                Backspace
              </span>
            </li>
            <li className="border-t border-zinc-200 dark:border-zinc-800 pt-3">
              <strong className="text-zinc-900 dark:text-zinc-100">
                Istalgan til va vaqt:
              </strong>{' '}
              Yuqori paneldan 8 ta tayyor tilni tanlashingiz yoki{' '}
              <em>“Matn kiritish”</em> tugmasi orqali o‘zingiz istagan tildagi
              matnni joylashtirishingiz mumkin. Taymerni esa 15 soniyadan 60
              daqiqagacha o‘zingiz belgilaysiz.
            </li>
          </ul>
        </div>
      </div>

      <div>
        <button
          type="button"
          onClick={onBackToPractice}
          className="rounded-xl bg-amber-600 dark:bg-amber-500 px-5 py-2.5 text-sm font-semibold text-white dark:text-zinc-950 hover:bg-amber-700 dark:hover:bg-amber-400 transition-colors cursor-pointer"
        >
          Mashqqa qaytish
        </button>
      </div>
    </section>
  );
}
