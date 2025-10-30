const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const scoreValue = document.getElementById("scoreValue");
const highScoreValue = document.getElementById("highScoreValue");
const startScreen = document.getElementById("startScreen");
const startButton = document.getElementById("startButton");
const restartButton = document.getElementById("restartButton");
const leftBtn = document.getElementById("leftBtn");
const rightBtn = document.getElementById("rightBtn");

// Oyun değişkenleri
const carWidth = 50;
const carHeight = 100;
let carX = canvas.width / 2 - carWidth / 2;
let carY = canvas.height - carHeight - 20;
let carSpeed = 7;

let rightPressed = false;
let leftPressed = false;
let score = 0;
let highScore = localStorage.getItem("highScore") || 0;
let gameOver = false;
let gameStarted = false;
let obstacleSpeed = 3;
let obstacleInterval = 2000;
let obstacleIntervalId = null;

highScoreValue.textContent = highScore;

const obstacles = [];
const obstacleWidth = 60;
const obstacleHeight = 60;

// Araba görseli
const carImg = new Image();
carImg.src =
  "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA1MCAxMDAiPjxwYXRoIGZpbGw9IiNlOTQ1NjAiIGQ9Ik0xMCA4MEg0MFY0MEgxMFoiLz48cGF0aCBmaWxsPSIjZmZmIiBkPSJNMTUgNDVIMzVWNDBIMTVaIi8+PHBhdGggZmlsbD0iIzJhMmEyYSIgZD0iTTE1IDc1SDM1VjU1SDE1WiIvPjxjaXJjbGUgY3g9IjE1IiBjeT0iODUiIHI9IjUiIGZpbGw9IiMyYTJhMmEiLz48Y2lyY2xlIGN4PSIzNSIgY3k9Ijg1IiByPSI1IiBmaWxsPSIjMmEyYTJhIi8+PC9zdmc+";

// Engel görseli
const obstacleImg = new Image();
obstacleImg.src =
  "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA2MCA2MCI+PHJlY3QgeD0iMCIgeT0iMCIgd2lkdGg9IjYwIiBoZWlnaHQ9IjYwIiBmaWxsPSIjMGYzNDYwIi8+PHJlY3QgeD0iNSIgeT0iNSIgd2lkdGg9IjUwIiBoZWlnaHQ9IjUwIiBmaWxsPSIjMWExZjJjIi8+PHJlY3QgeD0iMTAiIHk9IjEwIiB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIGZpbGw9IiMwZjM0NjAiLz48L3N2Zz4=";

// Yol çizgileri
function drawRoad() {
  ctx.fillStyle = "#1a1a2e";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Yol
  ctx.fillStyle = "#2a2a3e";
  ctx.fillRect(0, 0, canvas.width, canvas.height - 20);

  // Yol çizgileri
  ctx.fillStyle = "#ffffff";
  const lineHeight = 30;
  const lineWidth = 10;
  const lineSpacing = 50;

  for (let y = -lineHeight; y < canvas.height; y += lineSpacing) {
    ctx.fillRect(canvas.width / 2 - lineWidth / 2, y, lineWidth, lineHeight);
  }

  // Yol kenarları
  ctx.fillStyle = "#e94560";
  ctx.fillRect(0, 0, 10, canvas.height);
  ctx.fillRect(canvas.width - 10, 0, 10, canvas.height);

  // Bitiş çizgisi
  ctx.fillStyle = "#0f3460";
  ctx.fillRect(0, canvas.height - 20, canvas.width, 20);
}

function createObstacle() {
  if (!gameOver && gameStarted) {
    const x = Math.random() * (canvas.width - obstacleWidth - 20) + 10;
    obstacles.push({
      x,
      y: -obstacleHeight,
      width: obstacleWidth,
      height: obstacleHeight,
    });

    // Zorluk artışı
    if (score > 0 && score % 100 === 0) {
      obstacleSpeed = Math.min(obstacleSpeed + 0.2, 8);
      obstacleInterval = Math.max(obstacleInterval - 100, 800);

      clearInterval(obstacleIntervalId);
      obstacleIntervalId = setInterval(createObstacle, obstacleInterval);
    }
  }
}

function startObstacleGeneration() {
  obstacleIntervalId = setInterval(createObstacle, obstacleInterval);
}

function stopObstacleGeneration() {
  clearInterval(obstacleIntervalId);
}

// Kontrol olayları
document.addEventListener("keydown", keyDownHandler);
document.addEventListener("keyup", keyUpHandler);

function keyDownHandler(e) {
  if (!gameOver && gameStarted) {
    if (e.key === "Right" || e.key === "ArrowRight") {
      rightPressed = true;
    } else if (e.key === "Left" || e.key === "ArrowLeft") {
      leftPressed = true;
    }
  }
}

function keyUpHandler(e) {
  if (!gameOver && gameStarted) {
    if (e.key === "Right" || e.key === "ArrowRight") {
      rightPressed = false;
    } else if (e.key === "Left" || e.key === "ArrowLeft") {
      leftPressed = false;
    }
  }
}

// Mobil kontroller
leftBtn.addEventListener("touchstart", () => (leftPressed = true));
leftBtn.addEventListener("touchend", () => (leftPressed = false));
rightBtn.addEventListener("touchstart", () => (rightPressed = true));
rightBtn.addEventListener("touchend", () => (rightPressed = false));

// Masaüstü için mouse olayları
leftBtn.addEventListener("mousedown", () => (leftPressed = true));
leftBtn.addEventListener("mouseup", () => (leftPressed = false));
leftBtn.addEventListener("mouseleave", () => (leftPressed = false));
rightBtn.addEventListener("mousedown", () => (rightPressed = true));
rightBtn.addEventListener("mouseup", () => (rightPressed = false));
rightBtn.addEventListener("mouseleave", () => (rightPressed = false));

function drawCar() {
  ctx.drawImage(carImg, carX, carY, carWidth, carHeight);
}

function drawObstacle(obstacle) {
  ctx.drawImage(
    obstacleImg,
    obstacle.x,
    obstacle.y,
    obstacle.width,
    obstacle.height
  );
}

function checkCollision(car, obstacle) {
  return (
    car.x < obstacle.x + obstacle.width &&
    car.x + carWidth > obstacle.x &&
    car.y < obstacle.y + obstacle.height &&
    car.y + carHeight > obstacle.y
  );
}

function drawGameOver() {
  ctx.fillStyle = "rgba(0, 0, 0, 0.85)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "#e94560";
  ctx.font = "bold 48px 'Arial', Tahoma, Geneva, Verdana, sans-serif";
  ctx.textAlign = "center";
  ctx.fillText("GAME OVER", canvas.width / 2, canvas.height / 2 - 80);

  ctx.fillStyle = "white";
  ctx.font = "30px 'Arial', Tahoma, Geneva, Verdana, sans-serif";
  ctx.fillText(`Score: ${score}`, canvas.width / 2, canvas.height / 2 - 20);

  if (score > highScore) {
    ctx.fillStyle = "#e94560";
    ctx.font = "bold 24px 'Arial', Tahoma, Geneva, Verdana, sans-serif";
    ctx.fillText("YENİ REKOR!", canvas.width / 2, canvas.height / 2 + 20);
  }

  restartButton.classList.remove("hidden");
}

function update() {
  if (!gameOver && gameStarted) {
    if (rightPressed && carX < canvas.width - carWidth - 10) {
      carX += carSpeed;
    } else if (leftPressed && carX > 10) {
      carX -= carSpeed;
    }

    obstacles.forEach((obstacle, index) => {
      obstacle.y += obstacleSpeed;
      if (obstacle.y > canvas.height) {
        obstacles.splice(index, 1);
        score += 10;
        scoreValue.textContent = score;
      }
      if (
        checkCollision(
          { x: carX, y: carY, width: carWidth, height: carHeight },
          obstacle
        )
      ) {
        gameOver = true;
        stopObstacleGeneration();

        if (score > highScore) {
          highScore = score;
          localStorage.setItem("highScore", highScore);
          highScoreValue.textContent = highScore;
        }
      }
    });
  }
}

function draw() {
  drawRoad();

  if (!gameOver) {
    if (gameStarted) {
      drawCar();
      obstacles.forEach(drawObstacle);
      update();
    }
  } else {
    drawGameOver();
  }

  requestAnimationFrame(draw);
}

function startGame() {
  gameStarted = true;
  startScreen.classList.add("hidden");
  startObstacleGeneration();
}

function restartGame() {
  carX = canvas.width / 2 - carWidth / 2;
  score = 0;
  scoreValue.textContent = score;
  gameOver = false;
  gameStarted = true;
  obstacles.length = 0;
  obstacleSpeed = 3;
  obstacleInterval = 2000;
  restartButton.classList.add("hidden");
  stopObstacleGeneration();
  startObstacleGeneration();
}

// Olay dinleyicileri
startButton.addEventListener("click", startGame);
restartButton.addEventListener("click", restartGame);

// Oyunu başlat
draw();
