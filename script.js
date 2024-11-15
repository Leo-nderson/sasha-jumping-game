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