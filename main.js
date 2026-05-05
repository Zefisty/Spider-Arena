const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

// размер под экран
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// тестовый объект (будущий паук)
let x = 100;
let y = 100;
let speed = 2;

// игровой цикл
function gameLoop() {
    // очистка экрана
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // движение (просто вправо для теста)
    x += speed;

    // если вышел за экран — вернуть
    if (x > canvas.width) {
        x = 0;
    }

    // рисуем "паука" (пока просто круг)
    ctx.fillStyle = "white";
    ctx.beginPath();
    ctx.arc(x, y, 10, 0, Math.PI * 2);
    ctx.fill();

    requestAnimationFrame(gameLoop);
}

// запуск
gameLoop();
