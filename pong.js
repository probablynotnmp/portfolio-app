let clickCount = 0;

function checkClick() {
  clickCount++;
  if (clickCount >= 5) {
    startPongGame();
  }
}

function startPongGame() {
  document.body.innerHTML = '';
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  canvas.width = 600;
  canvas.height = 400;
  document.body.appendChild(canvas);

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

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawPaddle(paddle);
    drawPaddle(aiPaddle);
    drawBall();
    ball.x += ball.dx;
    ball.y += ball.dy;
    if (ball.y + ball.size >= canvas.height || ball.y - ball.size <= 0) {
      ball.dy *= -1;
    }
    if (ball.x + ball.size >= canvas.width) {
      ball.dx *= -1;
    }
    if (ball.x - ball.size <= 0) {
      // Reset ball position
      ball.x = canvas.width / 2;
      ball.y = canvas.height / 2;
      ball.dx = 5;
      ball.dy = 5;
    }
    if (ball.x - ball.size <= paddle.x + paddle.width && ball.y >= paddle.y && ball.y <= paddle.y + paddle.height) {
      ball.dx *= -1;
    }
    if (ball.x + ball.size >= aiPaddle.x && ball.y >= aiPaddle.y && ball.y <= aiPaddle.y + aiPaddle.height) {
      ball.dx *= -1;
    }
    // AI logic
    if (aiPaddle.y + aiPaddle.height / 2 < ball.y) {
      aiPaddle.dy = aiPaddle.speed;
    } else {
      aiPaddle.dy = -aiPaddle.speed;
    }
    aiPaddle.y += aiPaddle.dy;
    requestAnimationFrame(draw);
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
