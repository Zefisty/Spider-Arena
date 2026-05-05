// ==========================================
// 1. КОНФИГУРАЦИЯ РАС
// ==========================================
const CONFIG = {
    RACES: {
        SHADOW: { id: 'shadow', name: 'ТЕНЕВЫЕ', color: '#9d50bb', icon: '🕷️', hp: 300 },
        SAND:   { id: 'sand',   name: 'ПЕСЧАНЫЕ', color: '#e67e22', icon: '🦂', hp: 250 },
        VENOM:  { id: 'venom',  name: 'ЯДОВИТЫЙ', color: '#27ae60', icon: '🧪', hp: 220 },
        FROST:  { id: 'frost',  name: 'МОРОЗНЫЕ', color: '#2980b9', icon: '❄️', hp: 350 },
        STONE:  { id: 'stone',  name: 'КАМЕННЫЕ', color: '#f1c40f', icon: '🧱', hp: 450 }
    },
    LOGICAL_SIZE: 800
};

// ==========================================
// 2. КЛАСС КОКОНА
// ==========================================
class Cocoon {
    constructor(x, y, race) {
        this.x = x; 
        this.y = y; 
        this.race = race;
        this.hp = race.hp; 
        this.maxHp = race.hp;
        this.radius = 25; 
        this.spawnTimer = 0;
    }

    update(dt) {
        if (!dt) return;
        this.spawnTimer += dt;
        if (this.spawnTimer >= 3000) {
            this.spawnTimer = 0;
            console.log("Спавн паука от расы:", this.race.name);
        }
    }

    draw(ctx, scale) {
        const lx = this.x * scale; 
        const ly = this.y * scale;

        // Паутина
        ctx.strokeStyle = this.race.color + "44"; // полупрозрачность
        for(let i=0; i<8; i++) {
            ctx.beginPath(); 
            ctx.moveTo(lx, ly);
            ctx.lineTo(lx + Math.cos(i*0.8)*40*scale, ly + Math.sin(i*0.8)*40*scale);
            ctx.stroke();
        }

        // Яйцо
        ctx.beginPath();
        ctx.ellipse(lx, ly, this.radius*scale*0.8, this.radius*scale, 0, 0, Math.PI*2);
        ctx.fillStyle = this.race.color; 
        ctx.fill();
        ctx.strokeStyle = "#fff"; 
        ctx.lineWidth = 2; 
        ctx.stroke();

        // HP бар
        const w = 50 * scale;
        ctx.fillStyle = "#000"; 
        ctx.fillRect(lx - w/2, ly - 45*scale, w, 6*scale);
        ctx.fillStyle = this.race.color; 
        ctx.fillRect(lx - w/2, ly - 45*scale, w * (this.hp/this.maxHp), 6*scale);
    }
}

// ==========================================
// 3. УПРАВЛЕНИЕ ИГРОЙ
// ==========================================
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const raceSelector = document.getElementById('race-selector');

let selectedRace = CONFIG.RACES.SHADOW;
let entities = [];
let isPaused = false;
let lastTime = performance.now();

// Создаем кнопки
function initUI() {
    raceSelector.innerHTML = '';
    Object.values(CONFIG.RACES).forEach(race => {
        const card = document.createElement('div');
        card.className = `race-card ${race.id === selectedRace.id ? 'active' : ''}`;
        card.style.setProperty('--race-color', race.color);
        card.innerHTML = `<div class="icon">${race.icon}</div><div class="name">${race.name}</div>`;
        
        card.onclick = () => {
            selectedRace = race;
            document.querySelectorAll('.race-card').forEach(c => c.classList.remove('active'));
            card.classList.add('active');
        };
        raceSelector.appendChild(card);
    });

    document.getElementById('pause-btn').onclick = () => {
        isPaused = !isPaused;
        document.getElementById('pause-btn').innerText = isPaused ? '▶' : '⏸';
    };

    document.getElementById('reset-btn').onclick = () => {
        entities = [];
    };
}

// Ставим коконы
const handleInput = (e) => {
    e.preventDefault();
    const rect = canvas.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;

    const scaleX = CONFIG.LOGICAL_SIZE / rect.width;
    const scaleY = CONFIG.LOGICAL_SIZE / rect.height;

    const x = (clientX - rect.left) * scaleX;
    const y = (clientY - rect.top) * scaleY;
    
    // Лимит на 8 коконов
    if (entities.length < 8) {
        entities.push(new Cocoon(x, y, selectedRace));
    }
};

canvas.addEventListener('touchstart', handleInput, { passive: false });
canvas.addEventListener('mousedown', handleInput);

// Игровой цикл
function gameLoop(timestamp) {
    const dt = timestamp - lastTime;
    lastTime = timestamp;
    
    const displayWidth = canvas.clientWidth;
    if (canvas.width !== displayWidth) {
        canvas.width = displayWidth;
        canvas.height = displayWidth;
    }

    const scale = canvas.width / CONFIG.LOGICAL_SIZE;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    entities.forEach(ent => {
        // Ограничиваем dt, чтобы при сворачивании окна таймер не сходил с ума
        if (!isPaused && ent.update) ent.update(dt > 100 ? 16 : dt); 
        ent.draw(ctx, scale);
    });
    
    requestAnimationFrame(gameLoop);
}

// Запуск
initUI();
requestAnimationFrame(gameLoop);
