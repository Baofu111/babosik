/* ─────────────────────────────────────────────────────────────────────────
   Бабосік — спільна навігація (back-office сайдбар зі складками).

   Одне джерело правди для ВСІХ візуалізацій (research/ і voices/).
   Нова сторінка отримує сайдбар автоматично — достатньо двох рядків:

       <nav id="site-nav"></nav>            десь на початку <body>
       <script src="nav.js"></script>       перед </body>
       (з voices/ шлях — "../research/nav.js")

   Шляхи в PAGES — ВІД КОРЕНЯ репо (напр. 'research/research.html',
   'voices/voices.html'). Усі сторінки лежать на один рівень під коренем, тож
   скрипт додає префікс '../' і однаково працює з будь-якої папки.

   Щоб додати сторінку — допиши об'єкт у PAGES нижче (href і mdLink — від кореня).
   ───────────────────────────────────────────────────────────────────────── */
(function () {
  var PAGES = [
    {
      label: 'Phase 1',
      title: 'Аналіз',
      href: 'research/research.html',
      sections: [
        { href: '#competitors', label: 'Конкуренти' },
        { href: '#patterns',    label: 'Патерни' },
        { href: '#jtbd',        label: 'JTBD' },
        { href: '#conclusions', label: 'Висновки' },
      ],
      mdLink: { href: 'research/research.md', label: 'research.md' },
    },
    {
      label: 'Phase 2',
      title: 'Персони',
      href: 'research/personas.html',
      sections: [
        { href: '#personas',    label: 'Персони' },
        { href: '#jobs',        label: 'Jobs' },
        { href: '#matrix',      label: 'Матриця' },
        { href: '#conclusions', label: 'Висновок' },
        { href: '#gaps',        label: 'Прогалини' },
      ],
      mdLink: { href: 'research/personas.md', label: 'personas.md' },
    },
    {
      label: 'Phase 3',
      title: 'Архітектура',
      href: 'research/ia.html',
      sections: [
        { href: '#sitemap', label: 'Sitemap' },
        { href: '#flows',   label: 'Потоки' },
        { href: '#matrix',  label: 'Матриця' },
      ],
      mdLink: { href: 'concept/sitemap.md', label: 'sitemap.md' },
    },
    {
      label: 'Voice',
      title: 'Голос',
      href: 'voices/voices.html',
      sections: [
        { href: '#principles',  label: 'Принципи' },
        { href: '#dictionary',  label: 'Словник' },
        { href: '#forbidden',   label: 'Заборонене' },
        { href: '#competitors', label: 'Конкуренти' },
        { href: '#microcopy',   label: 'Мікрокопі' },
      ],
      mdLink: { href: 'voices/docs/voice.md', label: 'voice.md' },
    },
  ];

  var host = document.getElementById('site-nav');
  if (!host) return;

  /* усі сторінки — на один рівень під коренем репо, тож до кореня завжди '../' */
  var PREFIX = '../';

  /* ── 1. Інжект стилів (один раз) ─────────────────────────────────────── */
  var CSS = '' +
    '#site-nav{position:fixed;top:0;left:0;bottom:0;width:250px;z-index:200;' +
      'height:auto;padding:0;margin:0;display:flex;flex-direction:column;' +
      'overflow-y:auto;background:var(--surface,#141417);' +
      'border:none;border-right:1px solid var(--border,#27272c);' +
      "font-family:'Inter',system-ui,sans-serif;backdrop-filter:none;}" +
    '#site-nav::-webkit-scrollbar{width:8px}' +
    '#site-nav::-webkit-scrollbar-thumb{background:var(--border,#27272c);border-radius:4px}' +

    '#site-nav .sb-head{display:flex;align-items:baseline;gap:8px;' +
      'padding:18px 20px 15px;position:sticky;top:0;z-index:1;' +
      'background:var(--surface,#141417);border-bottom:1px solid var(--border,#27272c)}' +
    '#site-nav .sb-logo{font-weight:700;font-size:16px;letter-spacing:-.3px;' +
      'color:var(--accent,#34d399);text-decoration:none;padding:0}' +
    '#site-nav .sb-sub{font-size:10.5px;font-weight:600;letter-spacing:.09em;' +
      'text-transform:uppercase;color:var(--muted,#6e6e78)}' +

    '#site-nav .sb-nav{padding:8px 8px 20px;display:flex;flex-direction:column;gap:1px}' +
    '#site-nav .sb-group{display:flex;flex-direction:column}' +
    '#site-nav .sb-head-btn{width:100%;display:flex;align-items:center;gap:9px;' +
      'background:none;border:none;cursor:pointer;text-align:left;font-family:inherit;' +
      'font-size:13.5px;font-weight:600;color:var(--text,#e8e8ed);' +
      'padding:9px 10px;border-radius:8px;transition:background .15s,color .15s}' +
    '#site-nav .sb-head-btn:hover{background:var(--surface2,#1c1c20)}' +
    '#site-nav .sb-group.current>.sb-head-btn{color:var(--accent,#34d399)}' +
    '#site-nav .sb-caret{flex-shrink:0;width:9px;height:9px;font-size:9px;line-height:1;' +
      'color:var(--muted,#6e6e78);transition:transform .18s}' +
    '#site-nav .sb-group.open>.sb-head-btn .sb-caret{transform:rotate(90deg)}' +
    '#site-nav .sb-badge{margin-left:auto;font-family:"JetBrains Mono",monospace;' +
      'font-size:9.5px;font-weight:600;letter-spacing:.03em;padding:1px 5px;' +
      'border-radius:4px;color:var(--muted,#6e6e78);background:var(--bg,#0c0c0e);' +
      'border:1px solid var(--border,#27272c)}' +
    '#site-nav .sb-group.current .sb-badge{color:var(--accent,#34d399);' +
      'border-color:rgba(52,211,153,.3);background:rgba(52,211,153,.07)}' +

    '#site-nav .sb-sections{display:none;flex-direction:column;gap:1px;' +
      'margin:2px 0 6px 15px;padding-left:14px;' +
      'border-left:1px solid var(--border,#27272c)}' +
    '#site-nav .sb-group.open>.sb-sections{display:flex}' +
    '#site-nav .sb-sections a{display:block;padding:6px 10px;border-radius:6px;' +
      'font-size:12.5px;font-weight:500;text-decoration:none;background:none;' +
      'color:var(--muted,#6e6e78);transition:color .15s,background .15s}' +
    '#site-nav .sb-sections a:hover{color:var(--text,#e8e8ed);background:var(--surface2,#1c1c20)}' +
    '#site-nav .sb-sections a.active{color:var(--accent,#34d399);' +
      'background:rgba(52,211,153,.08);font-weight:600}' +
    '#site-nav .sb-md{margin-top:4px;display:flex;align-items:center;gap:6px;' +
      'font-family:"JetBrains Mono",monospace;font-size:11px}' +
    '#site-nav .sb-md svg{flex-shrink:0}' +

    'body.has-sidebar{padding-left:250px}' +

    '#sb-toggle{display:none;position:fixed;top:14px;left:14px;z-index:300;' +
      'width:40px;height:40px;align-items:center;justify-content:center;' +
      'background:var(--surface,#141417);border:1px solid var(--border,#27272c);' +
      'border-radius:8px;color:var(--text,#e8e8ed);cursor:pointer;font-size:17px;line-height:1}' +
    '#sb-backdrop{display:none;position:fixed;inset:0;z-index:150;background:rgba(0,0,0,.55)}' +

    '@media (max-width:880px){' +
      'body.has-sidebar{padding-left:0}' +
      'body.has-sidebar .container{padding-top:60px}' +
      '#site-nav{transform:translateX(-100%);transition:transform .22s ease;' +
        'box-shadow:0 0 40px rgba(0,0,0,.5)}' +
      'body.sb-open #site-nav{transform:translateX(0)}' +
      'body.sb-open #sb-backdrop{display:block}' +
      '#sb-toggle{display:flex}' +
    '}';

  var style = document.createElement('style');
  style.id = 'site-nav-style';
  style.textContent = CSS;
  document.head.appendChild(style);

  /* ── 2. Яка сторінка активна (за іменем файлу) ───────────────────────── */
  var currentFile = window.location.pathname.split('/').pop() || 'research.html';
  var currentPage = null;
  for (var i = 0; i < PAGES.length; i++) {
    if (PAGES[i].href.split('/').pop() === currentFile) { currentPage = PAGES[i]; break; }
  }

  var mdSvg = '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" ' +
    'stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 ' +
    '0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>';

  /* ── 3. Побудова сайдбара ────────────────────────────────────────────── */
  function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;'); }

  var html =
    '<div class="sb-head"><a class="sb-logo" href="' + PREFIX + 'research/research.html">Бабосік</a>' +
    '<span class="sb-sub">Docs</span></div><div class="sb-nav">';

  for (var i = 0; i < PAGES.length; i++) {
    var p = PAGES[i];
    var isCur = p === currentPage;
    var gcls = 'sb-group' + (isCur ? ' current open' : '');
    html += '<div class="' + gcls + '" data-href="' + PREFIX + p.href + '">';
    html += '<button class="sb-head-btn" type="button">' +
              '<span class="sb-caret">▶</span>' +
              '<span class="sb-title">' + esc(p.title) + '</span>' +
              '<span class="sb-badge">' + esc(p.label) + '</span></button>';
    html += '<div class="sb-sections">';
    for (var j = 0; j < p.sections.length; j++) {
      var s = p.sections[j];
      var href = isCur ? s.href : (PREFIX + p.href + s.href);
      html += '<a href="' + href + '">' + esc(s.label) + '</a>';
    }
    if (p.mdLink) {
      html += '<a class="sb-md" href="' + PREFIX + p.mdLink.href + '">' + mdSvg +
              esc(p.mdLink.label) + '</a>';
    }
    html += '</div></div>';
  }
  html += '</div>';

  host.innerHTML = html;
  document.body.classList.add('has-sidebar');

  /* toggle + backdrop для мобільних */
  var toggle = document.createElement('button');
  toggle.id = 'sb-toggle';
  toggle.setAttribute('aria-label', 'Меню');
  toggle.innerHTML = '☰';
  var backdrop = document.createElement('div');
  backdrop.id = 'sb-backdrop';
  document.body.appendChild(toggle);
  document.body.appendChild(backdrop);
  function closeDrawer() { document.body.classList.remove('sb-open'); }
  toggle.addEventListener('click', function () { document.body.classList.toggle('sb-open'); });
  backdrop.addEventListener('click', closeDrawer);

  /* ── 4. Складки (акордеон, незалежні) ────────────────────────────────── */
  var groups = host.querySelectorAll('.sb-group');
  for (var g = 0; g < groups.length; g++) {
    (function (group) {
      var btn = group.querySelector('.sb-head-btn');
      btn.addEventListener('click', function () {
        // клік по чужій згорнутій групі → перейти на ту сторінку
        if (!group.classList.contains('current') && !group.classList.contains('open')) {
          window.location.href = group.getAttribute('data-href');
          return;
        }
        group.classList.toggle('open');
      });
    })(groups[g]);
  }

  /* закривати мобільну шухляду після кліку по секції */
  var secLinks = host.querySelectorAll('.sb-sections a');
  for (var k = 0; k < secLinks.length; k++) {
    secLinks[k].addEventListener('click', closeDrawer);
  }

  /* ── 5. Scrollspy: підсвітка активної секції поточної сторінки ────────── */
  if (currentPage && 'IntersectionObserver' in window) {
    var map = {};
    var targets = [];
    for (var m = 0; m < currentPage.sections.length; m++) {
      var id = currentPage.sections[m].href.slice(1);
      var el = document.getElementById(id);
      var link = host.querySelector('.sb-group.current .sb-sections a[href="#' + id + '"]');
      if (el && link) { map[id] = link; targets.push(el); }
    }
    var active = null;
    var obs = new IntersectionObserver(function (entries) {
      for (var e = 0; e < entries.length; e++) {
        if (entries[e].isIntersecting) {
          var link = map[entries[e].target.id];
          if (link && link !== active) {
            if (active) active.classList.remove('active');
            link.classList.add('active');
            active = link;
          }
        }
      }
    }, { rootMargin: '-15% 0px -70% 0px', threshold: 0 });
    for (var t = 0; t < targets.length; t++) obs.observe(targets[t]);
  }
})();
