/*
 * Спільна оболонка лабораторного стенда: бокова панель + хедер з перемикачем версій.
 * Оболонка однакова на всіх версіях, тому між версіями змінюється лише вміст <main>.
 * Тексти оболонки навмисно не містять написів тестових кнопок, щоб не заважати
 * алгоритму самовідновлення Testim.
 */
(function () {
  var PAGES = [
    {
      id: 'task2', dir: 'task2',
      group: 'Завдання 2 · DOM-мутація',
      title: 'Форма авторизації',
      versions: [
        { v: 'v1', label: 'v1 — базова версія', changes: 'Початкова сторінка: кнопка з унікальними id та class.' },
        { v: 'v2', label: 'v2 — змінено id, class і контейнер', changes: 'Змінено id, class кнопки та структуру батьківського контейнера. Текст кнопки той самий.' },
        { v: 'v3', label: 'v3 — змінено ще й текст', changes: 'Як v2, але додатково змінено текст кнопки. Перевірка межі самовідновлення.' },
        { v: 'v4', label: 'v4 — хибний кандидат', changes: 'Як v3, але поруч з\'явилася друга кнопка того ж типу, яка зайняла попередню позицію основної.' }
      ]
    },
    {
      id: 'task3', dir: 'task3',
      group: 'Завдання 3 · Review та Merge',
      title: 'Картка товару',
      versions: [
        { v: 'v1', label: 'v1 — базова версія', changes: 'Дві кнопки: основна дія (кошик) і другорядна (обране). Лічильники кошика й обраного.' },
        { v: 'v2', label: 'v2 — міграція елементів', changes: 'Змінено текст основної кнопки, CSS-класи переставлено, кнопки поміняно місцями.' },
        { v: 'v3', label: 'v3 — посилена пастка', changes: 'Другорядна кнопка отримала старий клас, стиль і схожий текст основної кнопки.' }
      ]
    },
    {
      id: 'task4a', dir: 'task4a',
      group: 'Завдання 4 · A/B стабільність',
      title: 'Каталог A (data-testid)',
      versions: [
        { v: 'it0', label: 'it0 — базова версія', changes: 'Сітка з трьох карток. Стабільні data-testid атрибути.' },
        { v: 'it1', label: 'it1 — сітка → список', changes: 'Картки перебудовано у список, нові хеш-класи. data-testid без змін.' },
        { v: 'it2', label: 'it2 — новий порядок', changes: 'Змінено порядок товарів, додано обгортки, нові хеш-класи. data-testid без змін.' },
        { v: 'it3', label: 'it3 — редизайн картки', changes: 'Кнопку перенесено вгору картки, змінено текст і стилі, нові хеш-класи. data-testid без змін.' }
      ]
    },
    {
      id: 'task4b', dir: 'task4b',
      group: 'Завдання 4 · A/B стабільність',
      title: 'Каталог B (динамічні класи)',
      versions: [
        { v: 'it0', label: 'it0 — базова версія', changes: 'Та сама розмітка, що й у варіанті A, але без data-testid. Лише хеш-класи.' },
        { v: 'it1', label: 'it1 — сітка → список', changes: 'Картки перебудовано у список, нові хеш-класи.' },
        { v: 'it2', label: 'it2 — новий порядок', changes: 'Змінено порядок товарів, додано обгортки, нові хеш-класи.' },
        { v: 'it3', label: 'it3 — редизайн картки', changes: 'Кнопку перенесено вгору картки, змінено текст і стилі, нові хеш-класи.' }
      ]
    }
  ];

  var body = document.body;
  var root = body.getAttribute('data-root') || './';
  var pageId = body.getAttribute('data-page');
  var version = body.getAttribute('data-version');
  var page = null, ver = null;
  PAGES.forEach(function (p) {
    if (p.id === pageId) {
      page = p;
      p.versions.forEach(function (x) { if (x.v === version) ver = x; });
    }
  });

  function el(tag, cls, text) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text) e.textContent = text;
    return e;
  }

  // ---------- Бокова панель ----------
  var side = el('nav', 'lab-shell-sidebar');
  side.setAttribute('aria-label', 'Сторінки стенда');
  var brand = el('a', 'lab-shell-brand');
  brand.href = root + 'index.html';
  brand.appendChild(el('span', 'lab-shell-brand-mark', 'ЛР1'));
  brand.appendChild(el('span', 'lab-shell-brand-text', 'Self-healing стенд'));
  side.appendChild(brand);

  var home = el('a', 'lab-shell-link' + (!pageId ? ' is-active' : ''), 'Огляд та інструкція');
  home.href = root + 'index.html';
  side.appendChild(home);

  var lastGroup = null;
  PAGES.forEach(function (p) {
    if (p.group !== lastGroup) {
      side.appendChild(el('div', 'lab-shell-group', p.group));
      lastGroup = p.group;
    }
    var a = el('a', 'lab-shell-link' + (p.id === pageId ? ' is-active' : ''), p.title);
    a.href = root + p.dir + '/' + p.versions[0].v + '.html';
    side.appendChild(a);
  });

  // ---------- Хедер ----------
  var header = el('header', 'lab-shell-header');
  var burger = el('button', 'lab-shell-burger');
  burger.type = 'button';
  burger.setAttribute('aria-label', 'Меню');
  burger.innerHTML = '<span></span><span></span><span></span>';
  burger.addEventListener('click', function () { body.classList.toggle('lab-shell-open'); });
  header.appendChild(burger);

  var titleWrap = el('div', 'lab-shell-title');
  titleWrap.appendChild(el('div', 'lab-shell-title-group', page ? page.group : 'Лабораторна робота 1'));
  titleWrap.appendChild(el('div', 'lab-shell-title-main', page ? page.title : 'Огляд стенда'));
  header.appendChild(titleWrap);

  if (page) {
    var picker = el('label', 'lab-shell-picker');
    picker.appendChild(el('span', 'lab-shell-picker-label', 'Версія'));
    var select = el('select', 'lab-shell-select');
    page.versions.forEach(function (x) {
      var o = el('option', null, x.label);
      o.value = x.v;
      if (x.v === version) o.selected = true;
      select.appendChild(o);
    });
    select.addEventListener('change', function () {
      location.href = root + page.dir + '/' + select.value + '.html';
    });
    picker.appendChild(select);
    header.appendChild(picker);
  }

  // ---------- Збірка ----------
  var main = document.querySelector('main');
  var frame = el('div', 'lab-shell-frame');
  var content = el('div', 'lab-shell-content');
  if (ver) {
    var note = el('div', 'lab-shell-note');
    note.appendChild(el('span', 'lab-shell-note-tag', ver.v));
    note.appendChild(el('span', 'lab-shell-note-text', ver.changes));
    content.appendChild(note);
  }
  main.parentNode.insertBefore(frame, main);
  content.appendChild(main);
  frame.appendChild(header);
  frame.appendChild(content);
  body.insertBefore(side, frame);

  var scrim = el('div', 'lab-shell-scrim');
  scrim.addEventListener('click', function () { body.classList.remove('lab-shell-open'); });
  body.appendChild(scrim);
})();
