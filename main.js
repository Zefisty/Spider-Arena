const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// 🕷️ массив пауков
let spiders = [];

// создаём 20 пауков
for (let i = 0; i < 20; i++) {
    spiders.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2,
        size: 6 + Math.random() * 6
    });
}

// игровой цикл
function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    spiders.forEach(spider => {
        // движение
        spider.x += spider.vx;
        spider.y += spider.vy;

        // отскок от стен
        if (spider.x < 0 || spider.x > canvas.width) spider.vx *= -1;
        if (spider.y < 0 || spider.y > canvas.height) spider.vy *= -1;

        // рисуем
        ctx.fillStyle = "white";
        ctx.beginPath();
        ctx.arc(spider.x, spider.y, spider.size, 0, Math.PI * 2);
        ctx.fill();
    });

    requestAnimationFrame(gameLoop);
}

gameLoop();
