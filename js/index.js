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
const obstacleSpeed = 3
let obstacleArray = [];

class Obstacle {
  constructor(random) {
    this.obstacleWidth = (defaultObstacleWidth * random) / 3;
    this.xPosition = leftLaneX + (random * leftLaneX) / 5;
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
      console.log(carX);
    }
  }
  if (isCarGoingRight) {
    if (carX + carWidth / 2 < rightLaneX) {
      carX += carSpeedValue;
      console.log(carX);
    }
  }
  ctx.closePath();
}

function renderObstacles() {
  obstacleArray.forEach(element => {
    console.log(element);
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

function createSingleObstacle(){
  let random = Math.floor(Math.random() * 3) + 1;
  return new Obstacle(random)
}
function createNewObstacles() {
  for (let i = 0; i < 3; ++i) {
    obstacleArray.push(createSingleObstacle());
  }
  let spawnPosition = 0;
  for (let i = 0; i < obstacleArray.length; ++i) {
    obstacleArray[i].yPosition = spawnPosition;
    spawnPosition += 233;
  }
  renderObstacles();
}

function updateObstacles() {
  let index = 0
  obstacleArray.forEach(element => {
    if(element.yPosition === (canvasHeight-2)){
      obstacleArray.shift()
      obstacleArray.push(createSingleObstacle())
    }
    element.yPosition += obstacleSpeed
    index += 1
  })
  renderObstacles();
  console.log(obstacleArray)
}

function drawObstacle() {
  if (obstacleArray.length === 0) {
    createNewObstacles();
  } else {
    updateObstacles();
    console.log("obsta")
  }
}

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.beginPath();
  ctx.drawImage(roadImage, 0, 0, canvas.width, canvas.height);
  ctx.closePath();
  drawCar();
  drawObstacle();
  //if (isCarGoingLeft || isCarGoingRight) {
  requestAnimationFrame(animate);
  //}
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
