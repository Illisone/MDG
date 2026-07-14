// ============================================================
//  MDG ПОРТАЛ — ОСНОВНАЯ ЛОГИКА
// ============================================================

function switchTab(tabId) {
    document.querySelectorAll('.panel').forEach(function(p) {
        p.classList.remove('active');
    });
    
    var panel = document.getElementById(tabId);
    if (panel) panel.classList.add('active');

    document.querySelectorAll('.tab').forEach(function(t) {
        t.classList.remove('active');
    });
    var tabBtn = document.querySelector('.tab[data-tab="' + tabId + '"]');
    if (tabBtn) tabBtn.classList.add('active');

    // Закрываем мобильное меню
    var mobileMenu = document.getElementById('mobile-menu');
    if (mobileMenu) mobileMenu.classList.add('hidden');

    closeSearchDesktop();
    closeSearchMobile();
}

// ============================================================
//  ПОИСК (десктоп)
// ============================================================
var searchToggleDesktop = document.getElementById('searchToggleDesktop');
var searchDesktopContainer = document.getElementById('searchDesktopContainer');
var searchDesktopInput = document.getElementById('searchDesktopInput');
var searchDesktopResults = document.getElementById('searchDesktopResults');
var searchDesktopClose = document.getElementById('searchDesktopClose');

var searchOpenDesktop = false;
var searchDataDesktop = [];

function buildSearchDataDesktop() {
    searchDataDesktop = [];
    document.querySelectorAll('#tab-heroes .glass-card').forEach(function(card) {
        var name = card.querySelector('h4')?.textContent?.trim() || '';
        var desc = card.querySelector('p')?.textContent?.trim() || '';
        if (name) {
            searchDataDesktop.push({ tab: 'tab-heroes', label: 'Герои', title: name, desc: desc, content: name + ' ' + desc });
        }
    });
    document.querySelectorAll('#tab-tips .glass').forEach(function(tip) {
        var title = tip.querySelector('h4')?.textContent?.trim() || '';
        var desc = tip.querySelector('p')?.textContent?.trim() || '';
        if (title) {
            searchDataDesktop.push({ tab: 'tab-tips', label: 'Советы', title: title, desc: desc, content: title + ' ' + desc });
        }
    });
    document.querySelectorAll('#tab-squads .glass').forEach(function(squad) {
        var title = squad.querySelector('h3')?.textContent?.trim() || '';
        var desc = squad.querySelector('p')?.textContent?.trim() || '';
        if (title) {
            searchDataDesktop.push({ tab: 'tab-squads', label: 'Отряды', title: title, desc: desc, content: title + ' ' + desc });
        }
    });
    document.querySelectorAll('#tab-gear .glass').forEach(function(gear) {
        var title = gear.querySelector('h4')?.textContent?.trim() || '';
        var desc = gear.querySelector('p')?.textContent?.trim() || '';
        if (title) {
            searchDataDesktop.push({ tab: 'tab-gear', label: 'Снаряжение', title: title, desc: desc, content: title + ' ' + desc });
        }
    });
}

function openSearchDesktop() {
    if (searchOpenDesktop) { closeSearchDesktop(); return; }
    buildSearchDataDesktop();
    searchDesktopContainer.classList.add('open');
    searchOpenDesktop = true;
    setTimeout(function() {
        searchDesktopInput.focus();
        searchDesktopInput.select();
    }, 300);
    if (searchDesktopInput.value.trim()) {
        doSearchDesktop(searchDesktopInput.value);
    } else {
        searchDesktopResults.innerHTML = '';
    }
}

function closeSearchDesktop() {
    searchDesktopContainer.classList.remove('open');
    searchOpenDesktop = false;
    searchDesktopInput.value = '';
    searchDesktopResults.innerHTML = '';
}

function doSearchDesktop(query) {
    var q = query.toLowerCase().trim();
    if (!q) {
        searchDesktopResults.innerHTML = '';
        return;
    }
    var results = searchDataDesktop.filter(function(item) {
        return item.content.toLowerCase().includes(q) || item.title.toLowerCase().includes(q) || item.desc.toLowerCase().includes(q);
    });
    if (results.length === 0) {
        searchDesktopResults.innerHTML = '<div class="text-gray-500 text-sm text-center py-3">Ничего не найдено</div>';
        return;
    }
    var html = results.slice(0, 10).map(function(item) {
        return '<div class="search-result-item" data-tab="' + item.tab + '"><div class="title">' + item.title + '</div>' + (item.desc ? '<div class="desc">' + item.desc + '</div>' : '') + '<span class="tag">' + item.label + '</span></div>';
    }).join('');
    if (results.length > 10) {
        html += '<div class="text-xs text-gray-600 text-center pt-1">+ ещё ' + (results.length - 10) + '</div>';
    }
    searchDesktopResults.innerHTML = html;
    searchDesktopResults.querySelectorAll('.search-result-item').forEach(function(el) {
        el.addEventListener('click', function() {
            var tab = this.dataset.tab;
            closeSearchDesktop();
            switchTab(tab);
        });
    });
}

if (searchToggleDesktop) {
    searchToggleDesktop.addEventListener('click', function(e) {
        e.stopPropagation();
        openSearchDesktop();
    });
}

if (searchDesktopInput) {
    searchDesktopInput.addEventListener('input', function() { doSearchDesktop(this.value); });
    searchDesktopInput.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') { closeSearchDesktop(); if (searchToggleDesktop) searchToggleDesktop.focus(); }
        if (e.key === 'Enter') {
            var first = searchDesktopResults.querySelector('.search-result-item');
            if (first) first.click();
        }
    });
}

if (searchDesktopClose) {
    searchDesktopClose.addEventListener('click', closeSearchDesktop);
}

document.addEventListener('click', function(e) {
    if (searchOpenDesktop && !e.target.closest('#searchDesktopContainer') && !e.target.closest('#searchToggleDesktop')) {
        closeSearchDesktop();
    }
});

// ============================================================
//  ПОИСК (мобильный)
// ============================================================
var searchToggleMobile = document.getElementById('searchToggleMobile');
var searchOverlay = document.getElementById('searchOverlay');
var searchMobileInput = document.getElementById('searchMobileInput');
var searchMobileResults = document.getElementById('searchMobileResults');

var searchDataMobile = [];

function buildSearchDataMobile() {
    searchDataMobile = [];
    document.querySelectorAll('#tab-heroes .glass-card').forEach(function(card) {
        var name = card.querySelector('h4')?.textContent?.trim() || '';
        var desc = card.querySelector('p')?.textContent?.trim() || '';
        if (name) {
            searchDataMobile.push({ tab: 'tab-heroes', label: 'Герои', title: name, desc: desc, content: name + ' ' + desc });
        }
    });
    document.querySelectorAll('#tab-tips .glass').forEach(function(tip) {
        var title = tip.querySelector('h4')?.textContent?.trim() || '';
        var desc = tip.querySelector('p')?.textContent?.trim() || '';
        if (title) {
            searchDataMobile.push({ tab: 'tab-tips', label: 'Советы', title: title, desc: desc, content: title + ' ' + desc });
        }
    });
    document.querySelectorAll('#tab-gear .glass').forEach(function(gear) {
        var title = gear.querySelector('h4')?.textContent?.trim() || '';
        var desc = gear.querySelector('p')?.textContent?.trim() || '';
        if (title) {
            searchDataMobile.push({ tab: 'tab-gear', label: 'Снаряжение', title: title, desc: desc, content: title + ' ' + desc });
        }
    });
}

function openSearchMobile() {
    buildSearchDataMobile();
    searchOverlay.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
    setTimeout(function() {
        searchMobileInput.focus();
        searchMobileInput.select();
    }, 300);
    if (searchMobileInput.value.trim()) {
        doSearchMobile(searchMobileInput.value);
    } else {
        searchMobileResults.innerHTML = '';
    }
}

function closeSearchMobile() {
    searchOverlay.classList.add('hidden');
    document.body.style.overflow = '';
    searchMobileInput.value = '';
    searchMobileResults.innerHTML = '';
}

function doSearchMobile(query) {
    var q = query.toLowerCase().trim();
    if (!q) {
        searchMobileResults.innerHTML = '';
        return;
    }
    var results = searchDataMobile.filter(function(item) {
        return item.content.toLowerCase().includes(q) || item.title.toLowerCase().includes(q) || item.desc.toLowerCase().includes(q);
    });
    if (results.length === 0) {
        searchMobileResults.innerHTML = '<div class="text-gray-500 text-sm text-center py-4">Ничего не найдено</div>';
        return;
    }
    var html = results.slice(0, 20).map(function(item) {
        return '<div class="search-result-item" data-tab="' + item.tab + '"><div class="title">' + item.title + '</div>' + (item.desc ? '<div class="desc">' + item.desc + '</div>' : '') + '<span class="tag">' + item.label + '</span></div>';
    }).join('');
    html += '<div class="text-xs text-gray-600 text-center pt-2">Найдено ' + results.length + ' результатов</div>';
    searchMobileResults.innerHTML = html;
    searchMobileResults.querySelectorAll('.search-result-item').forEach(function(el) {
        el.addEventListener('click', function() {
            var tab = this.dataset.tab;
            closeSearchMobile();
            switchTab(tab);
        });
    });
}

if (searchToggleMobile) {
    searchToggleMobile.addEventListener('click', openSearchMobile);
}

if (searchMobileInput) {
    searchMobileInput.addEventListener('input', function() { doSearchMobile(this.value); });
    searchMobileInput.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') closeSearchMobile();
        if (e.key === 'Enter') {
            var first = searchMobileResults.querySelector('.search-result-item');
            if (first) first.click();
        }
    });
}

// ============================================================
//  ГОРЯЧИЕ КЛАВИШИ
// ============================================================
document.addEventListener('keydown', function(e) {
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        if (window.innerWidth >= 1024) {
            openSearchDesktop();
        } else {
            openSearchMobile();
        }
    }
});

// ============================================================
//  РЕСУРСЫ (ДАННЫЕ)
// ============================================================
var RESOURCES_DATA = [
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

// ============================================================
//  ИНИЦИАЛИЗАЦИЯ
// ============================================================
document.addEventListener('DOMContentLoaded', function() {
    renderHeroes();
    renderSquads();
    renderActivities();
    renderTips();
    renderNews();
    renderGear();
    renderBuffs();

    document.querySelectorAll('.tab[data-tab]').forEach(function(btn) {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            switchTab(this.dataset.tab);
        });
    });

    var menuBtn = document.getElementById('menu-btn');
    var mobileMenu = document.getElementById('mobile-menu');
    if (menuBtn) {
        menuBtn.addEventListener('click', function() {
            mobileMenu.classList.toggle('hidden');
        });
    }
    document.querySelectorAll('#mobile-menu .tab').forEach(function(btn) {
        btn.addEventListener('click', function() {
            mobileMenu.classList.add('hidden');
        });
    });

    var progress = document.getElementById('scroll-progress');
    window.addEventListener('scroll', function() {
        var scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
        var scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        progress.style.width = (scrollTop / scrollHeight * 100) + '%';
    }, { passive: true });

    var navbar = document.getElementById('navbar');
    window.addEventListener('scroll', function() {
        navbar.classList.toggle('scrolled', window.scrollY > 50);
    }, { passive: true });

    console.log('MDG «Мир Дружба» — Tiles Survive Portal');
    console.log('Поиск: иконка в шапке или ⌘K');
});