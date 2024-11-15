// board
let board;
let boardWidth = 750;
let boardHeight = 250;
let context;

//dog
let dogWidth = 120;
let dogHeight = 100;
let dogX = 50;
let dogY = boardHeight - dogHeight;
let dogImg;

let dog = {
    x : dogX,
    y : dogY,
    width : dogWidth,
    height : dogHeight
}

//obstacle
let obstacleArray = [];

let obstacleTreeSmallWidth = 34;
let obstacleTreeLargeWidth = 69;
let obstacleCatWidth = 102;

let obstacleHeight = 70;
let obstacleX = 700;
let obstacleY = boardHeight - obstacleHeight;

let obstacleTreeSmallImg;
let obstacleTreeLargeImg;
let obstacleCatImg;

//physics
let velocityX = -8;
let velocityY = 0;
let gravity = .4;

let gameOver = false;
let score = 0;

let walkingInterval; // Variable to store the interval for walking animation
let isWalking = false; // Track if walking animation is active


window.onload = function() {
    board = document.getElementById("board");
    board.height = boardHeight;
    board.width = boardWidth;

    context = board.getContext("2d");

    dogImg = new Image();
    dogImg.src = "./images/sashaStand500px.png";
    dogImg.onload = function() {
        context.drawImage(dogImg, dog.x, dog.y, dog.width, dog.height);
    }

    obstacleTreeSmallImg = new Image();
    obstacleTreeSmallImg.src = "./images/treestumpSmall.png";

    obstacleTreeLargeImg = new Image();
    obstacleTreeLargeImg.src = "./images/treestumpLarge.png";

    obstacleCatImg = new Image();
    obstacleCatImg.src = "./images/cat.png"

    requestAnimationFrame(update);
    setInterval(spawnObstacle, 1000);
    document.addEventListener("keydown", dogJump);
}

function update() {
    requestAnimationFrame(update);

    if (gameOver) {
        // Clear canvas and stop further updates
        context.clearRect(0, 0, board.width, board.height);

        // Draw Sasha in the crying state
        context.drawImage(dogImg, dog.x, dog.y, dog.width, dog.height);

        // Draw all obstacles in their final positions
        for (let i = 0; i < obstacleArray.length; i++) {
            let obstacle = obstacleArray[i];
            context.drawImage(obstacle.img, obstacle.x, obstacle.y, obstacle.width, obstacle.height);
        }

        // Display final score
        context.fillStyle = "black";
        context.font = "20px courier";
        context.fillText(`Final Score: ${score}`, 5, 20);

        return; // Exit update loop after rendering game-over state
    }

    context.clearRect(0, 0, board.width, board.height);

    // Apply gravity and update Sasha's position
    velocityY += gravity;
    dog.y = Math.min(dog.y + velocityY, dogY);

    // Handle walking or jumping state
    if (dog.y === dogY) {
        if (!isWalking) {
            startWalkingAnimation(); // Start walking animation if Sasha is on the ground
        }
    } else {
        stopWalkingAnimation(); // Stop walking animation while in the air
    }

    // Ensure the jump image stays during the jump
    if (dog.y < (dogY) && dogImg.src.includes("sashaStand500px.png")) {
        dogImg.src = "./images/sashaJump500px.png"; // Ensure the jump image is set during the jump
    }

    // Draw Sasha
    context.drawImage(dogImg, dog.x, dog.y, dog.width, dog.height);

    // Draw obstacles and update their positions
    for (let i = 0; i < obstacleArray.length; i++) {
        let obstacle = obstacleArray[i];
        obstacle.x += velocityX;
        context.drawImage(obstacle.img, obstacle.x, obstacle.y, obstacle.width, obstacle.height);

        // Detect collision
        if (detectCollision(dog, obstacle)) {
            gameOver = true;

            // Set Sasha to crying image
            dogImg.src = "./images/sashaCry500px.png";

            // Render crying Sasha once
            context.clearRect(0, 0, board.width, board.height);
            context.drawImage(dogImg, dog.x, dog.y, dog.width, dog.height);

            // Draw all obstacles in their final positions
            for (let j = 0; j < obstacleArray.length; j++) {
                let obst = obstacleArray[j];
                context.drawImage(obst.img, obst.x, obst.y, obst.width, obst.height);
            }

            // Display final score
            context.fillStyle = "black";
            context.font = "20px courier";
            context.fillText(`Final Score: ${score}`, 5, 20);

            return; // Stop further updates
        }
    }

    // Update score
    context.fillStyle = "black";
    context.font = "20px courier";
    score++;
    context.fillText(score, 5, 20);
}





function dogJump(e) {
    if (gameOver) return;

    // Trigger jump only if Sasha is on the ground
    if ((e.code === "Space" || e.code === "ArrowUp") && dog.y === dogY) {
        velocityY = -10; // Set jump velocity
        stopWalkingAnimation(); // Stop walking animation
        dogImg.src = "./images/sashaJump500px.png"; // Switch to jump image
    }
}


function startWalkingAnimation() {
    if (isWalking) return; // Avoid multiple intervals
    isWalking = true;

    walkingInterval = setInterval(() => {
        if (dog.y === dogY && !gameOver) { // Only switch images when Sasha is on the ground
            if (dogImg.src.includes("sashaStand500px.png")) {
                dogImg.src = "./images/sashaWalk500px.png"; // Switch to walking image
            } else {
                dogImg.src = "./images/sashaStand500px.png"; // Switch back to standing image
            }
        }
    }, 200); // Adjust interval time for walking speed
}

function stopWalkingAnimation() {
    clearInterval(walkingInterval);
    isWalking = false;
    dogImg.src = "./images/sashaStand500px.png"; // Reset to standing image
}


function spawnObstacle() {
    if (gameOver) {return;}

    let obstacle = {
        img : null,
        x : obstacleX,
        y : obstacleY,
        width : null,
        height : obstacleHeight
    }

    let obstacleSpawnRate = Math.random();
    if (obstacleSpawnRate > .90) {      //10% chance
        obstacle.img = obstacleCatImg;
        obstacle.width = obstacleCatWidth;
        obstacleArray.push(obstacle);
    }
    else if (obstacleSpawnRate > .50) {     //30% chance
        obstacle.img = obstacleTreeLargeImg;
        obstacle.width = obstacleTreeLargeWidth;
        obstacleArray.push(obstacle);
    }
    else if (obstacleSpawnRate > .30) {       //50% chance
        obstacle.img = obstacleTreeSmallImg;
        obstacle.width = obstacleTreeSmallWidth;
        obstacleArray.push(obstacle);
    }

    if (obstacleArray.length > 5) {
        obstacleArray.shift();
    }
}

function detectCollision(a, b) {
    return a.x < b.x + b.width &&
           a.x + a.width > b.x &&
           a.y < b.y + b.height &&
           a.y + a.height > b.y;
}