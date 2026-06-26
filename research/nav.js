(function () {
  var PAGES = [
    {
      label: 'Phase 1',
      href: 'research.html',
      sections: [
        { href: '#competitors', label: 'Конкуренти' },
        { href: '#patterns',    label: 'Патерни' },
        { href: '#jtbd',        label: 'JTBD' },
        { href: '#conclusions', label: 'Висновки' },
      ],
      mdLink: { href: 'research.md', label: 'research.md' },
    },
    {
      label: 'Phase 2',
      href: 'personas.html',
      sections: [
        { href: '#personas',    label: 'Персони' },
        { href: '#jobs',        label: 'Jobs' },
        { href: '#matrix',      label: 'Матриця' },
        { href: '#conclusions', label: 'Висновок' },
        { href: '#gaps',        label: 'Прогалини' },
      ],
      mdLink: { href: 'personas.md', label: 'personas.md' },
    },
  ];

  var nav = document.getElementById('site-nav');
  if (!nav) return;

  var currentFile = window.location.pathname.split('/').pop() || 'research.html';
  var currentPage = null;
  for (var i = 0; i < PAGES.length; i++) {
    if (PAGES[i].href === currentFile) { currentPage = PAGES[i]; break; }
  }

  var html = '<span class="logo">Бабосік</span>';

  for (var i = 0; i < PAGES.length; i++) {
    var p = PAGES[i];
    var cls = 'page-link' + (p === currentPage ? ' active' : '');
    html += '<a href="' + p.href + '" class="' + cls + '">' + p.label + '</a>';
  }

  if (currentPage && currentPage.sections.length) {
    html += '<span class="nav-sep"></span>';
    for (var i = 0; i < currentPage.sections.length; i++) {
      var s = currentPage.sections[i];
      html += '<a href="' + s.href + '">' + s.label + '</a>';
    }
  }

  if (currentPage && currentPage.mdLink) {
    var md = currentPage.mdLink;
    html += '<a href="' + md.href + '" class="md-link">'
      + '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">'
      + '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>'
      + '<polyline points="14 2 14 8 20 8"/></svg>'
      + md.label + '</a>';
  }

  nav.innerHTML = html;
})();
