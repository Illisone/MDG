// ============================================================
//  ОТРИСОВКА КОНТЕНТА С 3D-ЭФФЕКТАМИ И АНИМАЦИЯМИ
// ============================================================

// ===== 3D TILT ЭФФЕКТ ДЛЯ КАРТОЧЕК =====
function initTiltEffect() {
    document.querySelectorAll('.tilt-card').forEach(function(card) {
        card.addEventListener('mouseenter', function(e) {
            this.dataset.tilt = 'active';
        });
        card.addEventListener('mousemove', function(e) {
            if (this.dataset.tilt !== 'active') return;
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = (y - centerY) / centerY * -8;
            const rotateY = (x - centerX) / centerX * 8;
            this.style.transform = 
                `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px)`;
            
            // Glare эффект
            const glare = this.querySelector('.glare-effect');
            if (glare) {
                const glareX = (x / rect.width) * 100;
                const glareY = (y / rect.height) * 100;
                glare.style.background = 
                    `radial-gradient(circle at ${glareX}% ${glareY}%, rgba(255,255,255,0.08) 0%, transparent 60%)`;
                glare.style.opacity = '1';
            }
        });
        card.addEventListener('mouseleave', function() {
            this.dataset.tilt = 'inactive';
            this.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)';
            const glare = this.querySelector('.glare-effect');
            if (glare) {
                glare.style.opacity = '0';
            }
        });
    });
}

// ===== STAGGER АНИМАЦИЯ =====
function applyStaggerAnimation(containerSelector, delay) {
    if (delay === undefined) delay = 0.05;
    var container = document.querySelector(containerSelector);
    if (!container) return;
    var items = container.children;
    Array.from(items).forEach(function(el, index) {
        el.classList.add('animate-stagger');
        el.style.animationDelay = (index * delay) + 's';
    });
}

// ===== KINETIC TYPOGRAPHY (скролл-триггер) =====
function initKineticTitles() {
    var titles = document.querySelectorAll('.kinetic-title');
    var observer = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.3 });
    titles.forEach(function(title) {
        observer.observe(title);
    });
}

// ===== ГЕРОИ =====
function renderHeroes() {
    var container = document.getElementById('tab-heroes');
    if (!container) return;

    var html = `
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div class="flex items-center gap-3 mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#fbbf24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/><path d="M16 3.13a4 4 0 010 7.75"/><path d="M8 3.13a4 4 0 010 7.75"/></svg>
                <h1 class="text-2xl font-bold kinetic-title">Герои</h1>
                <div class="flex-1 h-px bg-gradient-to-r from-gold/20 to-transparent"></div>
            </div>
    `;

    html += `<h3 class="text-lg font-bold text-yellow-400 mb-3 kinetic-title">S-Tier</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 stagger-container">`;
    HEROES_DATA.sTier.forEach(function(hero) {
        html += renderHeroCard(hero);
    });
    html += `</div>`;

    html += `<h3 class="text-lg font-bold text-purple-400 mt-6 mb-3 kinetic-title">A-Tier</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 stagger-container">`;
    HEROES_DATA.aTier.forEach(function(hero) {
        html += renderHeroCard(hero);
    });
    html += `</div>`;

    html += `<h3 class="text-lg font-bold text-green-400 mt-6 mb-3 kinetic-title">SR — Глобальные навыки</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 stagger-container">`;
    HEROES_DATA.srHeroes.forEach(function(hero) {
        html += renderSRCard(hero);
    });
    html += `</div>`;

    html += `
        <div class="mt-6 glass rounded-xl p-5 border border-gold/20 kinetic-title">
            <h4 class="font-bold text-gold mb-2">Общие правила прокачки героев</h4>
            <ul class="text-gray-300 text-sm space-y-1">
                ${HEROES_DATA.rules.map(function(rule) { return '<li>• ' + rule + '</li>'; }).join('')}
            </ul>
        </div>
    </div>`;

    container.innerHTML = html;
    
    setTimeout(function() {
        applyStaggerAnimation('#tab-heroes .stagger-container');
        initKineticTitles();
        initTiltEffect();
    }, 100);
}

function renderHeroCard(hero) {
    return `
        <div class="glass-card rounded-xl p-4 flex items-start gap-4 hover:border-gold/30 transition-all tilt-card relative overflow-hidden">
            <div class="glare-effect absolute inset-0 pointer-events-none opacity-0 transition-opacity duration-300"></div>
            <div class="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 border-2 border-gold/30 bg-black/50">
                <img src="images/heroes/${hero.image}" alt="${hero.name}" class="w-full h-full object-cover" onerror="this.style.display='none'">
            </div>
            <div class="flex-1 min-w-0 relative z-10">
                <div class="flex items-center gap-2 flex-wrap">
                    <h4 class="font-bold text-white text-base">${hero.name}</h4>
                    <span class="tier-${hero.tier.toLowerCase()}">${hero.tier}</span>
                </div>
                <div class="text-xs text-gray-400">${hero.role}</div>
                <p class="text-sm text-gray-400 mt-1">${hero.desc}</p>
                <div class="mt-2 flex flex-wrap gap-2">
                    <span class="text-[10px] bg-gold/10 text-gold px-2 py-0.5 rounded">${hero.stars}</span>
                    <span class="text-[10px] bg-gold/10 text-gold px-2 py-0.5 rounded">${hero.skills}</span>
                </div>
            </div>
        </div>
    `;
}

function renderSRCard(hero) {
    return `
        <div class="glass-card rounded-xl p-4 flex items-start gap-4 hover:border-green-500/30 transition-all tilt-card relative overflow-hidden">
            <div class="glare-effect absolute inset-0 pointer-events-none opacity-0 transition-opacity duration-300"></div>
            <div class="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 border-2 border-green-500/30 bg-black/50">
                <img src="images/heroes/${hero.image}" alt="${hero.name}" class="w-full h-full object-cover" onerror="this.style.display='none'">
            </div>
            <div class="flex-1 min-w-0 relative z-10">
                <div class="flex items-center gap-2 flex-wrap">
                    <h4 class="font-bold text-white text-base">${hero.name}</h4>
                    <span class="text-[10px] bg-green-500/20 text-green-400 px-2 py-0.5 rounded">SR</span>
                </div>
                <div class="text-xs text-gray-400">${hero.role}</div>
                <p class="text-sm text-gray-400 mt-1">${hero.desc}</p>
                <div class="mt-2 text-xs ${hero.warning.includes('⚠️') ? 'text-red-400' : 'text-yellow-400'}">${hero.warning}</div>
            </div>
        </div>
    `;
}

// ===== ОТРЯДЫ =====
function renderSquads() {
    var container = document.getElementById('tab-squads');
    if (!container) return;

    var html = `
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div class="flex items-center gap-3 mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#fbbf24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 9V5a2 2 0 00-2-2H4a2 2 0 00-2 2v4a2 2 0 002 2h8a2 2 0 002-2z"/><path d="M8 15v2"/><path d="M12 15v2"/><path d="M20 15v2"/><path d="M14 5l3 3 6-6"/><path d="M18 11v8a2 2 0 01-2 2H6a2 2 0 01-2-2v-8"/></svg>
                <h1 class="text-2xl font-bold kinetic-title">Отряды</h1>
                <div class="flex-1 h-px bg-gradient-to-r from-gold/20 to-transparent"></div>
            </div>
    `;

    html += renderSquadCard(SQUADS_DATA.starter, 'blue');
    html += renderSquadCard(SQUADS_DATA.main, 'gold');
    html += renderSecondSquadCards();
    html += renderBarracksCard();

    html += `</div>`;
    container.innerHTML = html;
    
    setTimeout(function() {
        initKineticTitles();
        initTiltEffect();
    }, 100);
}

function renderSquadCard(squad, color) {
    var colors = {
        blue: { text: 'blue-400', bg: 'blue-500/10', border: 'blue-500/30' },
        gold: { text: 'yellow-400', bg: 'yellow-500/10', border: 'yellow-500/30' },
        purple: { text: 'purple-400', bg: 'purple-500/10', border: 'purple-500/30' }
    };
    var c = colors[color] || colors.blue;

    var factionIcons = {
        'Стражи': `<svg class="w-12 h-12" viewBox="0 0 24 24" fill="none" stroke="#fbbf24" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="M12 8v4"/><path d="M12 16h.01"/></svg>`,
        'Разбойники': `<svg class="w-12 h-12" viewBox="0 0 24 24" fill="none" stroke="#a78bfa" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>`
    };
    var factionIcon = factionIcons[squad.factionName] || `<span class="text-4xl">⚔️</span>`;

    var html = `
        <div class="glass rounded-xl p-6 mb-6 border border-${c.border} kinetic-title">
            <div class="flex items-center gap-3 mb-4">
                <h3 class="text-xl font-bold text-${c.text}">${squad.title}</h3>
                <span class="text-[10px] text-${c.text}/70 bg-${c.bg} px-3 py-0.5 rounded-full">${squad.badge}</span>
            </div>
            
            <div class="bg-${c.bg} rounded-xl p-4 mb-5 flex items-center gap-5">
                <div class="w-16 h-16 rounded-xl bg-black/30 flex items-center justify-center flex-shrink-0 border border-${c.border}">
                    ${factionIcon}
                </div>
                <div>
                    <span class="text-sm font-semibold text-${c.text}">Бонус фракции</span>
                    <p class="text-sm text-gray-300">${squad.bonus} ${squad.bonusDesc}</p>
                    <span class="text-xs text-gray-500">${squad.factionName} · ${squad.composition}</span>
                </div>
            </div>
            
            <div class="grid grid-cols-5 gap-4 mb-5">
                ${squad.heroes.map(function(hero) {
                    return `
                        <div class="text-center">
                            <div class="w-20 h-20 mx-auto rounded-xl overflow-hidden border-2 border-${c.border} bg-black/40">
                                <img src="images/heroes/${hero.image}" alt="${hero.name}" class="w-full h-full object-cover" onerror="this.style.display='none'">
                            </div>
                            <div class="text-sm font-bold mt-1.5 text-white">${hero.name}</div>
                            <div class="text-[11px] text-gray-400">${hero.role}</div>
                        </div>
                    `;
                }).join('')}
            </div>
            
            ${squad.why ? `
            <div class="bg-green-500/5 border border-green-500/20 rounded-xl p-4 mb-4">
                <h4 class="font-bold text-green-400 text-sm mb-1.5">${squad.why.title}</h4>
                <ul class="text-gray-300 text-sm space-y-1">
                    ${squad.why.points.map(function(item) { return '<li class="flex gap-2"><span class="text-green-400">▸</span> ' + item + '</li>'; }).join('')}
                </ul>
            </div>
            ` : ''}
            
            ${squad.noLayla ? `
            <div class="bg-yellow-500/5 border border-yellow-500/20 rounded-xl p-4 mb-4">
                <h4 class="font-bold text-yellow-400 text-sm mb-1.5">${squad.noLayla.title}</h4>
                <p class="text-gray-300 text-sm">${squad.noLayla.desc}</p>
            </div>
            ` : ''}
            
            ${squad.priority ? `
            <div class="bg-${c.bg} rounded-xl p-4 mb-4 border border-${c.border}">
                <h4 class="font-bold text-${c.text} text-sm mb-1.5">${squad.priority.title}</h4>
                <p class="text-xs text-gray-400 mb-2">${squad.priority.desc || ''}</p>
                <ul class="text-gray-300 text-sm space-y-1">
                    ${squad.priority.list.map(function(item) { return '<li class="flex gap-2"><span class="text-${c.text}">▸</span> ' + item + '</li>'; }).join('')}
                </ul>
                ${squad.priority.tip ? `
                    <div class="mt-3 text-xs text-yellow-400/90 bg-yellow-500/10 p-3 rounded-xl border border-yellow-500/20">
                        💡 ${squad.priority.tip}
                    </div>
                ` : ''}
            </div>
            ` : ''}
            
            ${squad.gear ? `
            <div class="bg-${c.bg} rounded-xl p-4 mb-4 border border-${c.border}">
                <h4 class="font-bold text-${c.text} text-sm mb-1.5">${squad.gear.title}</h4>
                <p class="text-xs text-gray-400 mb-2">${squad.gear.desc}</p>
                <ul class="text-gray-300 text-sm space-y-1">
                    ${squad.gear.list.map(function(item) { return '<li class="flex gap-2"><span class="text-${c.text}">▸</span> ' + item + '</li>'; }).join('')}
                </ul>
                <div class="mt-2 text-sm text-gold/80">
                    <a href="#" onclick="switchTab('tab-gear'); return false;" class="text-gold hover:underline">Подробнее о снаряжении →</a>
                </div>
            </div>
            ` : ''}
            
            <div class="bg-white/5 rounded-xl p-4 border border-white/5">
                <span class="text-gray-300 text-sm font-medium">💡 Совет:</span>
                <span class="text-gray-400 text-sm">${squad.tip}</span>
            </div>
            ${squad.replace ? '<div class="mt-3 text-sm text-' + c.text + '/80 bg-' + c.bg + ' p-3 rounded-xl border border-' + c.border + '">🔄 ' + squad.replace + '</div>' : ''}
        </div>
    `;
    return html;
}

function renderSecondSquadCards() {
    var squad = SQUADS_DATA.second;
    var c = { text: 'purple-400', bg: 'purple-500/10', border: 'purple-500/30' };

    var factionIcon = `<svg class="w-12 h-12" viewBox="0 0 24 24" fill="none" stroke="#a78bfa" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>`;

    var starterHtml = `
        <div class="glass rounded-xl p-6 mb-6 border border-${c.border} kinetic-title">
            <div class="flex items-center gap-3 mb-4">
                <h3 class="text-xl font-bold text-${c.text}">Второй отряд (стартовый)</h3>
                <span class="text-[10px] text-${c.text}/70 bg-${c.bg} px-3 py-0.5 rounded-full">${squad.badge}</span>
            </div>
            
            <div class="bg-${c.bg} rounded-xl p-4 mb-5 flex items-center gap-5">
                <div class="w-16 h-16 rounded-xl bg-black/30 flex items-center justify-center flex-shrink-0 border border-${c.border}">
                    ${factionIcon}
                </div>
                <div>
                    <span class="text-sm font-semibold text-${c.text}">Бонус фракции</span>
                    <p class="text-sm text-gray-300">${squad.bonus} ${squad.bonusDesc}</p>
                    <span class="text-xs text-gray-500">${squad.factionName} · ${squad.composition}</span>
                </div>
            </div>
            
            <div class="grid grid-cols-5 gap-4 mb-4">
                ${squad.starter.heroes.map(function(hero) {
                    return `
                        <div class="text-center">
                            <div class="w-20 h-20 mx-auto rounded-xl overflow-hidden border-2 border-${c.border} bg-black/40">
                                <img src="images/heroes/${hero.image}" alt="${hero.name}" class="w-full h-full object-cover" onerror="this.style.display='none'">
                            </div>
                            <div class="text-sm font-bold mt-1.5 text-white">${hero.name}</div>
                        </div>
                    `;
                }).join('')}
            </div>
            
            <div class="text-xs text-gray-500 text-center">${squad.composition}</div>
        </div>
    `;

    var finalHtml = `
        <div class="glass rounded-xl p-6 mb-6 border border-${c.border} kinetic-title">
            <div class="flex items-center gap-3 mb-4">
                <h3 class="text-xl font-bold text-${c.text}">Второй отряд (финальный)</h3>
                <span class="text-[10px] text-${c.text}/70 bg-${c.bg} px-3 py-0.5 rounded-full">${squad.badge}</span>
            </div>
            
            <div class="bg-${c.bg} rounded-xl p-4 mb-5 flex items-center gap-5">
                <div class="w-16 h-16 rounded-xl bg-black/30 flex items-center justify-center flex-shrink-0 border border-${c.border}">
                    ${factionIcon}
                </div>
                <div>
                    <span class="text-sm font-semibold text-${c.text}">Бонус фракции</span>
                    <p class="text-sm text-gray-300">${squad.bonus} ${squad.bonusDesc}</p>
                    <span class="text-xs text-gray-500">${squad.factionName} · ${squad.composition}</span>
                </div>
            </div>
            
            <div class="grid grid-cols-5 gap-4 mb-4">
                ${squad.final.heroes.map(function(hero) {
                    return `
                        <div class="text-center">
                            <div class="w-20 h-20 mx-auto rounded-xl overflow-hidden border-2 border-${c.border} bg-black/40">
                                <img src="images/heroes/${hero.image}" alt="${hero.name}" class="w-full h-full object-cover" onerror="this.style.display='none'">
                            </div>
                            <div class="text-sm font-bold mt-1.5 text-white">${hero.name}</div>
                        </div>
                    `;
                }).join('')}
            </div>
            
            <div class="text-xs text-${c.text}/70 text-center">${squad.composition} · Бонус: ${squad.bonus} HP</div>
            
            ${squad.why ? `
            <div class="bg-green-500/5 border border-green-500/20 rounded-xl p-4 mt-4">
                <h4 class="font-bold text-green-400 text-sm mb-1.5">${squad.why.title}</h4>
                <ul class="text-gray-300 text-sm space-y-1">
                    ${squad.why.points.map(function(item) { return '<li class="flex gap-2"><span class="text-green-400">▸</span> ' + item + '</li>'; }).join('')}
                </ul>
            </div>
            ` : ''}
            
            ${squad.priority ? `
            <div class="bg-${c.bg} rounded-xl p-4 mt-4 border border-${c.border}">
                <h4 class="font-bold text-${c.text} text-sm mb-1.5">${squad.priority.title}</h4>
                <ul class="text-gray-300 text-sm space-y-1">
                    ${squad.priority.list.map(function(item) { return '<li class="flex gap-2"><span class="text-${c.text}">▸</span> ' + item + '</li>'; }).join('')}
                </ul>
            </div>
            ` : ''}
            
            <div class="bg-white/5 rounded-xl p-4 mt-4 border border-white/5">
                <span class="text-gray-300 text-sm font-medium">💡 Совет:</span>
                <span class="text-gray-400 text-sm">${squad.tip}</span>
            </div>
        </div>
    `;

    return starterHtml + finalHtml;
}

function renderBarracksCard() {
    var b = SQUADS_DATA.barracks;
    return `
        <div class="glass rounded-xl p-5 border border-gold/20 kinetic-title">
            <div class="flex items-center gap-3 mb-3">
                <span class="text-gold font-bold text-lg">🏛️ Казармы</span>
            </div>
            <p class="text-gray-400 text-sm">${b.tip}</p>
            <div class="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                <div class="bg-white/5 p-3 rounded-xl border border-white/5">
                    <span class="text-yellow-400 font-bold">✅ Что делать:</span>
                    <ul class="text-gray-400 text-xs mt-1 space-y-1">
                        ${b.do.map(function(item) { return '<li class="flex gap-2"><span class="text-yellow-400">•</span> ' + item + '</li>'; }).join('')}
                    </ul>
                </div>
                <div class="bg-white/5 p-3 rounded-xl border border-white/5">
                    <span class="text-red-400 font-bold">❌ Чего не делать:</span>
                    <ul class="text-gray-400 text-xs mt-1 space-y-1">
                        ${b.dont.map(function(item) { return '<li class="flex gap-2"><span class="text-red-400">•</span> ' + item + '</li>'; }).join('')}
                    </ul>
                </div>
            </div>
        </div>
    `;
}

// ===== СНАРЯЖЕНИЕ =====
function renderGear() {
    var container = document.getElementById('tab-gear');
    if (!container) return;

    var html = `
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div class="flex items-center gap-3 mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#fbbf24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>
                <h1 class="text-2xl font-bold kinetic-title">Снаряжение</h1>
                <div class="flex-1 h-px bg-gradient-to-r from-gold/20 to-transparent"></div>
            </div>
            
            <p class="text-gray-400 text-sm mb-6 kinetic-title">${GEAR_DATA.intro}</p>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6 stagger-container">
                ${GEAR_DATA.tips.map(function(tip) {
                    return '<div class="glass-card rounded-xl p-4 flex gap-3 hover:border-gold/20 transition-all animate-stagger" style="animation-delay:0s"><span class="text-gold font-black text-xl flex-shrink-0">◆</span><div><h4 class="font-bold text-sm">' + tip.title + '</h4><p class="text-gray-400 text-xs">' + tip.desc + '</p></div></div>';
                }).join('')}
            </div>
            
            <h3 class="text-lg font-bold text-gold mb-4 kinetic-title">Приоритеты экипировки по отрядам</h3>
            
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4 stagger-container">
                ${Object.values(GEAR_DATA.priority).map(function(priority) {
                    return '<div class="glass-card rounded-xl p-5 border border-gold/20 animate-stagger"><h4 class="font-bold text-gold text-sm mb-2">' + priority.title + '</h4><ul class="text-gray-300 text-xs space-y-1">' + priority.list.map(function(item) { return '<li>• ' + item + '</li>'; }).join('') + '</ul></div>';
                }).join('')}
            </div>
            
            <div class="mt-6 glass rounded-xl p-5 border border-gold/20 kinetic-title">
                <h4 class="font-bold text-gold mb-2">Где брать снаряжение</h4>
                <ul class="text-gray-400 text-sm space-y-1">
                    <li>• <span class="text-yellow-400">Экспедиция Славы</span> — основной источник</li>
                    <li>• <span class="text-yellow-400">Ивенты</span> — следите за событиями</li>
                    <li>• <span class="text-yellow-400">Магазин</span> — только если очень нужно</li>
                </ul>
            </div>
        </div>
    `;
    container.innerHTML = html;
    
    setTimeout(function() {
        applyStaggerAnimation('#tab-gear .stagger-container', 0.03);
        initKineticTitles();
    }, 100);
}

// ===== АКТИВНОСТИ =====
function renderActivities() {
    var container = document.getElementById('tab-activities');
    if (!container) return;

    var html = `
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div class="flex items-center gap-3 mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#fbbf24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                <h1 class="text-2xl font-bold kinetic-title">Еженедельные активности</h1>
                <div class="flex-1 h-px bg-gradient-to-r from-gold/20 to-transparent"></div>
            </div>
            <p class="text-gray-400 text-sm mb-6 kinetic-title">Чек-лист того, что нужно делать каждый день недели.</p>
            
            <div class="stagger-container">
    `;

    ACTIVITIES_DATA.forEach(function(day, index) {
        html += `
            <div class="glass-card rounded-xl p-5 mb-4 border border-white/5 hover:border-gold/20 transition-all animate-stagger" style="animation-delay:${index * 0.05}s">
                <div class="flex items-center gap-3 mb-3">
                    <span class="text-gold font-bold text-lg mono">${day.day}</span>
                    <span class="text-sm font-medium text-gold/60 uppercase tracking-wider">${day.name}</span>
                    ${day.time ? '<span class="ml-auto text-xs text-gold/40 bg-gold/5 px-3 py-1 rounded-full mono">' + day.time + '</span>' : ''}
                </div>
                <p class="text-sm text-gold/80 mb-3">${day.desc}</p>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div class="bg-white/5 rounded-lg p-3 border border-white/5">
                        <p class="text-green-400 text-xs font-semibold uppercase tracking-wider mb-1">Делаем</p>
                        <ul class="text-gray-400 text-sm space-y-1">${day.do.map(function(item) { return '<li>• ' + item + '</li>'; }).join('')}</ul>
                    </div>
                    <div class="bg-white/5 rounded-lg p-3 border border-white/5">
                        <p class="text-red-400/60 text-xs font-semibold uppercase tracking-wider mb-1">Не трогаем</p>
                        <ul class="text-gray-500 text-sm space-y-1">${day.dont.map(function(item) { return '<li>• ' + item + '</li>'; }).join('')}</ul>
                    </div>
                </div>
                ${day.tip ? '<div class="mt-3 bg-gold/5 border border-gold/10 rounded-lg p-3"><p class="text-gold/70 text-sm">🔥 Совет: ' + day.tip + '</p></div>' : ''}
            </div>
        `;
    });

    html += `</div></div>`;
    container.innerHTML = html;
    
    setTimeout(function() {
        initKineticTitles();
    }, 100);
}

// ===== СОВЕТЫ =====
function renderTips() {
    var container = document.getElementById('tab-tips');
    if (!container) return;

    var html = `
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div class="flex items-center gap-3 mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#fbbf24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></svg>
                <h1 class="text-2xl font-bold kinetic-title">Советы</h1>
                <div class="flex-1 h-px bg-gradient-to-r from-gold/20 to-transparent"></div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-3 stagger-container">
                ${TIPS_DATA.map(function(tip, index) {
                    return '<div class="glass-card rounded-xl p-4 flex gap-3 hover:border-gold/20 transition-all animate-stagger" style="animation-delay:' + (index * 0.03) + 's"><span class="text-gold font-black text-xl flex-shrink-0 mono">' + tip.num + '</span><div><h4 class="font-bold text-sm">' + tip.title + '</h4><p class="text-gray-400 text-xs">' + tip.desc + '</p></div></div>';
                }).join('')}
                <div class="glass-card rounded-xl p-4 flex gap-3 hover:border-gold/20 transition-all md:col-span-2 animate-stagger" style="animation-delay:0.3s">
                    <span class="text-gold font-black text-xl flex-shrink-0">⭐</span>
                    <div>
                        <h4 class="font-bold text-sm text-gold">Главный совет</h4>
                        <p class="text-gray-300 text-sm">Планируй прокачку на неделю вперёд. Следуй ежедневкам и не трать ресурсы впустую!</p>
                    </div>
                </div>
            </div>
        </div>
    `;
    container.innerHTML = html;
    
    setTimeout(function() {
        applyStaggerAnimation('#tab-tips .stagger-container', 0.03);
        initKineticTitles();
    }, 100);
}

// ===== НОВОСТИ =====
function renderNews() {
    var container = document.getElementById('newsContainer');
    if (!container) return;

    container.innerHTML = NEWS_DATA.map(function(news, index) {
        return '<div class="glass-card rounded-xl p-5 animate-stagger" style="animation-delay:' + (index * 0.1) + 's"><div class="flex items-center gap-2 text-xs text-gray-500 mb-2"><span class="w-2 h-2 bg-' + news.dateColor + '-500 rounded-full"></span>' + news.date + '</div><h3 class="font-bold">' + news.title + '</h3><p class="text-gray-400 text-sm">' + news.desc + '</p><button onclick="switchTab(\'' + news.tab + '\')" class="mt-3 text-gold text-sm font-semibold hover:underline">Читать →</button></div>';
    }).join('');
    
    setTimeout(function() {
        applyStaggerAnimation('#newsContainer', 0.08);
    }, 100);
}

// ===== РЕСУРСЫ (ТАБЛИЦА) =====
function renderResources() {
    var tbody = document.getElementById('resourceBody');
    if (!tbody) return;
    tbody.innerHTML = '';
    var labels = ['Уровень', 'Еда', 'Древесина', 'Металл', 'Топливо', 'Время', 'Требования'];
    
    RESOURCES_DATA.forEach(function(r) {
        var tr = document.createElement('tr');
        var fromLevel = r.n - 1;
        var toLevel = r.n;
        var levelDisplay = fromLevel + '→' + toLevel;
        var values = [levelDisplay, r.food, r.wood, r.metal, r.fuel, r.time, r.req];
        var cls = ['level-col', 'col-eda', 'col-wood', 'col-metal', 'col-fuel', 'col-time', 'req-col'];
        
        tr.innerHTML = values.map(function(v, i) {
            return '<td data-label="' + labels[i] + '" class="' + cls[i] + '">' + v + '</td>';
        }).join('');
        tbody.appendChild(tr);
    });
}

// ===== БАФФЫ =====
function renderBuffs() {
    var container = document.getElementById('buffsContainer');
    if (!container) return;

    var colors = {
        blue: { text: 'blue-400', bg: 'blue-500/10', border: 'blue-500/30', badge: 'bg-blue-500/20 text-blue-300' },
        purple: { text: 'purple-400', bg: 'purple-500/10', border: 'purple-500/30', badge: 'bg-purple-500/20 text-purple-300' },
        gold: { text: 'yellow-400', bg: 'yellow-500/10', border: 'yellow-500/30', badge: 'bg-yellow-500/20 text-yellow-300' }
    };

    container.innerHTML = BUFFS_DATA.map(function(buff, index) {
        var c = colors[buff.color] || colors.blue;
        return `
            <div class="glass-card rounded-xl p-5 text-center border border-${c.border} hover:border-gold/40 transition-all animate-stagger" style="animation-delay:${index * 0.05}s">
                <div class="w-16 h-16 mx-auto rounded-xl overflow-hidden flex-shrink-0 border-2 border-${c.border} bg-black/50 flex items-center justify-center">
                    <img src="images/resources/${buff.icon}" alt="${buff.title}" class="w-full h-full object-cover" onerror="this.style.display='none'; this.parentElement.innerHTML='<svg class=\\'w-8 h-8 text-${c.text}\\' viewBox=\\'0 0 24 24\\' fill=\\'none\\' stroke=\\'currentColor\\' stroke-width=\\'2\\'><rect x=\\'2\\' y=\\'7\\' width=\\'20\\' height=\\'14\\' rx=\\'2\\' ry=\\'2\\'/><path d=\\'M16 21V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v16\\'/></svg>'">
                </div>
                <h4 class="font-bold text-${c.text} text-lg mt-3">${buff.title}</h4>
                <div class="flex justify-center mt-2">
                    <span class="text-[10px] ${c.badge} px-3 py-0.5 rounded-full">${buff.badge}</span>
                </div>
                <div class="mt-3 space-y-1 text-sm">
                    <p class="text-white"><span class="text-gray-500">Стоимость:</span> ${buff.cost}</p>
                    <p class="text-white"><span class="text-gray-500">Длительность:</span> ${buff.duration}</p>
                    <p class="text-gray-400 text-xs">${buff.desc}</p>
                </div>
                <div class="mt-3 text-xs text-gray-500 border-t border-white/5 pt-2">
                    📍 ${buff.source}
                </div>
            </div>
        `;
    }).join('');
    
    setTimeout(function() {
        applyStaggerAnimation('#buffsContainer', 0.05);
    }, 100);
}

// ===== ФУНКЦИЯ ДЛЯ СВОРАЧИВАНИЯ ТАБЛИЦЫ =====
function toggleResourceTable() {
    var wrapper = document.getElementById('resourceTableWrapper');
    var btn = document.getElementById('toggleTableBtn');
    var icon = document.getElementById('toggleTableIcon');
    var text = document.getElementById('toggleTableText');
    
    if (!wrapper) return;
    
    var isCollapsed = wrapper.dataset.collapsed === 'true';
    
    if (isCollapsed) {
        wrapper.dataset.collapsed = 'false';
        if (window.innerWidth >= 769) {
            wrapper.style.maxHeight = wrapper.scrollHeight + 'px';
        } else {
            wrapper.style.maxHeight = '5000px';
        }
        if (icon) icon.textContent = '▾';
        if (text) text.textContent = 'Свернуть таблицу';
        if (btn) {
            btn.classList.remove('border-gold/30');
            btn.classList.add('border-gold/60');
        }
    } else {
        wrapper.dataset.collapsed = 'true';
        wrapper.style.maxHeight = '0px';
        if (icon) icon.textContent = '▸';
        if (text) text.textContent = 'Развернуть таблицу (' + RESOURCES_DATA.length + ' уровней)';
        if (btn) {
            btn.classList.remove('border-gold/60');
            btn.classList.add('border-gold/30');
        }
    }
}

// ===== ИНИЦИАЛИЗАЦИЯ АНИМАЦИЙ ПРИ ЗАГРУЗКЕ =====
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(function() {
        initKineticTitles();
        initTiltEffect();
        applyStaggerAnimation('#newsContainer', 0.08);
    }, 500);
});