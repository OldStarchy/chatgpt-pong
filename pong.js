// Get the canvas element and its context
const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');

// Set the canvas dimensions
canvas.width = 500;
canvas.height = 300;

// Create the ball object
const ball = {
	x: canvas.width / 2,
	y: canvas.height / 2,
	radius: 10,
	xVelocity: 1,
	yVelocity: 1,
};

// Create the paddle objects
const paddleWidth = 10;
const paddleHeight = 75;
const paddleDistanceFromEdge = 50;
const player1 = {
	x: 10,
	y: canvas.height / 2 - 50,
	width: 20,
	height: 100,
	score: 0,
	ballInPaddle: false,
	yVelocity: 0,
};

const player2 = {
	x: canvas.width - 30,
	y: canvas.height / 2 - 50,
	width: 20,
	height: 100,
	score: 0,
	ballInPaddle: false,
	yVelocity: 0,
};

// Draw the ball on the canvas
const drawBall = () => {
	ctx.beginPath();
	ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
	ctx.fillStyle = 'white';
	ctx.fill();
	ctx.closePath();
};

// Draw a paddle on the canvas
const drawPaddle = (paddle) => {
	ctx.beginPath();
	ctx.rect(paddle.x, paddle.y, paddle.width, paddle.height);
	ctx.fillStyle = 'white';
	ctx.fill();
	ctx.closePath();
};

// Draw the score on the canvas
const drawScore = () => {
	ctx.font = '16px Arial';
	ctx.fillStyle = 'white';
	ctx.fillText(`Player 1: ${player1.score}`, canvas.width / 4, 20);
	ctx.fillText(`Player 2: ${player2.score}`, (canvas.width / 4) * 3, 20);
};

// Clear the canvas
const clearCanvas = () => {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
};

// Move the ball
const moveBall = () => {
	// Move the ball
	ball.x += ball.xVelocity;
	ball.y += ball.yVelocity;

	// Check for collision with top or bottom of canvas
	if (ball.y + ball.radius > canvas.height || ball.y - ball.radius < 0) {
		ball.yVelocity = -ball.yVelocity;
	}

	// Check for point scored
	if (ball.x + ball.radius < 0) {
		player2.score++;
		resetBall();
	} else if (ball.x - ball.radius > canvas.width) {
		player1.score++;
		resetBall();
	}

	checkCollisionWithPaddle(player1);
	checkCollisionWithPaddle(player2);
};

const checkCollisionWithPaddle = (paddle) => {
	let dx = ball.x - paddle.x - paddle.width / 2;
	let dy = ball.y - paddle.y - paddle.height / 2;

	if (
		ball.x + ball.radius > paddle.x &&
		ball.x - ball.radius < paddle.x + paddle.width &&
		ball.y + ball.radius > paddle.y &&
		ball.y - ball.radius < paddle.y + paddle.height
	) {
		if (!paddle.ballInPaddle) {
			let aspectRatio = paddle.width / paddle.height;
			if (Math.abs(dx / dy) > aspectRatio) {
				ball.xVelocity = Math.abs(ball.xVelocity) * Math.sign(dx);
			} else {
				ball.yVelocity = Math.abs(ball.yVelocity) * Math.sign(dy);
			}
			paddle.ballInPaddle = true;
		}
	} else {
		paddle.ballInPaddle = false;
	}
};

// Reset the ball to the center of the canvas
const resetBall = () => {
	ball.x = canvas.width / 2;
	ball.y = canvas.height / 2;
	ball.xVelocity = -ball.xVelocity;
};
const movePaddle = (paddle) => {
	paddle.y += paddle.yVelocity;
	if (paddle.y <= 0) {
		paddle.y = 0;
	} else if (paddle.y + paddle.height >= canvas.height) {
		paddle.y = canvas.height - paddle.height;
	}
};

const paddleSpeed = 5;
document.addEventListener('keydown', (event) => {
	if (event.code === 'ArrowUp') {
		player1.yVelocity = -paddleSpeed;
	} else if (event.code === 'ArrowDown') {
		player1.yVelocity = paddleSpeed;
	} else if (event.code === 'KeyW') {
		player2.yVelocity = -paddleSpeed;
	} else if (event.code === 'KeyS') {
		player2.yVelocity = paddleSpeed;
	}
});

document.addEventListener('keyup', (event) => {
	if (event.code === 'ArrowUp' || event.code === 'ArrowDown') {
		player1.yVelocity = 0;
	} else if (event.code === 'KeyW' || event.code === 'KeyS') {
		player2.yVelocity = 0;
	}
});

// Keep player paddles within the canvas
const keepPaddleInCanvas = (paddle) => {
	if (paddle.y < 0) {
		paddle.y = 0;
	} else if (paddle.y + paddle.height > canvas.height) {
		paddle.y = canvas.height - paddle.height;
	}
};

// Game loop
const gameLoop = () => {
	clearCanvas();
	drawBall();
	drawPaddle(player1);
	drawPaddle(player2);
	drawScore();
	movePaddle(player1);
	movePaddle(player2);
	moveBall();
	keepPaddleInCanvas(player1);
	keepPaddleInCanvas(player2);
	requestAnimationFrame(gameLoop);
};

// Start the game
gameLoop();
