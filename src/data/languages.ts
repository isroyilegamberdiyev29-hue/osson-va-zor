import { LanguageConfig, LanguageId } from '../types/typing';

export const LANGUAGES: LanguageConfig[] = [
  {
    id: 'uz-latn',
    label: "O'zbekcha (Lotin)",
    shortLabel: 'UZ',
    scriptNote: 'Lotin alifbosi',
    words: [
      'va', 'bu', 'bir', 'uchun', 'bilan', 'ham', 'esa', 'yana', 'yangi', 'katta',
      'kichik', 'yaxshi', 'kerak', 'mumkin', 'har', 'kun', 'vaqt', 'ish', 'uy', 'kitob',
      'ilm', 'maktab', 'talaba', 'ustoz', 'dost', 'oila', 'vatan', 'shahar', 'qishloq', 'daryo',
      'tog', 'osmon', 'quyosh', 'yulduz', 'shamol', 'yomgir', 'qor', 'bahor', 'yoz', 'kuz',
      'qish', 'ertalab', 'kechqurun', 'bugun', 'ertaga', 'kecha', 'hozir', 'doim', 'tez', 'sekin',
      'togri', 'xato', 'aniq', 'oson', 'qiyin', 'kuchli', 'aqlli', 'sabr', 'mehnat', 'harakat',
      'natija', 'maqsad', 'reja', 'fikr', 'soz', 'gap', 'matn', 'harf', 'raqam', 'ovoz',
      'rang', 'oq', 'qora', 'kok', 'yashil', 'qizil', 'sariq', 'yol', 'kocha', 'bino',
      'eshik', 'deraza', 'stol', 'stul', 'qalam', 'daftar', 'kompyuter', 'ekran', 'klaviatura', 'dastur',
      'tarmoq', 'axborot', 'bilim', 'tajriba', 'malaka', 'ijod', 'sanat', 'musiqa', 'sport', 'oyin',
      'yutuq', 'goya', 'imkon', 'sharoit', 'tizim', 'usul', 'qoida', 'tartib', 'halol', 'rost',
      'samimiy', 'chiroyli', 'toza', 'yorug', 'issiq', 'salqin', 'sovuq', 'uzun', 'qisqa', 'baland',
      'past', 'chuqur', 'keng', 'tor', 'ochiq', 'yopiq', 'bosh', 'oxir', 'orta', 'chap',
      "o'ng", "o'zbek", "o'qish", "o'ylash", "o'rganish", "o'yin", "o'rin", "o'lchov", "g'oya", "g'alaba",
      "bo'lish", "ko'rish", "yo'l", "so'z", "to'g'ri", "qo'l", "ko'z", "do'st", "bo'lim", "ko'nikma",
      "ma'no", "ta'lim", "sa'y", "qur'a", "shoshilmay", "boshlash", "tugatish", "yozish", "o'chirish", "tekshirish",
      "saqlash", "tanlash", "ishlash", "yordam", "sifat", "tezlik", "aniqlik", "diqqat", "xotira", "quvvat"
    ],
  },
  {
    id: 'uz-cyrl',
    label: 'Ўзбекча (Кирилл)',
    shortLabel: 'ЎЗ',
    scriptNote: 'Кирилл алифбоси',
    words: [
      'ва', 'бу', 'бир', 'учун', 'билан', 'ҳам', 'эса', 'яна', 'янги', 'катта',
      'кичик', 'яхши', 'керак', 'мумкин', 'ҳар', 'кун', 'вақт', 'иш', 'уй', 'китоб',
      'илм', 'мактаб', 'талаба', 'устоз', 'дўст', 'оила', 'ватан', 'шаҳар', 'қишлоқ', 'дарё',
      'тоғ', 'осмон', 'қуёш', 'юлдуз', 'шамол', 'ёмғир', 'қор', 'баҳор', 'ёз', 'куз',
      'қиш', 'эрталаб', 'кечқурун', 'бугун', 'эртага', 'кеча', 'ҳозир', 'доим', 'тез', 'секин',
      'тўғри', 'хато', 'аниқ', 'осон', 'қийин', 'кучли', 'ақлли', 'сабр', 'меҳнат', 'ҳаракат',
      'натижа', 'мақсад', 'режа', 'фикр', 'сўз', 'гап', 'матн', 'ҳарф', 'рақам', 'овоз',
      'ранг', 'оқ', 'қора', 'кўк', 'яшил', 'қизил', 'сариқ', 'йўл', 'кўча', 'бино',
      'эшик', 'дераза', 'стол', 'стул', 'қалам', 'дафтар', 'дастур', 'тармоқ', 'ахборот', 'билим',
      'тажриба', 'малака', 'ижод', 'мусиқа', 'спорт', 'ўйин', 'ютуқ', 'ғоя', 'имкон', 'шароит',
      'тизим', 'усул', 'қоида', 'тартиб', 'ҳалол', 'рост', 'самимий', 'чиройли', 'тоза', 'ёруғ',
      'иссиқ', 'салқин', 'совуқ', 'узун', 'қисқа', 'баланд', 'паст', 'кенг', 'очиқ', 'ёпиқ',
      'бош', 'охир', 'ўрта', 'чап', 'ўнг', 'ўзбек', 'ўқиш', 'ўйлаш', 'ўрганиш', 'ғалаба',
      'бўлиш', 'кўриш', 'қўл', 'кўз', 'бўлим', 'кўникма', 'таълим', 'бошлаш', 'тугатиш', 'ёзиш',
      'текшириш', 'сақлаш', 'танлаш', 'ишлаш', 'ёрдам', 'сифат', 'тезлик', 'аниқлик', 'диққат', 'хотира'
    ],
  },
  {
    id: 'en',
    label: 'English',
    shortLabel: 'EN',
    scriptNote: 'English (200 common words)',
    words: [
      'the', 'be', 'of', 'and', 'a', 'to', 'in', 'he', 'have', 'it',
      'that', 'for', 'they', 'with', 'as', 'not', 'on', 'she', 'at', 'by',
      'this', 'we', 'you', 'do', 'but', 'from', 'or', 'which', 'one', 'would',
      'all', 'will', 'there', 'say', 'who', 'make', 'when', 'can', 'more', 'if',
      'no', 'man', 'out', 'other', 'so', 'what', 'time', 'up', 'go', 'about',
      'than', 'into', 'could', 'state', 'only', 'new', 'year', 'some', 'take', 'come',
      'these', 'know', 'see', 'use', 'get', 'like', 'then', 'first', 'any', 'work',
      'now', 'may', 'such', 'give', 'over', 'think', 'most', 'even', 'find', 'day',
      'also', 'after', 'way', 'many', 'must', 'look', 'before', 'great', 'back', 'through',
      'long', 'where', 'much', 'should', 'well', 'people', 'down', 'own', 'just', 'because',
      'good', 'each', 'those', 'feel', 'seem', 'how', 'high', 'too', 'place', 'little',
      'world', 'very', 'still', 'nation', 'hand', 'old', 'life', 'tell', 'write', 'become',
      'here', 'show', 'house', 'both', 'between', 'need', 'mean', 'call', 'develop', 'under',
      'last', 'right', 'move', 'thing', 'general', 'school', 'never', 'same', 'another', 'begin',
      'while', 'number', 'part', 'turn', 'real', 'leave', 'might', 'want', 'point', 'form',
      'off', 'child', 'few', 'small', 'since', 'against', 'ask', 'late', 'home', 'interest',
      'large', 'person', 'end', 'open', 'public', 'follow', 'during', 'present', 'without', 'again',
      'hold', 'govern', 'around', 'possible', 'head', 'consider', 'word', 'program', 'problem', 'however',
      'lead', 'system', 'set', 'order', 'eye', 'plan', 'run', 'keep', 'face', 'fact',
      'group', 'play', 'stand', 'increase', 'early', 'course', 'change', 'help', 'line', 'speed'
    ],
  },
  {
    id: 'ru',
    label: 'Русский',
    shortLabel: 'RU',
    scriptNote: 'Кириллица',
    words: [
      'и', 'в', 'не', 'на', 'я', 'быть', 'он', 'с', 'что', 'а',
      'по', 'это', 'она', 'этот', 'к', 'но', 'они', 'мы', 'как', 'из',
      'у', 'который', 'то', 'за', 'свой', 'весь', 'год', 'от', 'так', 'о',
      'для', 'ты', 'же', 'все', 'такой', 'мочь', 'человек', 'сказать', 'один', 'еще',
      'бы', 'себя', 'время', 'если', 'уже', 'когда', 'только', 'кто', 'вот', 'да',
      'говорить', 'знать', 'стать', 'до', 'чтобы', 'дело', 'жизнь', 'первый', 'очень', 'день',
      'рука', 'новый', 'работа', 'слово', 'место', 'где', 'после', 'сам', 'два', 'раз',
      'там', 'видеть', 'нужно', 'дом', 'глаз', 'мир', 'страна', 'случай', 'голова', 'система',
      'вопрос', 'город', 'сила', 'вид', 'сторона', 'земля', 'конец', 'час', 'голос', 'лицо',
      'вода', 'путь', 'свет', 'книга', 'окно', 'утро', 'вечер', 'ночь', 'школа', 'урок',
      'ответ', 'мысль', 'число', 'буква', 'текст', 'экран', 'память', 'опыт', 'цель', 'план',
      'метод', 'порядок', 'правило', 'скорость', 'точность', 'ошибка', 'успех', 'труд', 'знание', 'наука',
      'музыка', 'спорт', 'игра', 'дорога', 'мост', 'река', 'гора', 'лес', 'поле', 'небо',
      'солнце', 'звезда', 'ветер', 'дождь', 'снег', 'весна', 'лето', 'осень', 'зима', 'тепло',
      'быстро', 'медленно', 'точно', 'легко', 'трудно', 'ясно', 'тихо', 'громко', 'прямо', 'рядом',
      'начать', 'делать', 'писать', 'читать', 'искать', 'найти', 'думать', 'понять', 'помнить', 'учить'
    ],
  },
  {
    id: 'tr',
    label: 'Türkçe',
    shortLabel: 'TR',
    scriptNote: 'Türk alfabesi',
    words: [
      've', 'bir', 'bu', 'da', 'de', 'için', 'ile', 'çok', 'ne', 'var',
      'ben', 'sen', 'o', 'biz', 'siz', 'gibi', 'daha', 'en', 'ama', 'her',
      'zaman', 'insan', 'gün', 'yıl', 'iş', 'ev', 'yol', 'su', 'el', 'göz',
      'söz', 'yer', 'büyük', 'küçük', 'yeni', 'eski', 'güzel', 'iyi', 'kötü', 'doğru',
      'yanlış', 'hızlı', 'yavaş', 'kolay', 'zor', 'açık', 'kapalı', 'uzun', 'kısa', 'şimdi',
      'sonra', 'önce', 'bugün', 'yarın', 'dün', 'sabah', 'akşam', 'gece', 'dünya', 'şehir',
      'ülke', 'okul', 'kitap', 'kalem', 'defter', 'bilgi', 'bilim', 'akıl', 'fikir', 'amaç',
      'plan', 'kural', 'sistem', 'yöntem', 'sonuç', 'başarı', 'emek', 'sabır', 'dikkat', 'hız',
      'hata', 'kelime', 'cümle', 'metin', 'harf', 'sayı', 'ses', 'renk', 'beyaz', 'siyah',
      'mavi', 'yeşil', 'kırmızı', 'sarı', 'güneş', 'ay', 'yıldız', 'gökyüzü', 'deniz', 'dağ',
      'orman', 'nehir', 'rüzgar', 'yağmur', 'kar', 'bahar', 'yaz', 'sonbahar', 'kış', 'çalışmak',
      'okumak', 'yazmak', 'düşünmek', 'öğrenmek', 'anlamak', 'bilmek', 'görmek', 'duymak', 'gelmek', 'gitmek',
      'yapmak', 'etmek', 'olmak', 'vermek', 'almak', 'bulmak', 'seçmek', 'başlamak', 'bitirmek', 'beklemek'
    ],
  },
  {
    id: 'de',
    label: 'Deutsch',
    shortLabel: 'DE',
    scriptNote: 'Deutsche Sprache',
    words: [
      'der', 'die', 'das', 'und', 'in', 'zu', 'den', 'von', 'mit', 'ist',
      'auf', 'für', 'nicht', 'ein', 'eine', 'als', 'auch', 'es', 'an', 'werden',
      'aus', 'er', 'hat', 'dass', 'sie', 'nach', 'wird', 'bei', 'einer', 'um',
      'am', 'sind', 'noch', 'wie', 'einem', 'über', 'einen', 'so', 'zum', 'war',
      'haben', 'nur', 'oder', 'aber', 'vor', 'zur', 'bis', 'mehr', 'durch', 'man',
      'sein', 'wurde', 'sei', 'schon', 'wenn', 'wir', 'kann', 'gegen', 'vom', 'können',
      'machen', 'jahr', 'zeit', 'mensch', 'tag', 'hand', 'welt', 'stadt', 'haus', 'buch',
      'wort', 'satz', 'text', 'zahl', 'bild', 'weg', 'ziel', 'plan', 'arbeit', 'schule',
      'lernen', 'lesen', 'schreiben', 'denken', 'wissen', 'sehen', 'hören', 'finden', 'geben', 'nehmen',
      'klein', 'groß', 'neu', 'alt', 'gut', 'schnell', 'langsam', 'richtig', 'falsch', 'klar',
      'einfach', 'schwer', 'stark', 'licht', 'wasser', 'luft', 'feuer', 'erde', 'sonne', 'mond',
      'stern', 'baum', 'berg', 'fluss', 'wind', 'regen', 'schnee', 'frühling', 'sommer', 'herbst',
      'winter', 'heute', 'morgen', 'gestern', 'immer', 'oft', 'jetzt', 'hier', 'dort', 'zusammen'
    ],
  },
  {
    id: 'fr',
    label: 'Français',
    shortLabel: 'FR',
    scriptNote: 'Langue française',
    words: [
      'le', 'la', 'les', 'de', 'des', 'du', 'un', 'une', 'et', 'est',
      'en', 'que', 'qui', 'dans', 'pour', 'pas', 'sur', 'avec', 'plus', 'par',
      'au', 'aux', 'ce', 'cette', 'ces', 'son', 'sa', 'ses', 'nous', 'vous',
      'ils', 'elles', 'mais', 'ou', 'où', 'si', 'comme', 'tout', 'tous', 'bien',
      'faire', 'dire', 'aller', 'voir', 'savoir', 'pouvoir', 'vouloir', 'venir', 'prendre', 'donner',
      'temps', 'jour', 'année', 'monde', 'vie', 'main', 'mot', 'texte', 'livre', 'école',
      'ville', 'maison', 'porte', 'fenêtre', 'table', 'travail', 'idée', 'plan', 'ordre', 'vitesse',
      'erreur', 'juste', 'vrai', 'faux', 'grand', 'petit', 'nouveau', 'jeune', 'bon', 'beau',
      'clair', 'rapide', 'lent', 'simple', 'difficile', 'fort', 'calme', 'matin', 'soir', 'nuit',
      'soleil', 'lune', 'étoile', 'ciel', 'terre', 'mer', 'fleuve', 'montagne', 'vent', 'pluie',
      'neige', 'printemps', 'été', 'automne', 'hiver', 'toujours', 'souvent', 'maintenant', 'ici', 'demain'
    ],
  },
  {
    id: 'es',
    label: 'Español',
    shortLabel: 'ES',
    scriptNote: 'Idioma español',
    words: [
      'el', 'la', 'los', 'las', 'de', 'del', 'un', 'una', 'y', 'en',
      'que', 'por', 'para', 'con', 'no', 'es', 'son', 'como', 'más', 'pero',
      'su', 'sus', 'este', 'esta', 'ese', 'esa', 'todo', 'todos', 'muy', 'bien',
      'hacer', 'decir', 'ver', 'saber', 'poder', 'querer', 'venir', 'tener', 'dar', 'tomar',
      'tiempo', 'día', 'año', 'mundo', 'vida', 'mano', 'palabra', 'texto', 'libro', 'escuela',
      'ciudad', 'casa', 'puerta', 'ventana', 'mesa', 'trabajo', 'idea', 'plan', 'orden', 'velocidad',
      'error', 'cierto', 'falso', 'grande', 'pequeño', 'nuevo', 'viejo', 'bueno', 'claro', 'rápido',
      'lento', 'fácil', 'difícil', 'fuerte', 'mañana', 'tarde', 'noche', 'hoy', 'ayer', 'siempre',
      'nunca', 'ahora', 'aquí', 'sol', 'luna', 'estrella', 'cielo', 'tierra', 'mar', 'río',
      'montaña', 'viento', 'lluvia', 'nieve', 'primavera', 'verano', 'otoño', 'invierno', 'camino', 'luz'
    ],
  },
];

export function getLanguageById(id: LanguageId): LanguageConfig {
  return LANGUAGES.find((l) => l.id === id) || LANGUAGES[0];
}

const PUNCTUATION_ENDINGS = ['.', ',', ',', ';', '!', '?'];

export function generateWordStream(
  languageId: LanguageId,
  count: number,
  options: {
    includePunctuation?: boolean;
    includeNumbers?: boolean;
    customText?: string;
  }
): string[] {
  if (languageId === 'custom' && options.customText?.trim()) {
    const tokens = options.customText
      .trim()
      .replace(/[\u2018\u2019\u02BB]/g, "'")
      .split(/\s+/)
      .filter(Boolean);
    if (tokens.length > 0) {
      const result: string[] = [];
      while (result.length < count) {
        result.push(...tokens);
      }
      return result.slice(0, count);
    }
  }

  const lang = getLanguageById(languageId === 'custom' ? 'uz-latn' : languageId);
  const bank = lang.words;
  const result: string[] = [];
  let prevWord = '';

  for (let i = 0; i < count; i++) {
    if (options.includeNumbers && i > 0 && Math.random() < 0.11) {
      const numLen = Math.floor(Math.random() * 3) + 1;
      const max = Math.pow(10, numLen) - 1;
      const min = numLen === 1 ? 1 : Math.pow(10, numLen - 1);
      const numStr = String(Math.floor(Math.random() * (max - min + 1)) + min);
      result.push(numStr);
      prevWord = numStr;
      continue;
    }

    let word = bank[Math.floor(Math.random() * bank.length)];
    if (word === prevWord && bank.length > 1) {
      word = bank[(bank.indexOf(word) + 1) % bank.length];
    }
    prevWord = word;

    if (options.includePunctuation) {
      const prevEndsSentence =
        i === 0 || (result[i - 1] && /[.!?]$/.test(result[i - 1]));
      if (prevEndsSentence && /^[a-zA-Zа-яА-ЯёЁўқғҳçğıöşüäéèêàâîïôûùñáíóú]/i.test(word)) {
        word = word.charAt(0).toUpperCase() + word.slice(1);
      }
      if (Math.random() < 0.22) {
        const mark =
          PUNCTUATION_ENDINGS[Math.floor(Math.random() * PUNCTUATION_ENDINGS.length)];
        word = word + mark;
      }
    }

    result.push(word);
  }

  return result;
}
