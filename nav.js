(function () {
  var _s = document.currentScript || (function () {
    var ss = document.getElementsByTagName('script');
    return ss[ss.length - 1];
  })();
  var _base = (_s.getAttribute('src') || '').replace(/nav\.js$/, '');

  var page = window.location.pathname.split('/').pop() || 'index_new.html';

  var calcPages = [
    'stats_calc.html', 'hmeli_calc.html', 'hmeli_calc3.html', 'hmeli_calc_v2.html',
    'glubin_calc.html', 'glubin_calc_v2.html', 'loc_calc.html', 'rep_calc.html',
  ];

  var isHome  = page === 'index_new.html' || page === 'index.html' || page === '';
  var isCalc  = calcPages.indexOf(page) !== -1;
  var isItems = page === 'items_base.html';

  // ── CSS ────────────────────────────────────────────────────────────────────
  if (!document.getElementById('nav-shared-css')) {
    var s = document.createElement('style');
    s.id = 'nav-shared-css';
    s.textContent = [
      // header
      '.top{padding:18px 40px;border-bottom:1px solid var(--line);background:rgba(11,9,7,.78);backdrop-filter:blur(20px);position:sticky;top:0;z-index:50;display:flex;align-items:center;gap:18px}',
      '.logo{display:flex;align-items:center;gap:12px}',
      '.logo img{width:30px;height:30px;filter:drop-shadow(0 0 10px rgba(var(--gold-tint),.4))}',
      '.logo-n{font-family:var(--serif);font-size:17px;font-weight:600;letter-spacing:-.01em;line-height:1}',
      '.nav{margin-left:28px;display:flex;gap:4px}',
      '.nav a{padding:7px 12px;border-radius:6px;font-size:13px;color:var(--txt2);font-weight:500;transition:background .12s,color .12s}',
      '.nav a:hover{color:var(--txt);background:var(--bg2)}',
      '.nav a.on{color:var(--gold-l);background:var(--bg3)}',
      // dropdown nav
      '.nav-dd{position:relative;display:flex;align-items:center}',
      '.dd-trigger{display:flex;align-items:center;gap:6px;padding:6px 11px;border-radius:6px;',
        'font-size:13px;color:var(--txt2);font-weight:500;cursor:pointer;user-select:none;',
        'transition:background .12s,color .12s}',
      '.dd-trigger:hover{color:var(--txt);background:var(--bg2)}',
      '.dd-trigger.on{color:var(--gold-l);background:var(--bg3)}',
      '.nav-dd.open .dd-trigger{color:var(--gold-l);background:var(--bg3)}',
      '.dd-arrow{width:16px;height:16px;transition:transform .18s;display:inline-flex;',
        'align-items:center;justify-content:center;flex-shrink:0}',
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
      // responsive top padding (must be after base .top rule to win cascade)
      '@media(max-width:980px){.top{padding-left:16px;padding-right:16px}}',
      '@media(max-width:640px){.top{padding-left:12px;padding-right:12px}}',
      // hamburger
      '.nav-mb-btn{display:none;margin-left:auto;background:none;border:none;color:var(--txt2);cursor:pointer;padding:6px;line-height:1;flex-shrink:0}',
      '.nav-mb-btn:hover{color:var(--txt)}',
      '.nav-mb-overlay{display:none;position:fixed;inset:0;z-index:99;background:rgba(11,9,7,.95);flex-direction:column;padding:0}',
      '.nav-mb-overlay.open{display:flex}',
      '.nav-mb-head{display:flex;align-items:center;gap:12px;padding:16px 20px;border-bottom:1px solid var(--line)}',
      '.nav-mb-close{margin-left:auto;background:none;border:none;color:var(--txt2);cursor:pointer;font-size:22px;line-height:1;padding:4px}',
      '.nav-mb-links{display:flex;flex-direction:column;padding:8px 12px;overflow-y:auto;flex:1}',
      '.nav-mb-link{display:block;padding:12px 12px;border-radius:8px;font-size:15px;color:var(--txt2);font-weight:500;border-bottom:1px solid var(--line)}',
      '.nav-mb-link:last-child{border-bottom:none}',
      '.nav-mb-link:hover,.nav-mb-link.on{color:var(--gold-l);background:rgba(var(--gold-tint),.06)}',
      '.nav-mb-link.soon{color:var(--txt3);pointer-events:none}',
      '.nav-mb-sec{padding:10px 12px 4px;font-size:10px;font-weight:700;letter-spacing:.18em;text-transform:uppercase;color:var(--txt3)}',
      '@media(max-width:640px){.nav{display:none}.site-search{display:none}.nav-mb-btn{display:flex;align-items:center}}',
      // search
      '.site-search{margin-left:auto;position:relative}',
      '.site-search input{background:var(--bg2);border:1px solid var(--line);border-radius:6px;',
        'padding:7px 12px 7px 32px;font-size:12px;color:var(--txt2);width:200px;',
        'font-family:inherit;outline:none;',
        'background-image:url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' ',
        'width=\'12\' height=\'12\' viewBox=\'0 0 12 12\' fill=\'none\' stroke=\'%237a6a50\' stroke-width=\'1.5\'%3E',
        '%3Ccircle cx=\'5\' cy=\'5\' r=\'3.5\'/%3E%3Cpath d=\'M8 8l3 3\'/%3E%3C/svg%3E");',
        'background-repeat:no-repeat;background-position:12px center;transition:border-color .15s}',
      '.site-search input:focus{border-color:var(--line2);color:var(--txt)}',
      '.site-search input::placeholder{color:var(--txt3)}',
      '.sr{display:none;position:absolute;top:calc(100% + 6px);right:0;min-width:280px;',
        'background:var(--bg2);border:1px solid var(--line2);border-radius:10px;',
        'padding:6px;z-index:300;box-shadow:0 16px 40px rgba(0,0,0,.6)}',
      '.sr.open{display:block}',
      '.sr-item{display:block;padding:8px 12px;border-radius:6px;text-decoration:none;',
        'transition:background .1s}',
      '.sr-item:hover{background:var(--bg3)}',
      '.sr-title{font-size:13px;color:var(--txt);font-weight:500}',
      '.sr-desc{font-size:11px;color:var(--txt3);margin-top:2px}',
      '.sr-empty{padding:12px;text-align:center;font-size:13px;color:var(--txt3)}',
    ].join('');
    document.head.appendChild(s);
  }

  // ── Nav ────────────────────────────────────────────────────────────────────
  function a(href, label, active) {
    return '<a' + (active ? ' class="on"' : '') + ' href="' + href + '">' + label + '</a>';
  }

  var isHmeli  = page === 'hmeli_calc.html'  || page === 'hmeli_calc_v2.html';
  var isGlubin = page === 'glubin_calc.html' || page === 'glubin_calc_v2.html';

  var navHTML =
    a(_base + 'index_new.html', 'Главная', isHome) +
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
        '<a class="dd-item ready' + (isHmeli  ? ' on' : '') + '" href="' + _base + 'leprecon/hmeli_calc.html">Месяц цветущего хмеля</a>' +
        '<a class="dd-item ready' + (isGlubin ? ' on' : '') + '" href="' + _base + 'zov_glubin/glubin_calc_v2.html">Зов Глубин</a>' +
        '<span class="dd-item soon">День Пирата</span>' +
        '<span class="dd-item soon">Экспедиция. Ледяные Острова</span>' +
        '<span class="dd-item soon">Гоблинский Рай</span>' +
        '<span class="dd-item soon">Небесные Драконы</span>' +
        '<span class="dd-item soon">Тыквенный Фестиваль</span>' +
        '<div class="dd-sep"></div>' +
        '<a class="dd-item ready' + (page === 'loc_calc.html' ? ' on' : '') + '" href="' + _base + 'location_calc/loc_calc.html">Загруженность копий</a>' +
        '<a class="dd-item ready' + (page === 'rep_calc.html' ? ' on' : '') + '" href="' + _base + 'reputation_calc/rep_calc.html">Прокачка репутаций</a>' +
        '<a class="dd-item ready' + (page === 'stats_calc.html' ? ' on' : '') + '" href="' + _base + 'stats_calc.html">Характеристики</a>' +
      '</div>' +
    '</div>' +
    a(_base + 'items_base.html', 'База предметов', isItems) +
    '<a>Гайды<span class="count">скоро</span></a>' +
    '<a>Сообщество</a>';

  var logo = document.getElementById('site-logo');
  if (logo) {
    logo.innerHTML =
      '<img src="' + _base + 'kor_logo.svg" alt="">' +
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
  menu.addEventListener('click', function (e) { e.stopPropagation(); });
  document.addEventListener('click', function () { dd.classList.remove('open'); });

  // ── Hamburger (mobile) ─────────────────────────────────────────────────────
  var header = nav.closest('header') || nav.parentNode;

  var mbBtn = document.createElement('button');
  mbBtn.className = 'nav-mb-btn';
  mbBtn.setAttribute('aria-label', 'Меню');
  mbBtn.innerHTML = '<svg width="22" height="22" viewBox="0 0 22 22" fill="none"><path d="M3 6h16M3 11h16M3 16h16" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>';
  header.appendChild(mbBtn);

  function mbLinkClass(active, soon) {
    return 'nav-mb-link' + (active ? ' on' : '') + (soon ? ' soon' : '');
  }

  var mbOverlay = document.createElement('div');
  mbOverlay.className = 'nav-mb-overlay';
  mbOverlay.innerHTML =
    '<div class="nav-mb-head">' +
      '<img src="' + _base + 'kor_logo.svg" alt="" style="width:24px;height:24px;filter:drop-shadow(0 0 8px rgba(212,168,67,.4))">' +
      '<span style="font-family:var(--serif);font-size:16px;font-weight:600;color:var(--txt)">Королевство: База знаний</span>' +
      '<button class="nav-mb-close" id="nav-mb-close">✕</button>' +
    '</div>' +
    '<div class="nav-mb-links">' +
      '<a class="' + mbLinkClass(isHome, false) + '" href="' + _base + 'index_new.html">Главная</a>' +
      '<a class="' + mbLinkClass(isItems, false) + '" href="' + _base + 'items_base.html">База предметов</a>' +
      '<div class="nav-mb-sec">Калькуляторы</div>' +
      '<a class="' + mbLinkClass(isHmeli, false) + '" href="' + _base + 'leprecon/hmeli_calc.html">Месяц цветущего хмеля</a>' +
      '<a class="' + mbLinkClass(isGlubin, false) + '" href="' + _base + 'zov_glubin/glubin_calc_v2.html">Зов Глубин</a>' +
      '<a class="' + mbLinkClass(page === 'loc_calc.html', false) + '" href="' + _base + 'location_calc/loc_calc.html">Загруженность копий</a>' +
      '<a class="' + mbLinkClass(page === 'rep_calc.html', false) + '" href="' + _base + 'reputation_calc/rep_calc.html">Прокачка репутаций</a>' +
      '<a class="' + mbLinkClass(page === 'stats_calc.html', false) + '" href="' + _base + 'stats_calc.html">Характеристики</a>' +
      '<div class="nav-mb-sec">Скоро</div>' +
      '<span class="nav-mb-link soon">Гайды</span>' +
      '<span class="nav-mb-link soon">Сообщество</span>' +
    '</div>';
  document.body.appendChild(mbOverlay);

  mbBtn.addEventListener('click', function () { mbOverlay.classList.add('open'); });
  document.getElementById('nav-mb-close').addEventListener('click', function () { mbOverlay.classList.remove('open'); });
  mbOverlay.addEventListener('click', function (e) { if (e.target === mbOverlay) mbOverlay.classList.remove('open'); });

  // ── Search ─────────────────────────────────────────────────────────────────
  var INDEX = [
    { title: 'База предметов', desc: 'Оружие, броня, аксессуары, руны, ивентовые предметы', url: 'items_base.html', tags: 'предметы оружие броня экипировка руны аксессуары артефакты амулеты кольца' },
    { title: 'Калькулятор характеристик', desc: 'Расчёт характеристик, брони и урона персонажа', url: 'stats_calc.html', tags: 'статы характеристики броня урон атака защита резисты' },
    { title: 'Зов Глубин', desc: 'Ивент май 2026 — жемчужины, репутация, апгрейды', url: 'zov_glubin/glubin_calc.html', tags: 'зов глубин ивент жемчужины репутация апгрейд май' },
    { title: 'Месяц цветущего хмеля', desc: 'Ивент — хмель, золотой клевер, монеты леприкона', url: 'leprecon/hmeli_calc.html', tags: 'хмель леприкон клевер ивент монеты' },
    { title: 'Загруженность копий', desc: 'Оптимальные копии локаций для фарма', url: 'location_calc/loc_calc.html', tags: 'локации копии загруженность фарм подземелья' },
    { title: 'Прокачка репутаций', desc: 'Калькулятор репутаций всех фракций Королевства', url: 'reputation_calc/rep_calc.html', tags: 'репутации фракции прокачка гвардия гладиатор орден завоеватель' },
  ];

  var sw = document.createElement('div');
  sw.className = 'site-search';
  sw.innerHTML = '<input placeholder="Поиск по базе…" autocomplete="off" spellcheck="false"><div class="sr" id="site-sr"></div>';
  header.appendChild(sw);

  var inp  = sw.querySelector('input');
  var drop = sw.querySelector('.sr');

  function find(q) {
    q = q.toLowerCase();
    return INDEX.filter(function (item) {
      return (item.title + ' ' + item.desc + ' ' + item.tags).toLowerCase().indexOf(q) !== -1;
    });
  }

  inp.addEventListener('input', function () {
    var q = inp.value.trim();
    if (q.length < 2) { drop.classList.remove('open'); return; }
    var hits = find(q);
    drop.innerHTML = hits.length
      ? hits.map(function (h) {
          return '<a class="sr-item" href="' + _base + h.url + '"><div class="sr-title">' + h.title +
            '</div><div class="sr-desc">' + h.desc + '</div></a>';
        }).join('')
      : '<div class="sr-empty">Ничего не найдено</div>';
    drop.classList.add('open');
  });

  inp.addEventListener('focus', function () {
    if (inp.value.trim().length >= 2) drop.classList.add('open');
  });

  document.addEventListener('click', function (e) {
    if (!sw.contains(e.target)) drop.classList.remove('open');
  });
})();
