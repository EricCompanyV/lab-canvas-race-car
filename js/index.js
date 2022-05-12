const canvas = document.getElementById("canvas");
const gameIntro = document.querySelector(".game-intro");
const ctx = canvas.getContext("2d");
const canvasHeight = canvas.height;
const canvasWidth = canvas.width;

const roadImage = new Image();
roadImage.src = "../images/road.png";

const carImage = new Image();
carImage.src = "../images/car.png";
const carWidth = 40;
const carHeight = 70;
let carX = canvasWidth / 2 - carWidth / 2;
let carY = 10;
let carSpeedValue = 2;
const leftLaneX = 64;
const rightLaneX = 405;
let isCarGoingLeft = false;
let isCarGoingRight = false;
const maxWidth = rightLaneX - leftLaneX;
const defaultObstacleWidth = 200;
let animationFrameId;
const obstacleHeight = 20;
const obstacleSpeed = 3;
let obstacleArray = [];
let score = 0;

let gameOver = false;
class Obstacle {
  constructor(random) {
    this.obstacleWidth = (defaultObstacleWidth * random) / 3;
    this.xPosition = leftLaneX + (random * leftLaneX) / 5;
    this.yPosition = 0;
    //64+(Math.floor(Math.random() * ((rightLaneX-this.obstacleWidth) - leftLaneX + 1) + leftLaneX))
  }
  advanceY() {}
}

function drawCar() {
  ctx.beginPath();
  ctx.drawImage(
    carImage,
    carX,
    canvasHeight - carHeight - carY,
    carWidth,
    carHeight
  );
  if (isCarGoingLeft) {
    if (carX - carWidth / 2 > leftLaneX) {
      carX -= carSpeedValue;
    }
  }
  if (isCarGoingRight) {
    if (carX + carWidth / 2 < rightLaneX) {
      carX += carSpeedValue;
    }
  }
  ctx.closePath();
}

function renderObstacles() {
  obstacleArray.forEach((element) => {
    ctx.beginPath();
    ctx.fillStyle = "red";
    ctx.fillRect(
      element.xPosition,
      element.yPosition,
      element.obstacleWidth,
      obstacleHeight
    );
    ctx.closePath();
  });
}

function createNewObstacles() {
  for (let i = 0; i < 3; ++i) {
    let random = Math.floor(Math.random() * 3) + 1;
    obstacleArray.push(new Obstacle(random));
  }
  let spawnPosition = 0;
  for (let i = 0; i < obstacleArray.length; ++i) {
    obstacleArray[i].yPosition = spawnPosition;
    spawnPosition += 233;
  }
  renderObstacles();
}

function updateObstacles() {
  let index = 0;
  obstacleArray.forEach((element) => {
    if (
      element.yPosition >= canvasHeight - carY - carHeight &&
      carX > element.xPosition &&
      carX < element.xPosition + element.obstacleWidth
    ) {
      gameOver =true
    } else if (element.yPosition > canvasHeight - obstacleHeight) {
      element.yPosition = 0;
      score += 1;
    } else {
      element.yPosition += obstacleSpeed;
    }

    index += 1;
  });
  renderObstacles();
}

function drawObstacle() {
  if (obstacleArray.length === 0) {
    createNewObstacles();
  } else {
    updateObstacles();
  }
}
function drawScore() {
  ctx.beginPath();
  ctx.font = "30px sans-serif";
  ctx.fillStyle = "white";
  ctx.fillText(`Score : ${score}`, canvasWidth / 2 - 40, 30);
  ctx.closePath();
}

function gameOverScreen() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.beginPath();
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height)
  ctx.font = "30px sans-serif"
  ctx.fillStyle = "white";
  ctx.fillText("GAME OVER", canvasWidth / 2 - 150, canvasHeight/4 - 10);
  ctx.fillText(`Score : ${score}`, canvasWidth / 2 -150, canvasHeight/4 +50);
}

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.beginPath();
  ctx.drawImage(roadImage, 0, 0, canvas.width, canvas.height);
  ctx.closePath();
  drawCar();
  drawScore();
  drawObstacle();

  if (gameOver) {
    cancelAnimationFrame(animationFrameId);
    gameOverScreen()
  } else {
    animationFrameId = requestAnimationFrame(animate);
  }
}

function startGame() {
  canvas.style.display = "block";
  animate();
}

window.onload = () => {
  document.getElementById("start-button").onclick = () => {
    startGame();
  };
  document.addEventListener("keydown", (event) => {
    if (event.code === "ArrowLeft") {
      isCarGoingLeft = true;
    }
    if (event.code === "ArrowRight") {
      isCarGoingRight = true;
    }
  });
  document.addEventListener("keyup", (event) => {
    isCarGoingLeft = false;
    isCarGoingRight = false;
  });
};
