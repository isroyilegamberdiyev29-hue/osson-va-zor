# TezYoz — Ko‘p tilli tez yozish mashqi

Monkeytype uslubidagi tez yozish va aniqlikni tekshirish veb-ilovasi.

## Xususiyatlar
- Jonli tezlik (**WPM** / **CPM**), **Xatoliklar soni** va **Aniqlik (%)**
- 8 ta til (O‘zbekcha Lotin/Kirill, English, Русский, Türkçe, Deutsch, Français, Español) + **O‘z matningizni kiritish**
- Soniya va daqiqalar bo‘yicha moslashuvchan taymer (`15s` – `60 min`)
- **Qorong‘u** va **Yorug‘** rejimlar
- Sekundma-sekund tezlik va xatolar grafigi hamda natijalar tarixi

## Lokal ishga tushirish

```bash
npm install
npm run dev
```

## GitHub va Vercel orqali joylash

1. Loyihani GitHub repository ga yuklang:
   ```bash
   git init
   git add .
   git commit -m "Initial commit: TezYoz typing app"
   git branch -M main
   git remote add origin https://github.com/<USERNAME>/<REPO_NAME>.git
   git push -u origin main
   ```
2. [vercel.com](https://vercel.com) saytiga kiring va **Add New → Project** tugmasini bosing.
3. GitHub repository ni tanlang (`Framework Preset: Vite` avtomatik aniqlanadi).
4. Hech qanday qo‘shimcha Environment Variable talab qilinmaydi — **Deploy** tugmasini bosing.
