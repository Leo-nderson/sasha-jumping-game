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
    if (gameOver) {return;}
    context.clearRect(0 , 0, board.width, board.height);

    //draw dog
    velocityY += gravity;
    dog.y = Math.min(dog.y + velocityY, dogY);      //apply gravity
    context.drawImage(dogImg, dog.x, dog.y, dog.width, dog.height);

    //draw obstacle
    for (let i = 0; i < obstacleArray.length; i++) {
        let obstacle = obstacleArray[i];
        obstacle.x += velocityX;
        context.drawImage(obstacle.img, obstacle.x, obstacle.y, obstacle.width, obstacle.height);
        if (detectCollision(dog, obstacle)){
            gameOver = true;
            dogImg.src = "./images/sashaCry500px.png";
            dogImg.onload = function() {
                context.drawImage(dogImg, dog.x, dog.y, dog.width, dog.height)
            }
        }
    }

    //score
    context.fillStyle = "black";
    context.font = "20px courier";
    score++;
    context.fillText(score, 5, 20);
}

function dogJump(e) {
    if (gameOver) {return;}

    if ((e.code == "Space" || e.code == "ArrowUp") && dog.y == dogY) {
        velocityY = -10;
        dogImg.src = "./images/sashaJump500px.png";
        dogImg.onload = function() {
            context.drawImage(dogImg, dog.x, dog.y, dog.width, dog.height)
        };
    } else {
        dogImg.src = "./images/sashaStand500px.png"
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
    if (obstacleSpawnRate > .90) {      //10% chance
        obstacle.img = obstacleCatImg;
        obstacle.width = obstacleCatWidth;
        obstacleArray.push(obstacle);
    }
    else if (obstacleSpawnRate > .70) {     //30% chance
        obstacle.img = obstacleTreeLargeImg;
        obstacle.width = obstacleTreeLargeWidth;
        obstacleArray.push(obstacle);
    }
    else if (obstacleSpawnRate > .50) {       //50% chance
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