# Бабосік

Особистий фінансовий менеджер. Автоімпорт з Monobank, ручне введення, категоризація, аналітика.

**Стек:** Next.js 14 · TypeScript · Tailwind CSS · shadcn/ui · Supabase · Vercel

---

## Структура репо

| Папка | Що тут |
|-------|--------|
| [`research/`](./research/) | Конкурентний аналіз, JTBD, референси |
| [`research/screens/`](./research/screens/) | Скріншоти конкурентів та референсів |
| [`wireframes/`](./wireframes/) | Вайрфрейми екранів (lo-fi) |
| [`concept/`](./concept/) | Концептуальні рішення, moodboard |
| [`tokens/`](./tokens/) | Design tokens: кольори, типографіка, відступи |
| [`components/`](./components/) | Документація UI-компонентів |
| [`design-system/`](./design-system/) | Дизайн-система в зібраному вигляді |
| [`handoff/`](./handoff/) | Фінальні специфікації для розробки |

---

## Ключові документи

- [`CLAUDE.md`](./CLAUDE.md) — повний продуктовий бриф, стек, архітектура БД
- [`research/research.md`](./research/research.md) — конкуренти, JTBD, висновки

---

## Статус

| Етап | Статус |
|------|--------|
| Бриф та стек | ✅ Готово |
| Research | 🔄 В процесі |
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
