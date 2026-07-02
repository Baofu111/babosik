# Бабосік

Особистий фінансовий менеджер. Автоімпорт з Monobank, ручне введення, категоризація, аналітика.

**Стек:** Next.js 14 · TypeScript · Tailwind CSS · shadcn/ui · Supabase · Vercel

---

## Структура репо

| Папка | Що тут |
|-------|--------|
| [`research/`](./research/) | Конкурентний аналіз, JTBD, UX-патерни, референси |
| [`research/screens/`](./research/screens/) | Скріншоти конкурентів з посиланнями |
| [`concept/`](./concept/) | Інформаційна архітектура: `sitemap.md`, `flows.md` |
| [`tokens/`](./tokens/) | Design tokens: кольори, типографіка, відступи |
| [`components/`](./components/) | Документація UI-компонентів |
| [`design-system/`](./design-system/) | Дизайн-система в зібраному вигляді |
| [`handoff/`](./handoff/) | Фінальні специфікації для розробки |

---

## Ключові документи

- [`CLAUDE.md`](./CLAUDE.md) — повний продуктовий бриф, стек, архітектура БД, висновки дослідження, ІА
- [`research/research.md`](./research/research.md) — конкуренти, JTBD, UX-патерни, висновки *(для Claude)*
- [`research/research.html`](https://baofu111.github.io/babosik/research/research.html) — візуальна версія research *(для людини)*

### Інформаційна архітектура (`concept/`)

| Файл | Що тут |
|------|--------|
| [`concept/sitemap.md`](./concept/sitemap.md) | Сутності → екрани (дерево з jobs) → навігація і глибина → матриця трасування. Кожен екран прив'язаний до job; сироти позначені |
| [`concept/flows.md`](./concept/flows.md) | 3 потоки (Mermaid) для ключових jobs `RJ-1` / `RJ-2` / `RJ-4`: happy-path, стани empty/error/loading, виходи з тупиків |
| [`research/ia.html`](https://baofu111.github.io/babosik/research/ia.html) | Візуальна версія ІА: sitemap + потоки + матриця *(для людини)* |

---

## Дослідження

**Проведено:** аналіз 5 конкурентів, 4 JTBD, порівняння 5 UX-патернів.

### Ключові висновки

| Інсайт | Що робимо |
|--------|-----------|
| Користувачі хочуть автоматизацію + контроль | Monobank автоімпорт + ручне редагування |
| Стандартні категорії не підходять | CRUD своїх категорій і підкатегорій — MVP |
| Аналітика має читатись з першого погляду | Дашборд (Snapshot-first) — основний UX-патерн |
| Бюджети без даних виглядають зламано | Goal/Budget Contrast — відкладено на post-MVP |

### Конкуренти

| Продукт | Сильне | Слабке |
|---------|--------|--------|
| [Monobank](https://www.monobank.ua/) | Категоризація, дизайн | Немає кастомних категорій |
| [YNAB](https://www.ynab.com/) | Система бюджетів | Складно, дорого, англійська |
| [CoinKeeper](https://coinkeeper.me/) | Симпатичний UI | Застарів, мало автоматизації |
| [Spendee](https://www.spendee.com/) | Мультибанк, дизайн | Платне, не локалізоване для UA |
| Notion (самописний) | Гнучкість | Немає автоімпорту |

### UX-патерн для MVP

**Snapshot / Summary-first** — дашборд з агрегатами. Обраний тому що:
1. MVP-вимоги (аналітика по категоріях, топ витрат, порівняння місяців) — це і є дашборд
2. Агрегати кешуються → швидкість без спінерів
3. Десктоп як основний — дашборд масштабується природно

→ Детальний аналіз патернів: [`research/research.md`](./research/research.md)

---

## Статус

| Етап | Статус |
|------|--------|
| Бриф та стек | ✅ Готово |
| Research | ✅ Готово |
| Інформаційна архітектура | ✅ Готово |
| Wireframes | ⬜ Не розпочато |
| Design tokens | ⬜ Не розпочато |
| Концепт | ⬜ Не розпочато |
| Design system | ⬜ Не розпочато |
| Handoff | ⬜ Не розпочато |
| Dev (Next.js) | ⬜ Не розпочато |

---

## Швидкий старт (dev)

```bash
npm install
cp .env.example .env.local  # заповнити Supabase + Monobank keys
npm run dev
```

Push в `main` → GitHub Actions (lint + tests) → Vercel auto-deploy.
