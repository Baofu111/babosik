# Flows — Бабосік

> Потоки для ключових related jobs з [`../research/jtbd.md`](../research/jtbd.md).
> Візуальна версія: [`../research/ia.html`](https://baofu111.github.io/babosik/research/ia.html).
> Екрани — зі [`sitemap.md`](sitemap.md).
>
> Легенда: `[Екран]` — зі sitemap · `{Рішення?}` — розгалуження · `([Стан])` — empty/error/loading
> (стан екрана, **не** окремий екран) · `((Кінець))` — успіх / вихід / тупик.
>
> **Ревізія після розбору ІА:** додано відсутні стани (loading/error на Реєстрації, Списку,
> створенні категорії), виходи з тупиків (порожній Огляд тепер пропонує дію; AuthError має escape;
> порожній фільтр веде в ручне додавання; порожнє Порівняння повертає в Огляд), і контекстний
> вхід у RJ-2 (тап по категорії в Огляді = 2 тапи).

---

## Flow A — `RJ-1` Зібрати картину без рутини *(+ `RJ-5`, `EJ-2` — перший прохід)*

> Happy-path: Реєстрація → підключив банк → одразу бачу свою картину.
> Тупик лишається один і чесний: людина проігнорувала порожній стан і пішла.

```mermaid
flowchart TD
  Start(("Старт:<br/>перший вхід")) --> Reg["Вхід / Реєстрація"]
  Reg --> RegLoad(["loading: авторизація"])
  RegLoad --> RegOk{"Вхід успішний?"}
  RegOk -->|ні| RegErr(["error: вхід не вдався"])
  RegErr --> Reg
  RegOk -->|так| Conn["Підключення банків"]
  Conn --> ConnEmpty(["empty: ще немає підключень"])
  ConnEmpty --> Auth{"Доступ до банку надано?"}
  Auth -->|ні| AuthErr(["error: доступ відхилено<br/>або токен невірний"])
  AuthErr --> AuthRetry{"Спробувати ще раз?"}
  AuthRetry -->|так| Conn
  AuthRetry -->|ні| Help(("ВИХІД:<br/>допомога / інший банк / пізніше"))
  Auth -->|так| Load(["loading: тягнемо транзакції"])
  Load --> Sync{"Синхронізація успішна?"}
  Sync -->|ні| SyncErr(["error: збій синхронізації"])
  SyncErr --> Conn
  Sync -->|так| HasTx{"Є транзакції за період?"}
  HasTx -->|ні| OvEmpty(["empty: Огляд ще порожній —<br/>дані тягнуться / порожній місяць"])
  OvEmpty --> OvAction{"Дія з порожнього стану?"}
  OvAction -->|"оновити / зачекати"| Load
  OvAction -->|"підключити ще банк"| Conn
  OvAction -->|"проігнорував"| Drop(("ТУПИК:<br/>закрив, не повернувся"))
  HasTx -->|так| Overview["Огляд за місяць"]
  Overview --> Done(("УСПІХ:<br/>бачить свою картину"))

  classDef happy fill:#0e1e18,stroke:#34d399,color:#e8e8ed;
  classDef dead fill:#1d1010,stroke:#f87171,color:#e8e8ed;
  classDef exit fill:#111220,stroke:#818cf8,color:#e8e8ed;
  class Overview,Done happy;
  class Drop dead;
  class Help exit;
```

---

## Flow B — `RJ-2` Привести картину у відповідність до свого життя

> Happy-path: помітила «Інше» → контекстний тап → знайшла → перенесла (категорію створює інлайн) → картина оновилась.
> Тупик: за фільтром нічого і здалась. Вихід: «це готівка → додати» (ручне додавання, backlog).

```mermaid
flowchart TD
  Start(("Старт")) --> Overview["Огляд за місяць"]
  Overview -->|"тап по «Інше»<br/>(контекст, 2 тапи)"| TxLoad(["loading: вантажимо транзакції"])
  Overview -->|"вкладка Транзакції"| TxLoad
  TxLoad --> TxLoadOk{"Список завантажився?"}
  TxLoadOk -->|ні| TxErr(["error: не вдалось<br/>завантажити список"])
  TxErr --> TxLoad
  TxLoadOk -->|так| TxList["Список транзакцій"]
  TxList --> Found{"Знайшла потрібну<br/>транзакцію?"}
  Found -->|ні| ListEmpty(["empty: за фільтром нічого"])
  ListEmpty --> Alt{"Що далі?"}
  Alt -->|"уточнити пошук"| TxList
  Alt -->|"готівка → додати"| ManualBL(("ВИХІД:<br/>ручне додавання (backlog)"))
  Alt -->|"здалась"| GiveUp(("ТУПИК:<br/>не знайшла, покинула"))
  Found -->|так| TxEdit["Транзакція: правка"]
  TxEdit --> CatExists{"Категорія<br/>вже існує?"}
  CatExists -->|ні| NewCat(["контекст: + Нова категорія<br/>інлайн у пікері"])
  NewCat --> NewCatOk{"Створилась?"}
  NewCatOk -->|ні| CatErr(["error: не вдалось<br/>створити категорію"])
  CatErr --> TxEdit
  NewCatOk -->|так| Save(["loading: зберігаємо"])
  CatExists -->|так| Save
  Save --> Saved{"Збереглось?"}
  Saved -->|ні| SaveErr(["error: не вдалось зберегти"])
  SaveErr --> TxEdit
  Saved -->|так| Overview2["Огляд за місяць"]
  Overview2 --> Done(("УСПІХ:<br/>картина = реальне життя"))

  classDef happy fill:#0e1e18,stroke:#34d399,color:#e8e8ed;
  classDef dead fill:#1d1010,stroke:#f87171,color:#e8e8ed;
  classDef exit fill:#111220,stroke:#818cf8,color:#e8e8ed;
  class Overview2,Done happy;
  class GiveUp dead;
  class ManualBL exit;
```

> **Глибина RJ-2:** контекстний вхід (тап по категорії в Огляді) = 2 тапи до правки.
> Створення категорії — інлайн у пікері, **без** переходу на екран «Категорії», тож happy-path
> лишається ≤ 3 тапів навіть коли категорії ще немає.

---

## Flow C — `RJ-4` Зрозуміти чи я змінююсь

> Happy-path: перемкнула на порівняння → бачить цей місяць проти попереднього.
> Порожній стан (один місяць даних) тепер **повертає в Огляд**, а не лишає в тупику.

```mermaid
flowchart TD
  Start(("Старт")) --> Overview["Огляд за місяць"]
  Overview -->|"перемикач «Порівняння»"| HasPrev{"Є попередній<br/>місяць даних?"}
  HasPrev -->|ні| CompEmpty(["empty: лише один місяць,<br/>нема з чим порівняти"])
  CompEmpty --> Wait(("М'який вихід:<br/>прийти за місяць"))
  Wait --> Overview
  HasPrev -->|так| Load(["loading: рахуємо порівняння"])
  Load --> Calc{"Дані дорахувались?"}
  Calc -->|ні| CalcErr(["error: не вдалось порахувати"])
  CalcErr --> Overview
  Calc -->|так| Compare["Порівняння місяців"]
  Compare --> Done(("УСПІХ:<br/>бачить динаміку"))

  classDef happy fill:#0e1e18,stroke:#34d399,color:#e8e8ed;
  classDef exit fill:#111220,stroke:#818cf8,color:#e8e8ed;
  class Compare,Done happy;
  class Wait exit;
```

---

## Звірка зі sitemap

Усі вузли-екрани присутні в [`sitemap.md`](sitemap.md) → «Екрани»: Вхід/Реєстрація, Підключення банків,
Огляд за місяць, Список транзакцій, Транзакція: правка, Категорії та підкатегорії, Порівняння місяців.
`empty / error / loading` та інлайн-створення категорії — стани й контекстні дії цих екранів, не нові екрани.
«Ручне додавання» — вихід у backlog-функцію (поза MVP-скоупом, див. sitemap → Backlog).
