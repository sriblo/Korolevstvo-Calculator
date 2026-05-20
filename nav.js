(function () {
  var page = window.location.pathname.split('/').pop() || 'index_new.html';

  var calcPages = [
    'stats_calc.html', 'hmeli_calc.html', 'hmeli_calc3.html',
    'glubin_calc.html', 'loc_calc.html', 'rep_calc.html',
  ];

  var isHome  = page === 'index_new.html' || page === 'index.html' || page === '';
  var isCalc  = calcPages.indexOf(page) !== -1;
  var isItems = page === 'items_base.html';

  // Inject dropdown + count CSS once
  if (!document.getElementById('nav-shared-css')) {
    var s = document.createElement('style');
    s.id = 'nav-shared-css';
    s.textContent = [
      '.nav-dd{position:relative;display:flex;align-items:center}',
      '.dd-trigger{display:flex;align-items:center;gap:6px;padding:6px 11px;border-radius:6px;',
        'font-size:13px;color:var(--txt2);font-weight:500;cursor:pointer;user-select:none;',
        'transition:background .12s,color .12s}',
      '.dd-trigger:hover{color:var(--txt);background:var(--bg2)}',
      '.dd-trigger.on{color:var(--gold-l);background:var(--bg3)}',
      '.nav-dd.open .dd-trigger{color:var(--gold-l);background:var(--bg3)}',
      '.dd-arrow{width:16px;height:16px;transition:transform .18s;display:inline-flex;align-items:center;justify-content:center;flex-shrink:0}',
      '.nav-dd.open .dd-arrow{transform:rotate(180deg)}',
      '.dd-menu{display:none;position:absolute;top:calc(100% + 8px);left:0;min-width:260px;',
        'background:var(--bg2);border:1px solid var(--line2);border-radius:10px;padding:6px;',
        'z-index:200;box-shadow:0 16px 40px rgba(0,0,0,.6)}',
      '.nav-dd.open .dd-menu{display:block}',
      '.dd-item{display:block;padding:8px 12px;border-radius:6px;font-size:13px;',
        'color:var(--txt2);font-weight:500;transition:background .1s,color .1s;white-space:nowrap}',
      '.dd-item:hover{background:var(--bg3);color:var(--txt)}',
      '.dd-item.ready{color:var(--gold-l)}',
      '.dd-item.ready:hover{background:rgba(212,168,67,.08)}',
      '.dd-item.ready.on{color:var(--gold-l)}',
      '.dd-item.soon{color:var(--txt3);cursor:default;pointer-events:none}',
      '.dd-sep{height:1px;background:var(--line);margin:4px 6px}',
      '.nav .count{font-size:10px;color:var(--txt3);margin-left:4px}',
    ].join('');
    document.head.appendChild(s);
  }

  function a(href, label, active) {
    return '<a' + (active ? ' class="on"' : '') + ' href="' + href + '">' + label + '</a>';
  }

  var navHTML =
    a('index_new.html', 'Главная', isHome) +
    '<div class="nav-dd" id="site-nav-dd">' +
      '<div class="dd-trigger' + (isCalc ? ' on' : '') + '" id="site-nav-trigger">' +
        'Калькуляторы ' +
        '<span class="dd-arrow"><svg width="12" height="12" viewBox="0 0 12 12" fill="none">' +
          '<path d="M2 4L6 8L10 4" stroke="currentColor" stroke-width="1.8" ' +
          'stroke-linecap="round" stroke-linejoin="round"/></svg></span>' +
      '</div>' +
      '<div class="dd-menu" id="site-nav-menu">' +
        '<span class="dd-item soon">Новый год. Колдер</span>' +
        '<span class="dd-item soon">Экспедиция. Сбор припасов</span>' +
        '<span class="dd-item soon">Месяц пробуждения цветов</span>' +
        '<a class="dd-item ready' + (page === 'hmeli_calc.html' ? ' on' : '') + '" href="leprecon/hmeli_calc.html">Месяц цветущего хмеля</a>' +
        '<a class="dd-item ready' + (page === 'glubin_calc.html' ? ' on' : '') + '" href="zov_glubin/glubin_calc.html">Зов Глубин</a>' +
        '<span class="dd-item soon">День Пирата</span>' +
        '<span class="dd-item soon">Экспедиция. Ледяные Острова</span>' +
        '<span class="dd-item soon">Гоблинский Рай</span>' +
        '<span class="dd-item soon">Небесные Драконы</span>' +
        '<span class="dd-item soon">Тыквенный Фестиваль</span>' +
        '<div class="dd-sep"></div>' +
        '<a class="dd-item ready' + (page === 'loc_calc.html' ? ' on' : '') + '" href="location_calc/loc_calc.html">Загруженность копий</a>' +
        '<a class="dd-item ready' + (page === 'rep_calc.html' ? ' on' : '') + '" href="reputation_calc/rep_calc.html">Прокачка репутаций</a>' +
        '<a class="dd-item ready' + (page === 'stats_calc.html' ? ' on' : '') + '" href="stats_calc.html">Характеристики</a>' +
      '</div>' +
    '</div>' +
    a('items_base.html', 'База предметов', isItems) +
    '<a>Гайды<span class="count">скоро</span></a>' +
    '<a>Сообщество</a>';

  // Fill logo
  var logo = document.getElementById('site-logo');
  if (logo) {
    logo.innerHTML =
      '<img src="kor_logo.svg" alt="">' +
      '<div><div class="logo-n">Королевство: База знаний</div></div>';
  }

  var nav = document.getElementById('site-nav');
  if (!nav) return;
  nav.innerHTML = navHTML;

  var dd      = document.getElementById('site-nav-dd');
  var trigger = document.getElementById('site-nav-trigger');
  var menu    = document.getElementById('site-nav-menu');

  trigger.addEventListener('click', function (e) {
    e.stopPropagation();
    dd.classList.toggle('open');
  });
  menu.addEventListener('click', function (e) {
    e.stopPropagation();
  });
  document.addEventListener('click', function () {
    dd.classList.remove('open');
  });
})();
