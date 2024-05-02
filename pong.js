function startPongGame() {
  document.body.innerHTML = '';
  const container = document.createElement('div');
  container.style.display = 'flex';
  container.style.flexDirection = 'column';
  container.style.alignItems = 'center';
  document.body.appendChild(container);

  const scoreboard = document.createElement('div');
  scoreboard.style.font = '30px Arial';
  scoreboard.style.color = '#fff';
  container.appendChild(scoreboard);

  const canvasContainer = document.createElement('div');
  canvasContainer.style.position = 'relative';
  container.appendChild(canvasContainer);

  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  const screenWidth = window.innerWidth * 0.7; // 70% of the screen width
  const screenHeight = window.innerHeight * 0.7; // 70% of the screen height
  const canvasWidth = Math.min(screenWidth, screenHeight * 1.5); // Set canvas width to maintain aspect ratio
  const canvasHeight = canvasWidth * 2 / 3; // Set canvas height to maintain aspect ratio
  const padding = (screenHeight - canvasHeight) / 2; // Calculate padding size
  canvas.width = canvasWidth;
  canvas.height = canvasHeight;
  canvas.style.display = 'block'; // Make the canvas a block-level element
  canvas.style.marginTop = padding + 'px'; // Apply padding to the top
  canvasContainer.appendChild(canvas);

  const paddle = {
    width: 10,
    height: 80,
    x: 10,
    y: canvas.height / 2 - 40,
    speed: 8,
    dy: 0
  };

  const aiPaddle = {
    width: 10,
    height: 80,
    x: canvas.width - 20,
    y: canvas.height / 2 - 40,
    speed: 8,
    dy: 0
  };

  const ball = {
    size: 10,
    x: canvas.width / 2,
    y: canvas.height / 2,
    speed: 5,
    dx: 5,
    dy: 5
  };

  function drawPaddle(p) {
    ctx.fillStyle = '#fff';
    ctx.fillRect(p.x, p.y, p.width, p.height);
  }

  function drawBall() {
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.size, 0, Math.PI * 2);
    ctx.fillStyle = '#fff';
    ctx.fill();
    ctx.closePath();
  }

  function drawScore() {
    scoreboard.textContent = `Player: ${playerScore} - PR: ${aiScore}`;
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawPaddle(paddle);
    drawPaddle(aiPaddle);
    drawBall();
    drawScore(); // Draw score
    ball.x += ball.dx;
    ball.y += ball.dy;
    if (ball.y + ball.size >= canvas.height || ball.y - ball.size <= 0) {
      ball.dy *= -1;
    }
    if (ball.x + ball.size >= canvas.width) {
      playerScore++; // Player scores
      resetBall();
    }
    if (ball.x - ball.size <= 0) {
      aiScore++; // PR scores
      resetBall();
    }
    if (ball.x - ball.size <= paddle.x + paddle.width && ball.y >= paddle.y && ball.y <= paddle.y + paddle.height) {
      ball.dx *= -1;
    }
    if (ball.x + ball.size >= aiPaddle.x && ball.y >= aiPaddle.y && ball.y <= aiPaddle.y + aiPaddle.height) {
      ball.dx *= -1;
    }
    // AI logic
    if (ball.x > canvas.width / 2) {
      if (aiPaddle.y + aiPaddle.height / 2 < ball.y) {
        aiPaddle.dy = aiPaddle.speed;
      } else {
        aiPaddle.dy = -aiPaddle.speed;
      }
    } else {
      if (aiPaddle.y + aiPaddle.height / 2 < canvas.height / 2) {
        aiPaddle.dy = aiPaddle.speed;
      } else {
        aiPaddle.dy = -aiPaddle.speed;
      }
    }
    aiPaddle.y += aiPaddle.dy;
    requestAnimationFrame(draw);
  }

  function resetBall() {
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;
    ball.dx = Math.random() > 0.5 ? -ball.speed : ball.speed;
    ball.dy = Math.random() > 0.5 ? -ball.speed : ball.speed;
  }

  draw();

  document.addEventListener('keydown', function(e) {
    if (e.key === 'ArrowUp') {
      paddle.dy = -paddle.speed;
    } else if (e.key === 'ArrowDown') {
      paddle.dy = paddle.speed;
    }
  });

  document.addEventListener('keyup', function(e) {
    if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
      paddle.dy = 0;
    }
  });

  canvas.addEventListener('mousemove', function(e) {
    const rect = canvas.getBoundingClientRect();
    paddle.y = e.clientY - rect.top - paddle.height / 2;
  });
}
