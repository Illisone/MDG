// ============================================================
//  MDG ПОРТАЛ — ОСНОВНАЯ ЛОГИКА
// ============================================================

// ----- ПЕРЕКЛЮЧЕНИЕ ТАБОВ -----
function switchTab(tabId) {
    document.querySelectorAll('.panel').forEach(p => p.classList.remove('active'));
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));

    const panel = document.getElementById(tabId);
    if (panel) panel.classList.add('active');

    const tabBtn = document.querySelector(`.tab[data-tab="${tabId}"]`);
    if (tabBtn) tabBtn.classList.add('active');

    const contentArea = document.getElementById('contentArea');
    if (contentArea) contentArea.scrollTop = 0;

    // Обновляем состояние стрелки-подсказки
    setTimeout(updateScrollHint, 50);
}

// ----- ИНИЦИАЛИЗАЦИЯ ТАБОВ (ВАЖНО: ТОЛЬКО ОДИН РАЗ) -----
document.addEventListener('DOMContentLoaded', function() {
    // Назначаем обработчики на все табы
    document.querySelectorAll('.tab[data-tab]').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const tabId = this.dataset.tab;
            switchTab(tabId);
        });
    });

    // Инициализация стрелки
    setTimeout(updateScrollHint, 100);
});

// ----- УПРАВЛЕНИЕ СТРЕЛКОЙ-ПОДСКАЗКОЙ В МЕНЮ -----
function updateScrollHint() {
    const tabsWrap = document.querySelector('.tabs-wrap');
    const hint = document.querySelector('.tabs-scroll-hint');
    if (!tabsWrap || !hint) return;

    // Показываем стрелку, если контент выходит за пределы видимой области
    const isScrollable = tabsWrap.scrollWidth > tabsWrap.clientWidth;
    const isAtEnd = tabsWrap.scrollLeft + tabsWrap.clientWidth >= tabsWrap.scrollWidth - 2;

    if (isScrollable && !isAtEnd) {
        hint.classList.remove('hidden');
    } else {
        hint.classList.add('hidden');
    }
}

// Обработчик скролла для скрытия стрелки
const tabsWrap = document.querySelector('.tabs-wrap');
if (tabsWrap) {
    tabsWrap.addEventListener('scroll', updateScrollHint);
}

// Обновляем при ресайзе
window.addEventListener('resize', updateScrollHint);

// ----- ДОНАТ КНОПКИ -----
document.querySelectorAll('.btn-donate').forEach(btn => {
    btn.addEventListener('click', function() {
        const card = this.closest('.donate-card');
        const amount = card?.querySelector('.amount')?.textContent || 'сумма';
        alert('❤️ Спасибо за поддержку на ' + amount + '!\n\nСвяжитесь с администратором для получения бонусов.\nTelegram: @mdg_support');
    });
});

// ----- РЕСУРСЫ (ТАБЛИЦА) -----
const RESOURCES_DATA = [
    { n: 1, food: 150, wood: 150, metal: '-', fuel: '-', time: '0:03', req: 'Дом 1 - 1' },
    { n: 2, food: 150, wood: 150, metal: '-', fuel: '-', time: '0:04', req: 'Лесопилка - 2' },
    { n: 3, food: 400, wood: 300, metal: 200, fuel: '-', time: '0:05', req: 'Теплица - 3, База героев - 1' },
    { n: 4, food: 2400, wood: 2000, metal: 500, fuel: '-', time: '0:05', req: 'Плавильня - 3, Мастерская артефактов - 2' },
    { n: 5, food: 6400, wood: 2500, metal: 10000, fuel: '-', time: '0:03:00', req: 'Лепилка - 5, Мастерская артефактов - 3' },
    { n: 6, food: 4000, wood: 6000, metal: 10000, fuel: '-', time: '0:20:00', req: 'Теплица - 5, Пост разведки - 1' },
    { n: 7, food: 3600, wood: 12000, metal: 4800, fuel: '-', time: '0:30:00', req: 'Казарма 1 - 1, Мастерская артефактов - 5' },
    { n: 8, food: '-', wood: 48000, metal: 12000, fuel: '-', time: '2:15:00', req: 'Угольная шахта - 1' },
    { n: 9, food: 7224, wood: 241224, metal: 46802, fuel: '-', time: '4:20:00', req: 'Госпиталь - 1' },
    { n: 10, food: 351000, wood: 673000, metal: 64405, fuel: '-', time: '6:00:00', req: 'Лаборатория 1 - 5, Казарма 1 - 3' },
    { n: 11, food: 787500, wood: '1.12м', metal: 91000, fuel: '-', time: '6:36:50', req: 'Станция связи 5, Казарма 1 - 5' },
    { n: 12, food: '1.80м', wood: '1.98м', metal: 114400, fuel: '-', time: '8:37:48', req: 'Станция связи - 8, Казарма 1 - 6' },
    { n: 13, food: '3.15м', wood: '3.15м', metal: 300000, fuel: '-', time: '10:34:37', req: 'Лаборатория - 8, Казарма 1 - 10' },
    { n: 14, food: '3.72м', wood: '3.72м', metal: 600000, fuel: '-', time: '13:05:03', req: 'Лаборатория - 13, Казарма 1 - 14' },
    { n: 15, food: '4.57м', wood: '4.57м', metal: 913500, fuel: '-', time: '17:39:04', req: 'Станция связи - 13, Казарма 1 - 14' },
    { n: 16, food: '6.73м', wood: '6.73м', metal: '1.35м', fuel: 336400, time: '3:48:38', req: 'Лаборатория - 13, Казарма 1 - 15' },
    { n: 17, food: '8.49м', wood: '8.49м', metal: '1.70м', fuel: 424100, time: '1д 11:12:57', req: 'Станция связи - 16, Казарма 1 - 16' },
    { n: 18, food: '11.73м', wood: '11.73м', metal: '2.35м', fuel: 586100, time: '2д 04:40:56', req: 'Лаборатория - 17, Гарнизон - 13' },
    { n: 19, food: '16.32м', wood: '16.32м', metal: '3.27м', fuel: 815600, time: '4д 06:02:27', req: 'Станция связи - 18, Казарма 1 - 18' },
    { n: 20, food: '22.66м', wood: '22.66м', metal: '4.54м', fuel: '1.14м', time: '6д 14:25:43', req: 'Лаборатория - 19, Гарнизон - 16' },
    { n: 21, food: '31.57м', wood: '31.57м', metal: '6.32м', fuel: '1.58м', time: '8д 21:38:11', req: 'Станция связи - 20, Казарма 1 - 20' },
    { n: 22, food: '43.72м', wood: '43.72м', metal: '8.75м', fuel: '2.19м', time: '12д 09:54:01', req: 'Лаборатория - 21, Вестник войны - 14' },
    { n: 23, food: '61.00м', wood: '61.00м', metal: '12.20м', fuel: '3.05м', time: '17д 09:03:38', req: 'Станция связи - 22, Казарма 1 - 22' },
    { n: 24, food: '85.16м', wood: '87.46м', metal: '17.50м', fuel: '4.38м', time: '18д 07:48:41', req: 'Лаборатория - 23, Академия героев - 18' },
    { n: 25, food: '119.86м', wood: '119.86м', metal: '23.98м', fuel: '6.0м', time: '20д 18:36:40', req: 'Станция связи - 24, Казарма 1 - 24' },
    { n: 26, food: '136.52м', wood: '136.52м', metal: '27.31м', fuel: '6.38м', time: '23д 4:30:00', req: 'Лаборатория - 25, Золотая защита - 20' },
    { n: 27, food: '161.98м', wood: '161.98м', metal: '32.40м', fuel: '8.10м', time: '32д 17:24:02', req: 'Станция связи - 26, Казарма 1 - 26' },
    { n: 28, food: '184.14м', wood: '184.14м', metal: '36.83м', fuel: '9.21м', time: '35д 10:00:00', req: 'Лаборатория - 27, Хранитель жизни - 23' },
    { n: 29, food: '220.30м', wood: '220.30м', metal: '44.06м', fuel: '11.02м', time: '38д 18:16:00', req: 'Станция связи - 28, Казарма 1 - 28, Золотая защита - 24' },
    { n: 30, food: '255.94м', wood: '255.94м', metal: '51.19м', fuel: '12.80м', time: '42д 00:47:23', req: 'Лаборатория - 29, Казарма 1 - 29, Вестник войны - 26' }
];

function renderResources() {
    const tbody = document.getElementById('resourceBody');
    if (!tbody) return;
    tbody.innerHTML = '';
    const labels = ['№', 'Еда', 'Древесина', 'Металл', 'Топливо', 'Время', 'Требования'];
    RESOURCES_DATA.forEach(function(r) {
        const tr = document.createElement('tr');
        const values = [r.n, r.food, r.wood, r.metal, r.fuel, r.time, r.req];
        const cls = ['', 'col-eda', 'col-wood', 'col-metal', 'col-fuel', 'col-time', ''];
        tr.innerHTML = values.map(function(v, i) {
            return '<td data-label="' + labels[i] + '" class="' + cls[i] + '">' + v + '</td>';
        }).join('');
        tbody.appendChild(tr);
    });
}
renderResources();

// ============================================================
//  ПОИСК — раскрывается в хедере
// ============================================================
const searchToggle = document.getElementById('searchToggle');
const searchExpand = document.getElementById('searchExpand');
const searchInput = document.getElementById('searchInput');
const searchClear = document.getElementById('searchClear');
const searchResultsDrop = document.getElementById('searchResultsDrop');

let searchOpen = false;
const searchData = [];

function buildSearchData() {
    searchData.length = 0;

    document.querySelectorAll('#tab-heroes .hero-row').forEach(function(row) {
        const name = row.querySelector('h4')?.textContent?.trim() || '';
        const role = row.querySelector('.hero-role')?.textContent?.trim() || '';
        const desc = row.querySelector('p')?.textContent?.trim() || '';
        if (name) {
            searchData.push({
                tab: 'tab-heroes',
                tabLabel: 'Герои',
                title: name,
                desc: role + ' — ' + desc,
                content: name + ' ' + role + ' ' + desc
            });
        }
    });

    document.querySelectorAll('#tab-tips .tip').forEach(function(tip) {
        const title = tip.querySelector('h4')?.textContent?.trim() || '';
        const text = tip.querySelector('p')?.textContent?.trim() || '';
        if (title) {
            searchData.push({
                tab: 'tab-tips',
                tabLabel: 'Советы',
                title: title,
                desc: text,
                content: title + ' ' + text
            });
        }
    });

    document.querySelectorAll('#tab-home .card').forEach(function(card) {
        const title = card.querySelector('h3')?.textContent?.trim() || '';
        const desc = card.querySelector('p')?.textContent?.trim() || '';
        const onclickAttr = card.getAttribute('onclick');
        const tab = onclickAttr ? onclickAttr.match(/'(tab-[^']+)'/)?.[1] : null;
        const tabId = tab || 'tab-home';
        if (title) {
            searchData.push({
                tab: tabId,
                tabLabel: 'Главная',
                title: title,
                desc: desc,
                content: title + ' ' + desc
            });
        }
    });

    document.querySelectorAll('#tab-donate .donate-card').forEach(function(card) {
        const amount = card.querySelector('.amount')?.textContent?.trim() || '';
        const label = card.querySelector('.label')?.textContent?.trim() || '';
        const bonus = card.querySelector('.bonus')?.textContent?.trim() || '';
        if (amount) {
            searchData.push({
                tab: 'tab-donate',
                tabLabel: 'Донат',
                title: amount,
                desc: label + ' ' + bonus,
                content: amount + ' ' + label + ' ' + bonus
            });
        }
    });
}

function openSearch() {
    buildSearchData();
    searchExpand.classList.add('open');
    searchOpen = true;
    setTimeout(function() { searchInput.focus(); }, 200);
    if (searchInput.value.trim()) {
        doSearch(searchInput.value);
    } else {
        showEmptyResults();
    }
}

function closeSearch() {
    searchExpand.classList.remove('open');
    searchResultsDrop.classList.remove('active');
    searchOpen = false;
    searchInput.value = '';
    searchResultsDrop.innerHTML = '';
}

function showEmptyResults() {
    searchResultsDrop.innerHTML = '<div class="search-empty-drop"><span class="icon">🔍</span><p>Введите запрос для поиска</p></div>';
    searchResultsDrop.classList.add('active');
}

function doSearch(query) {
    var q = query.toLowerCase().trim();
    if (!q) {
        showEmptyResults();
        return;
    }

    var results = searchData.filter(function(item) {
        return item.content.toLowerCase().includes(q) ||
               item.title.toLowerCase().includes(q) ||
               item.desc.toLowerCase().includes(q);
    });

    if (results.length === 0) {
        searchResultsDrop.innerHTML = '<div class="search-empty-drop"><span class="icon">😕</span><p>Ничего не найдено</p></div>';
        searchResultsDrop.classList.add('active');
        return;
    }

    var html = results.slice(0, 15).map(function(item) {
        return '<div class="search-result-item" data-tab="' + item.tab + '">' +
               '<div class="title">' + item.title + '</div>' +
               (item.desc ? '<div class="desc">' + item.desc + '</div>' : '') +
               '<span class="tag">' + item.tabLabel + '</span>' +
               '</div>';
    }).join('');

    html += '<div class="search-hint-drop"><span>' + results.length + ' результатов</span><span>ESC — закрыть</span></div>';

    searchResultsDrop.innerHTML = html;

    searchResultsDrop.querySelectorAll('.search-result-item').forEach(function(el) {
        el.addEventListener('click', function() {
            var tab = this.dataset.tab;
            closeSearch();
            switchTab(tab);
        });
    });

    searchResultsDrop.classList.add('active');
}

// Обработчики поиска
if (searchToggle) {
    searchToggle.addEventListener('click', function(e) {
        e.stopPropagation();
        if (searchOpen) {
            closeSearch();
        } else {
            openSearch();
        }
    });
}

if (searchClear) {
    searchClear.addEventListener('click', function(e) {
        e.stopPropagation();
        searchInput.value = '';
        searchInput.focus();
        showEmptyResults();
    });
}

if (searchInput) {
    searchInput.addEventListener('input', function() {
        doSearch(this.value);
    });

    searchInput.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeSearch();
            e.preventDefault();
        }
    });
}

document.addEventListener('click', function(e) {
    if (searchOpen) {
        var wrap = document.querySelector('.search-wrap');
        if (wrap && !wrap.contains(e.target)) {
            closeSearch();
        }
    }
});

document.addEventListener('keydown', function(e) {
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        if (searchOpen) {
            closeSearch();
        } else {
            openSearch();
        }
    }
    if (e.key === 'Escape' && searchOpen) {
        closeSearch();
    }
});

console.log('MDG «Мир Дружба» — Tiles Survive Portal');
console.log('🔍 Поиск: ⌘K или кнопка в шапке');
console.log('📦 Все данные встроены в HTML');