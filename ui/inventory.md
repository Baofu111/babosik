# Бабосік · KIT — інвентар компонентів

> Реєстр усіх компонентів `ui/kit.css`. Джерело правди для API класів.
> **Правило:** бракує компонента для екрана — спершу додай його **сюди** й у `kit.css`,
> лише тоді використовуй у розмітці. Нового стилю в екранах не з'являється поза цим реєстром.
>
> Живий стенд: [`kit.html`](kit.html) · оболонка: [`shell.html`](shell.html) · значення: `../tokens/tokens.css`.
> Джерела: painted-еталон — `../concept/neo-mirai/*`; сірі стани — `../wireframes/*-empty|error|loading`.

---

## Оболонка (shell)

| Компонент | Класи | Що це | Джерело |
|-----------|-------|-------|---------|
| Каркас | `.app` `.content` | сітка «таб-бар + контент» | painted |
| Таб-бар | `.side` `.brand` `.mark` `.nav` `.nav .cap` `a[aria-current="page"]` `.foot` | рейка навігації (≤900px — горизонтальний таб-бар) | painted |
| Двошарова шапка | `.page-head` · шар 1 `.ph-context` (`.back` `.ph-meta`) · шар 2 `.ph-bar` (`h1` `.sub` `.head-actions`) | контекст-рядок + титул/дії | painted |
| Hero-момент | `.hero` `.rings` `.sun` `.hero-in` `.period` `.total` `.total-row` `.delta`(`.q`) `.hero-actions` | горизонт+сонце; сума нейтральна, delta = увага без присуду | painted (Огляд) |
| Робоча зона | `.work` `.sec-head`(`h2` `.link`) | контейнер секцій екрана | painted |

## Дії та керування

| Компонент | Класи | Стани / варіанти | Джерело |
|-----------|-------|------------------|---------|
| Кнопка | `.btn` `.btn-primary` `.btn-ghost` `.btn-quiet` `.btn-danger` `.btn-block` `.btn-google` | hover · active · focus-visible · `[aria-disabled="true"]` / `:disabled` / `[disabled]` (вимкнений, текст `--n-500`) · `.btn-danger` = деструктив (відключити) | painted + `_wf` (disabled) |
| Група дій | `.state-actions` `.form-actions` | — | painted |

## Дані та мітки

| Компонент | Класи | Варіанти | Джерело |
|-----------|-------|----------|---------|
| Диск категорії | `.disc` + `.food/.cafe/.transport/.utility/.health/.other` | окрема палітра, контраст пораховано | painted |
| Мітка-увага | `.tag-up` | коралова, «більше ніж у травні» (без присуду) | painted (зведено з `_wf .flag`) |
| Мітка якості даних | `.tag-data` | нейтральна, «не та категорія» / «без назви» | painted (зведено з `_wf .flag.data`) |
| Статус системи | `.status` + `.ok/.warn/.err` | лише системні стани (не суми) | painted + `_wf` |

## Списки витрат (3 інтенти замість одного `_wf .cards`)

| Компонент | Класи | Де | Джерело |
|-----------|-------|----|---------|
| Розбивка з часткою | `.breakdown` `.row` `.row-main` `.row-name` `.bar>i` `.row-meta` `.row-sum-wrap`(`.row-sum` `.row-pct`) | Огляд · розбивка | painted |
| Картка витрати | `.top` `a`(`.disc` `.t-main`(`.t-name` `.t-meta`) `.t-sum`) | Огляд · топ витрат | painted |
| Рядок транзакції | `.tx-list` `a`(`.disc` `.tx-main`(`.tx-name` `.tx-meta`) `.tx-sum`) | Транзакції | painted |
| Порівняння | `.cmp` `li`(`.disc` `.cmp-main`(`.cmp-cat` `.cmp-nums`) `.cmp-delta`(`.up/.down/.flat` `.d-sum` `.d-word`)) | Порівняння місяців | painted |

## Форми

| Компонент | Класи | Нотатки | Джерело |
|-----------|-------|---------|---------|
| Картка-контейнер | `.card` | поверхня для форм/секцій | painted |
| Поле | `.field`(`label` `input`/`select`) | focus-ring петроль; `:disabled` | painted |
| Селект | `.field select` / `.filter-row select` | кастомний шеврон + `:open` (стрілка вгору) | painted |
| Роздільник | `.divider` | «або через email» | painted |
| Радіо-опції | `.opts`(`legend` `.opt`) | вибір банку | painted |
| Пікер | `.picker` `.opt` | сітка вибору категорії | painted |
| Інлайн-додавання | `.inline-newcat` `.newcat-row` | «+ Нова категорія» без виходу | painted |
| Фільтр-рядок | `.filter-row`(`.fg` `label`) | пошук + категорія + кнопка | painted |

## Доменні блоки

| Компонент | Класи | Джерело |
|-----------|-------|---------|
| Банк | `.bank`(`.b-icon` `.b-name>b` `.b-meta` `.b-actions`) + `.status` · `flex-wrap` (не вилазить на мобільному) | painted |
| Файл (Експорт) | `.file-row`(`.f-icon` `.f-name>b` `.f-meta`) | painted (замість запозиченого `.bank`) |
| Категорія (CRUD) | `.cat`(`.cat-head`(`.disc` `h3` `.cat-actions`(`a` · `a.danger`=видалити)) `.subs`(`li` `.muted-sub`(`--n-500`) `.sub-actions`(`a` `a.danger`, ціль ≥24px)) `.add-sub`) · `.add-cat`(`summary` `.add-cat-row`) | painted |
| Вхід (auth) | `.auth` `.auth-hero`(`.a-brand` `h1` `.lead` `.trust`) `.auth-form`(`.inner`) | painted (Вхід) |
| Підтвердження (модалка) | `.confirm` native `<dialog>` (`.confirm-in` `form[method=dialog]` `.ic-warn` `h2` `p` `.state-actions`) | деструктив (видалити категорію) не одним кліком; `categories.html` має скрипт-обгортку |

## Стани (структура з вайрфреймів, вигляд з мови)

| Компонент | Класи | Патерн | Джерело |
|-----------|-------|--------|---------|
| Порожній (інлайн) | `.empty-msg` | іконка + текст, що «вчить»; веде до дії | `_wf` `*-empty` |
| Помилка (інлайн) | `.error-msg` | danger-callout: факт + «Дані не втрачено» + вихід | `_wf` `*-error` |
| Повноекранний стан | `.statebox`(`.ic .warm/.err/.info` `h2` `p` `.state-actions`) | цілісний екран-стан (Вхід·помилка) | `_wf` + мова |
| Живий статус | `.loading-status`(`.spinner`) `role="status"` | активне «ми-» дієслово + … | `_wf` `*-loading` |
| Скелетони | `.skel` + `.skel-num/.skel-card/.skel-line(.short)/.skel-field` | теплий shimmer на місці контенту | `_wf` `*-loading` |

## Утиліти

`.muted` (вторинний підпис-текст) · `.reveal` (вхідна анімація, stagger через `animation-delay`) · `prefers-reduced-motion` вимикає рух · усі значення через `var(--…)` з `tokens.css`.

---

## Покриття екранів — 28/28 вдягнено ✅

Усі екрани `../wireframes/` вдягнено в кіт у `../concept/neo-mirai/` (структура+текст із вайрфреймів, вигляд — з кіта; `wireframes/` не змінювались):

- **Success (7):** signin · bank-connect · overview · transactions · transaction-edit · categories · compare
- **Стани (19):** signin `-error/-loading` · bank-connect `-empty/-error/-loading` · overview `-empty/-error/-loading` · transactions `-empty/-error/-loading` · transaction-edit `-error/-loading` · categories `-empty/-error/-loading` · compare `-empty/-error/-loading`
- **Backlog (2):** add-transaction · export

**Додано в кіт під час Фази 2** (нового поза реєстром не з'являлось): `:disabled`/`[disabled]` для кнопок і `.filter-row` контролів · утиліта `.muted`.

**Фаза 3 — правки після critique (2026-08-08):** `.btn-danger` (деструктив) · `.file-row` (Експорт) · `.cat-actions a.danger` / `.sub-actions a.danger` (видалення читається окремо від редагування) · контраст вимкненого/плейсхолдера/`.muted-sub` піднято `--n-300 → --n-500` · іконка `.empty-msg` `--coral-500 → --petrol-600` (порожньо ≠ попередження) · роздільник `.tx-list` `--n-100 → --n-200` · `.bank`/`.b-actions` `flex-wrap` · ціль `.sub-actions` ≥24px · flat-delta дістав нейтральну іконку. Причини — `../tokens/DESIGN.md` (розділ «Правки після critique»).

> Кожен новий екран: підключити `ui/kit.css`, взяти оболонку з `ui/shell.html`, структуру й текст —
> з відповідного вайрфрейма, вигляд — тільки з класів кіта. Бракує компонента → спершу сюди + `kit.css`.
