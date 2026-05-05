import { CONFIG } from './src/core.js';
import { Cocoon } from './src/entities.js';

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const raceSelector = document.getElementById('race-selector');

let selectedRace = CONFIG.RACES.SHADOW;
let entities = [];
let lastTime = 0;

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
}

const handleInput = (e) => {
    e.preventDefault();
    const rect = canvas.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;

    const x = (clientX - rect.left) / rect.width * CONFIG.LOGICAL_SIZE;
    const y = (clientY - rect.top) / rect.height * CONFIG.LOGICAL_SIZE;
    
    if (entities.length < 8) {
        entities.push(new Cocoon(x, y, selectedRace));
    }
};

canvas.addEventListener('touchstart', handleInput, { passive: false });
canvas.addEventListener('mousedown', handleInput);

function gameLoop(timestamp) {
    const dt = timestamp - lastTime;
    lastTime = timestamp;

    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientWidth;
    const scale = canvas.width / CONFIG.LOGICAL_SIZE;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    entities.forEach(ent => {
        if (ent.update) ent.update(dt);
        ent.draw(ctx, scale);
    });
    
    requestAnimationFrame(gameLoop);
}

initUI();
requestAnimationFrame(gameLoop);
