// Toast rápido
let toastTimeout;
function notify(text) {
    const el = document.getElementById('status-toast');
    el.textContent = text;
    el.classList.add('visible');
    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => el.classList.remove('visible'), 3000);
}

// Alternar Modo Claro / Modo Escuro
function applyTheme(isLight) {
    const btn = document.getElementById('btn-theme');
    if (isLight) {
        document.body.classList.add('light-mode');
        btn.textContent = '🌙 Modo Escuro';
    } else {
        document.body.classList.remove('light-mode');
        btn.textContent = '☀️ Modo Claro';
    }
}

function toggleTheme() {
    const isLight = !document.body.classList.contains('light-mode');
    applyTheme(isLight);
    localStorage.setItem('xmas_globe_theme', isLight ? 'light' : 'dark');
    chime(isLight ? 1046 : 784, 0.25);
    notify(isLight ? '☀️ Modo Claro ativado!' : '🌙 Modo Escuro ativado!');
}

// Carrega preferência salva
applyTheme(localStorage.getItem('xmas_globe_theme') === 'light');

// Sintetizador de Sinos
let audioCtx;
function chime(freq = 880, dur = 0.4) {
    try {
        if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        if (audioCtx.state === 'suspended') audioCtx.resume();
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
        gain.gain.setValueAtTime(0.11, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + dur);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start();
        osc.stop(audioCtx.currentTime + dur);
    } catch (e) { }
}

function playChristmasChime() {
    const melody = [523, 659, 784, 1046, 987, 784, 659, 784];
    melody.forEach((n, idx) => setTimeout(() => chime(n, 0.42), idx * 210));
    notify('🎶 Tocando melodia de Natal!');
}

// Pisca-Pisca
const lightsContainer = document.getElementById('fairy-lights');
const totalBulbs = Math.max(14, Math.floor(window.innerWidth / 52));
for (let i = 0; i < totalBulbs; i++) {
    const bulb = document.createElement('div');
    bulb.className = 'fairy-bulb';
    lightsContainer.appendChild(bulb);
}

const fairyModes = [
    { cls: 'mode-warm', label: '💡 Pisca-Pisca: Dourado' },
    { cls: 'mode-rgb', label: '🌈 Pisca-Pisca: Colorido' },
    { cls: 'mode-off', label: '🌙 Pisca-Pisca: Apagado' }
];
let currentFairy = 0;

function switchFairyMode() {
    lightsContainer.classList.remove(fairyModes[currentFairy].cls);
    currentFairy = (currentFairy + 1) % fairyModes.length;
    lightsContainer.classList.add(fairyModes[currentFairy].cls);
    document.getElementById('btn-fairy').textContent = fairyModes[currentFairy].label;
    chime(987, 0.25);
}

// Neve dentro do Globo (com física de agitação)
const canvas = document.getElementById('globe-snow-canvas');
const ctx = canvas.getContext('2d');
canvas.width = 400;
canvas.height = 400;

let turbulence = 0;
const snowflakes = Array.from({ length: 110 }, () => ({
    x: Math.random() * 400,
    y: Math.random() * 340,
    r: Math.random() * 2.8 + 1.2,
    vy: Math.random() * 0.9 + 0.35,
    vx: (Math.random() - 0.5) * 0.5
}));

function shakeSnowGlobe() {
    const sphere = document.getElementById('snowglobe');
    sphere.classList.remove('shaking');
    void sphere.offsetWidth;
    sphere.classList.add('shaking');

    turbulence = 7.5;
    snowflakes.forEach(f => {
        f.vx = (Math.random() - 0.5) * 8;
        f.vy = (Math.random() - 0.7) * 7;
    });
    chime(1174, 0.35);
    notify('❄️ Tempestade de neve mágica ativada!');
}

function renderGlobeSnow() {
    ctx.clearRect(0, 0, 400, 400);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.92)';
    ctx.beginPath();

    for (const f of snowflakes) {
        if (turbulence > 0.1) {
            f.x += f.vx;
            f.y += f.vy;
            f.vy += 0.08;
        } else {
            f.y += f.vy * 0.45 + 0.35;
            f.x += Math.sin(f.y * 0.03) * 0.4;
        }

        const dx = f.x - 200;
        const dy = f.y - 200;
        if (dx * dx + dy * dy > 192 * 192) {
            f.y = 35 + Math.random() * 40;
            f.x = 110 + Math.random() * 180;
            f.vy = Math.random() * 0.8 + 0.3;
        }
        if (f.y > 345) {
            f.y = 30 + Math.random() * 30;
            f.x = 100 + Math.random() * 200;
        }

        ctx.moveTo(f.x, f.y);
        ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2);
    }
    ctx.fill();
    turbulence *= 0.96;
    requestAnimationFrame(renderGlobeSnow);
}
renderGlobeSnow();

// Interações dentro do Globo (Árvore e Boneco de Neve)
const baublePalette = ['#e63946', '#ffd166', '#2ec4b6', '#4cc9f0', '#f72585'];
function addTreeBauble() {
    const container = document.getElementById('tree-baubles');
    if (container.children.length > 26) {
        while (container.children.length > 8) container.removeChild(container.lastChild);
        notify('🎄 Enfeites renovados na árvore!');
        return;
    }
    const c = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    const y = 125 + Math.random() * 140;
    const spread = (y - 105) * 0.34;
    const x = 143 + (Math.random() * 2 - 1) * spread;
    c.setAttribute('cx', x.toFixed(1));
    c.setAttribute('cy', y.toFixed(1));
    c.setAttribute('r', '5');
    c.setAttribute('fill', baublePalette[Math.floor(Math.random() * baublePalette.length)]);
    container.appendChild(c);
    chime(784 + Math.random() * 400, 0.22);
}

function toggleGlobeStar(e) {
    e.stopPropagation();
    const star = document.getElementById('globe-star');
    star.classList.toggle('glowing');
    const on = star.classList.contains('glowing');
    star.setAttribute('fill', on ? '#ffd166' : '#64748b');
    chime(on ? 1318 : 523, 0.35);
    notify(on ? '⭐ Estrela acesa!' : '🌙 Estrela apagada.');
}

const accessories = ['hat-tophat', 'hat-santa', 'hat-earmuffs'];
const scarfColors = ['#e63946', '#2ec4b6', '#f4a261'];
let accIdx = 0;

function cycleSnowmanAccessory() {
    document.getElementById(accessories[accIdx]).style.display = 'none';
    accIdx = (accIdx + 1) % accessories.length;
    document.getElementById(accessories[accIdx]).style.display = 'block';

    const color = scarfColors[accIdx];
    document.getElementById('snowman-scarf').setAttribute('stroke', color);
    document.getElementById('snowman-scarf-tail').setAttribute('stroke', color);
    chime(880, 0.25);
    notify('☃️ Visual do boneco de neve atualizado!');
}

// Trenó do Papai Noel + Entrega de Paraquedas
const flyer = document.getElementById('santa-flyer');
let dropTimer;

function triggerSantaFlight() {
    if (flyer.classList.contains('active')) {
        notify('🦌 O trenó já está sobrevoando!');
        return;
    }
    flyer.classList.add('active');
    chime(784, 0.25);
    setTimeout(() => chime(1046, 0.35), 160);
    notify('🎅 Papai Noel e Rodolfo estão passando! Clique nos presentes!');

    dropTimer = setInterval(() => {
        const rect = flyer.getBoundingClientRect();
        if (rect.left > 50 && rect.left < window.innerWidth - 70) {
            spawnParachuteGift(rect.left + 45, rect.top + 45);
        }
    }, 2700);

    setTimeout(() => {
        flyer.classList.remove('active');
        clearInterval(dropTimer);
    }, 15200);
}

function spawnParachuteGift(x, y) {
    const gifts = ['🎁', '🧸', '🍪', '⭐'];
    const item = document.createElement('div');
    item.className = 'parachute-drop';
    item.style.left = `${x}px`;
    item.style.top = `${y}px`;
    item.innerHTML = `🪂<span>${gifts[Math.floor(Math.random() * gifts.length)]}</span>`;
    item.onclick = () => {
        chime(1318, 0.35);
        notify('🎉 Você resgatou um presente de paraquedas do Papai Noel!');
        item.remove();
    };
    document.body.appendChild(item);
    setTimeout(() => item.remove(), 5500);
}

flyer.addEventListener('click', () => {
    chime(1046, 0.3);
    notify('🦌 Ho-Ho-Ho! Feliz Natal para toda a sua família!');
});

setTimeout(triggerSantaFlight, 2200);

// Cartões 3D
function flipCard(el) {
    el.classList.toggle('flipped');
    chime(659, 0.22);
}

// Lanternas de Desejos
const initialLanterns = [
    { name: 'Com Carinho', wish: 'Que a nossa mesa esteja sempre cheia de saúde, risadas e união! ✨' },
    { name: 'Papai Noel', wish: 'Ho-Ho-Ho! Muita luz e proteção para cada lar dessa família! 🎅' }
];

function renderLanterns() {
    const list = JSON.parse(localStorage.getItem('xmas_globe_lanterns') || 'null') || initialLanterns;
    const grid = document.getElementById('lantern-grid');
    grid.innerHTML = '';
    list.forEach(item => {
        const card = document.createElement('div');
        card.className = 'lantern-item';
        card.innerHTML = `<strong>🏮 ${escapeText(item.name)}</strong><p>${escapeText(item.wish)}</p>`;
        grid.appendChild(card);
    });
}

function createLantern(e) {
    e.preventDefault();
    const nameEl = document.getElementById('sender-name');
    const wishEl = document.getElementById('sender-wish');
    const list = JSON.parse(localStorage.getItem('xmas_globe_lanterns') || 'null') || [...initialLanterns];

    list.unshift({ name: nameEl.value.trim(), wish: wishEl.value.trim() });
    localStorage.setItem('xmas_globe_lanterns', JSON.stringify(list.slice(0, 20)));

    nameEl.value = '';
    wishEl.value = '';
    renderLanterns();
    chime(1046, 0.35);
    notify('🏮 Sua lanterna de Natal foi acesa!');
}

function escapeText(str) {
    return str.replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

renderLanterns();