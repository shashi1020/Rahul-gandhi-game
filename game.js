document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');

    canvas.width = 800;
    canvas.height = 500;

    const birdImage = new Image();
    birdImage.src = 'https://www.imageshine.in/uploads/gallery/Rahul_Gandhi_Happy_Face_Png_Images_free_download.png'; // Replace with path to your bird image

    const bird = {
        x: 100,
        y: canvas.height / 2,
        width: 60, // Width of the bird image
        height: 60, // Height of the bird image
        velocity: 0,
        gravity: 0.1,
        jumpStrength: 2
    };

    // Obstacle properties
    const obstacleWidth = 50;
    const gapBetweenObstacles = 150;
    let obstacles = [];

    let gameRunning = false;

    // Start button element
    const startButton = document.getElementById('startButton');

    // Game loop
    function gameLoop() {
        if (gameRunning) {
            update();
            render();
        }
        requestAnimationFrame(gameLoop);
    }

    function update() {
        // Update bird
        bird.velocity += bird.gravity;
        bird.y += bird.velocity;

        // Update obstacles
        if (obstacles.length === 0 || obstacles[obstacles.length - 1].x < canvas.width - 300) {
            generateObstacle();
        }

        obstacles.forEach((obstacle) => {
            obstacle.x -= 2; // Move obstacles from right to left
        });

        // Remove obstacles that have moved off the screen
        obstacles = obstacles.filter((obstacle) => obstacle.x + obstacleWidth > 0);

        // Check for collisions with obstacles
        obstacles.forEach((obstacle) => {
            if (
                bird.x + bird.width > obstacle.x &&
                bird.x < obstacle.x + obstacleWidth &&
                (bird.y < obstacle.topY || bird.y + bird.height > obstacle.bottomY)
            ) {
                gameOver();
            }
        });
    }

    function render() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw bird image
        ctx.drawImage(birdImage, bird.x, bird.y, bird.width, bird.height);

        // Draw obstacles
        obstacles.forEach((obstacle) => {
            // Top obstacle
            ctx.fillRect(obstacle.x, 0, obstacleWidth, obstacle.topY);
            // Bottom obstacle
            ctx.fillRect(obstacle.x, obstacle.bottomY, obstacleWidth, canvas.height - obstacle.bottomY);
        });
    }

    function generateObstacle() {
        const topHeight = Math.random() * (canvas.height - gapBetweenObstacles - 100) + 50;
        const obstacle = {
            x: canvas.width,
            topY: topHeight,
            bottomY: topHeight + gapBetweenObstacles
        };
        obstacles.push(obstacle);
    }

    function gameOver() {
        // Stop the game
        gameRunning = false;

        // Display start button
        startButton.style.display = 'block';
    }

    function restartGame() {
        // Reset game state
        bird.y = canvas.height / 2;
        obstacles = [];
        gameRunning = true;
        startButton.style.display = 'none'; // Hide start button

        // Start the game loop
        gameLoop();
    }

    // Handle jump on spacebar press
    document.addEventListener('keydown', (e) => {
        if (gameRunning && e.code === 'Space') {
            bird.velocity = -bird.jumpStrength; // Apply jump velocity
        }
    });

    // Start game on button click
    startButton.addEventListener('click', () => {
        restartGame();
    });

    // Initial render to display start button
    render();
});
