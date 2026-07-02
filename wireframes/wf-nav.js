/* ─────────────────────────────────────────────────────────────────────────
   Вайрфрейми — спільна ліва панель НАВІГАЦІЇ ДЕРЕВОМ.

   Одне джерело правди для всіх сторінок wireframes/. Нова сторінка отримує
   ту саму панель, підключивши лише:

       <script src="wf-nav.js"></script>      перед </body>

   Скрипт сам інжектить сірі стилі й дерево, додає body.has-wf-nav (зсув
   контенту праворуч) і позначає поточну сторінку. Grey-box, без кольору —
   як решта вайрфреймів. Усі селектори під .wf-tree (клас), тож перебивають
   правила `nav ul`/`nav a` конкретної сторінки.

   Структура — зі _screens.md (тільки РЕАЛЬНІ стани, де в матриці ✓) і
   sitemap.md. Нічого не вигадуємо. Щоб додати екран/стан — допиши SCREENS.
   Іменування файлів — за _conventions.md: успіх = <slug>.html (базова),
   решта = <slug>-<стан>.html.
   ───────────────────────────────────────────────────────────────────────── */
(function () {
  var ROOT = 'Головний flow · Flow A';

  var SCREENS = [
    {
      name: 'Підключення банків',            // sitemap.md · RJ-1
      states: [                              // _screens.md: 4 стани реальні
        { label: 'Порожній',     file: 'bank-connect-empty.html' },
        { label: 'Помилка',      file: 'bank-connect-error.html' },
        { label: 'Завантаження', file: 'bank-connect-loading.html' },
        { label: 'Успіх',        file: 'bank-connect.html' },
      ],
    },
    {
      name: 'Огляд за місяць',               // sitemap.md · MJ
      states: [                              // _screens.md: порожній + успіх
        { label: 'Порожній', file: 'overview-empty.html' },
        { label: 'Успіх',    file: 'overview.html' },
      ],
    },
  ];

  /* ── стилі (сірі, під .wf-tree) ──────────────────────────────────────── */
  var CSS = '' +
    'body.has-wf-nav{margin:0 0 0 234px;max-width:720px;padding:16px}' +
    '.wf-tree{position:fixed;top:0;left:0;width:218px;height:100vh;overflow:auto;' +
      'box-sizing:border-box;padding:14px 12px;background:#ececec;' +
      'border-right:1px solid #999;font-family:system-ui,sans-serif;' +
      'font-size:13px;color:#333;line-height:1.4}' +
    '.wf-tree .wf-title{font-size:12px;font-weight:700;color:#111;' +
      'text-transform:uppercase;letter-spacing:.04em}' +
    '.wf-tree .wf-sub{font-size:11px;color:#555;margin:2px 0 12px;' +
      'padding-bottom:8px;border-bottom:1px dashed #999}' +
    '.wf-tree ul{list-style:none;margin:0;padding:0;display:block}' +
    '.wf-tree .wf-scr{margin-bottom:10px}' +
    '.wf-tree .wf-scr-name{display:block;font-weight:700;color:#111;' +
      'padding:3px 4px;font-size:12.5px}' +
    '.wf-tree .wf-states{margin:2px 0 0 7px;padding-left:9px;' +
      'border-left:1px solid #999}' +          /* відступ + лінія = вкладеність */
    '.wf-tree .wf-states li{margin:1px 0}' +
    '.wf-tree a{display:block;text-decoration:none;color:#333;background:none;' +
      'border:1px solid transparent;padding:3px 6px;font-size:12.5px}' +
    '.wf-tree a:hover{background:#dcdcdc}' +
    '.wf-tree a[aria-current="page"]{background:#c4c4c4;color:#000;font-weight:700;' +
      'border:1px solid #666}' +
    '@media (max-width:760px){' +
      'body.has-wf-nav{margin-left:0}' +
      '.wf-tree{position:static;width:auto;height:auto;border-right:none;' +
        'border-bottom:1px solid #999;margin-bottom:12px}' +
    '}';

  var style = document.createElement('style');
  style.id = 'wf-nav-style';
  style.textContent = CSS;
  document.head.appendChild(style);

  /* ── поточна сторінка ────────────────────────────────────────────────── */
  var current = window.location.pathname.split('/').pop() || 'overview.html';

  function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;'); }

  /* ── побудова дерева ─────────────────────────────────────────────────── */
  var html = '<p class="wf-title">Вайрфрейми</p><p class="wf-sub">' + esc(ROOT) + '</p><ul>';
  for (var i = 0; i < SCREENS.length; i++) {
    var scr = SCREENS[i];
    html += '<li class="wf-scr"><span class="wf-scr-name">' + esc(scr.name) + '</span>';
    html += '<ul class="wf-states">';
    for (var j = 0; j < scr.states.length; j++) {
      var st = scr.states[j];
      var cur = st.file === current ? ' aria-current="page"' : '';
      html += '<li><a href="' + st.file + '"' + cur + '>' + esc(st.label) + '</a></li>';
    }
    html += '</ul></li>';
  }
  html += '</ul>';

  var panel = document.createElement('nav');
  panel.className = 'wf-tree';
  panel.setAttribute('aria-label', 'Дерево екранів вайрфреймів');
  panel.innerHTML = html;

  document.body.classList.add('has-wf-nav');
  document.body.insertBefore(panel, document.body.firstChild);
})();
