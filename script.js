let board;
let boardWidth = 750;
let boardHeight = 250;
let context;


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

let velocityX = -8;
let velocityY = 0;
let gravity = .4;

let gameOver = false;
let gameStarted = false;
let score = 0;

let walkingInterval;
let isWalking = false;

const buttonWidth = 150;
const buttonHeight = 50;
const buttonX = (boardWidth - buttonWidth) / 2;
const buttonY = (boardHeight - buttonHeight) / 2;

function drawButton(text) {
    context.fillStyle = "#647EC4";
    context.fillRect(buttonX, buttonY, buttonWidth, buttonHeight);

    context.fillStyle = "white";
    context.font = "20px Arial";
    context.fillText(text, buttonX + 30, buttonY + 30);
}


window.onload = function() {
    board = document.getElementById("board");
    board.height = boardHeight;
    board.width = boardWidth;

    context = board.getContext("2d");

    dogImg = new Image();
    dogImg.src = "./images/sashastand500px.png";
    dogImg.onload = function() {
        context.drawImage(dogImg, dog.x, dog.y, dog.width, dog.height);
    }

    board.addEventListener("click", (event) => {
        const rect = board.getBoundingClientRect();
        const mouseX = event.clientX - rect.left;
        const mouseY = event.clientY - rect.top;
    
        if (
            mouseX >= buttonX &&
            mouseX <= buttonX + buttonWidth &&
            mouseY >= buttonY &&
            mouseY <= buttonY + buttonHeight
        ) {
            if (!gameStarted || gameOver) {
                startGame();
            }
        }
    });

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
    if (!gameStarted) {
        context.clearRect(0, 0, board.width, board.height);
        drawButton("Start");
        return;
    }

    if (gameOver) {
        context.clearRect(dog.x, dog.y, dog.width, dog.height);

        for (let i = 0; i < obstacleArray.length; i++) {
            const obstacle = obstacleArray[i];
            context.clearRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
}
        context.drawImage(dogImg, dog.x, dog.y, dog.width, dog.height);

        for (let i = 0; i < obstacleArray.length; i++) {
            const obstacle = obstacleArray[i];
            context.drawImage(obstacle.img, obstacle.x, obstacle.y, obstacle.width, obstacle.height);
        }

        context.fillStyle = "black";
        context.font = "20px courier";
        context.fillText(`Final Score: ${score}`, 5, 20);

        drawButton("Restart");
        return;
    }

    requestAnimationFrame(update);
    context.clearRect(0, 0, board.width, board.height);

    velocityY += gravity;
    dog.y = Math.min(dog.y + velocityY, dogY);

    if (dog.y === dogY) {
        if (!isWalking) {
            startWalkingAnimation();
        }
    } else {
        stopWalkingAnimation();
    }

    context.drawImage(dogImg, dog.x, dog.y, dog.width, dog.height);

    for (let i = 0; i < obstacleArray.length; i++) {
        const obstacle = obstacleArray[i];
        obstacle.x += velocityX;
        context.drawImage(obstacle.img, obstacle.x, obstacle.y, obstacle.width, obstacle.height);

        if (detectCollision(dog, obstacle)) {
            gameOver = true;
            dogImg.src = "./images/sashacry500px.png";
            return;
        }
    }

    context.fillStyle = "black";
    context.font = "20px courier";
    score++;
    context.fillText(score, 5, 20);
}



function startGame() {
    gameStarted = true;
    gameOver = false;

    score = 0;
    velocityY = 0;
    dog.y = dogY;
    dogImg.src = "./images/sashastand500px.png";
    obstacleArray = [];

    requestAnimationFrame(update);
}


function dogJump(e) {
    if (gameOver) return;

    if ((e.code === "Space" || e.code === "ArrowUp") && dog.y === dogY) {
        velocityY = -10;
        stopWalkingAnimation();
        dogImg.src = "./images/sashaJump500px.png";
    }
}


function startWalkingAnimation() {
    if (isWalking) return;
    isWalking = true;

    walkingInterval = setInterval(() => {
        if (dog.y === dogY && !gameOver) {
            if (dogImg.src.includes("sashastand500px.png")) {
                dogImg.src = "./images/sashaWalk500px.png";
            } else {
                dogImg.src = "./images/sashastand500px.png";
            }
        }
    }, 200);
}

function stopWalkingAnimation() {
    clearInterval(walkingInterval);
    isWalking = false;
    if (dog.y === dogY && !dogImg.src.includes("sashaJump500px.png")) {
        dogImg.src = "./images/sashastand500px.png";
    }
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
    if (obstacleSpawnRate > .90) {
        obstacle.img = obstacleCatImg;
        obstacle.width = obstacleCatWidth;
        obstacleArray.push(obstacle);
    }
    else if (obstacleSpawnRate > .50) {
        obstacle.img = obstacleTreeLargeImg;
        obstacle.width = obstacleTreeLargeWidth;
        obstacleArray.push(obstacle);
    }
    else if (obstacleSpawnRate > .30) {
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