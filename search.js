(function () {
  var INDEX = [
    {
      title: 'База предметов',
      desc: 'Оружие, броня, аксессуары, руны, ивентовые предметы',
      url: 'items_base.html',
      tags: 'предметы оружие броня экипировка руны аксессуары артефакты амулеты кольца',
    },
    {
      title: 'Калькулятор характеристик',
      desc: 'Расчёт характеристик, брони и урона персонажа',
      url: 'stats_calc.html',
      tags: 'статы характеристики броня урон атака защита резисты',
    },
    {
      title: 'Зов Глубин',
      desc: 'Ивент май 2026 — жемчужины, репутация, апгрейды',
      url: 'zov_glubin/glubin_calc.html',
      tags: 'зов глубин ивент жемчужины репутация апгрейд май кальмар осьминог',
    },
    {
      title: 'Месяц цветущего хмеля',
      desc: 'Ивент — хмель, золотой клевер, монеты леприкона',
      url: 'leprecon/hmeli_calc.html',
      tags: 'хмель леприкон клевер ивент апрель монеты',
    },
    {
      title: 'Загруженность копий',
      desc: 'Оптимальные копии локаций для фарма',
      url: 'location_calc/loc_calc.html',
      tags: 'локации копии загруженность фарм подземелья',
    },
    {
      title: 'Прокачка репутаций',
      desc: 'Калькулятор репутаций всех фракций Королевства',
      url: 'reputation_calc/rep_calc.html',
      tags: 'репутации фракции прокачка гвардия гладиатор орден завоеватель',
    },
  ];

  var css = [
    '.search-wrap{position:relative}',
    '.sr{display:none;position:absolute;top:calc(100% + 6px);right:0;width:300px;',
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

  var s = document.createElement('style');
  s.textContent = css;
  document.head.appendChild(s);

  function find(q) {
    q = q.toLowerCase();
    return INDEX.filter(function (item) {
      return (item.title + ' ' + item.desc + ' ' + item.tags).toLowerCase().indexOf(q) !== -1;
    });
  }

  function init() {
    var input = document.querySelector('.search');
    if (!input) return;

    var wrap = document.createElement('div');
    wrap.className = 'search-wrap';
    input.parentNode.insertBefore(wrap, input);
    wrap.appendChild(input);

    var drop = document.createElement('div');
    drop.className = 'sr';
    wrap.appendChild(drop);

    input.addEventListener('input', function () {
      var q = input.value.trim();
      if (q.length < 2) { drop.classList.remove('open'); return; }

      var hits = find(q);
      drop.innerHTML = hits.length
        ? hits.map(function (item) {
            return '<a class="sr-item" href="' + item.url + '">' +
              '<div class="sr-title">' + item.title + '</div>' +
              '<div class="sr-desc">' + item.desc + '</div>' +
              '</a>';
          }).join('')
        : '<div class="sr-empty">Ничего не найдено</div>';
      drop.classList.add('open');
    });

    input.addEventListener('focus', function () {
      if (input.value.trim().length >= 2) drop.classList.add('open');
    });

    document.addEventListener('click', function (e) {
      if (!wrap.contains(e.target)) drop.classList.remove('open');
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
