import { CONFIG } from './src/core.js';
import { Cocoon } from './src/entities.js';

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const raceSelector = document.getElementById('race-selector');

let selectedRace = CONFIG.RACES.SHADOW;
let entities = [];
let isPaused = false;

// Инициализация интерфейса
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

    // Кнопки управления
    document.getElementById('pause-btn').onclick = () => {
        isPaused = !isPaused;
        document.getElementById('pause-btn').innerText = isPaused ? '▶' : '⏸';
    };

    document.getElementById('reset-btn').onclick = () => {
        entities = [];
    };
}

// Обработка касаний
const handleInput = (e) => {
    e.preventDefault();
    const rect = canvas.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;

    const scaleX = CONFIG.LOGICAL_SIZE / rect.width;
    const scaleY = CONFIG.LOGICAL_SIZE / rect.height;

    const x = (clientX - rect.left) * scaleX;
    const y = (clientY - rect.top) * scaleY;
    
    if (x >= 0 && x <= CONFIG.LOGICAL_SIZE && y >= 0 && y <= CONFIG.LOGICAL_SIZE) {
        entities.push(new Cocoon(x, y, selectedRace));
    }
};

canvas.addEventListener('touchstart', handleInput, { passive: false });
canvas.addEventListener('mousedown', handleInput);

function gameLoop() {
    // Подстройка разрешения под экран
    const displayWidth = canvas.clientWidth;
    if (canvas.width !== displayWidth) {
        canvas.width = displayWidth;
        canvas.height = displayWidth;
    }

    const scale = canvas.width / CONFIG.LOGICAL_SIZE;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    entities.forEach(ent => {
        if (!isPaused && ent.update) ent.update(16); // 16ms approx for 60fps
        ent.draw(ctx, scale);
    });
    
    requestAnimationFrame(gameLoop);
}

initUI();
gameLoop();
