var canvas;
var backgroundImage, car1_img, car2_img, track;
var fuelImage, powerCoinImage;
var database, gameState;
var form, player, playerCount;
var allPlayers, car1, car2, fuels, powerCoins;
var cars = [];
var fuels,coins,obstacles,obstacle1Img,obstacle2Img
var heartImg

function preload() {
  backgroundImage = loadImage("./assets/background.png");
  car1_img = loadAnimation("../assets/car1.png");
  car2_img = loadAnimation("../assets/car2.png");
  track = loadImage("../assets/track.jpg");
  fuelImage = loadImage("./assets/fuel.png");
  powerCoinImage = loadImage("./assets/goldCoin.png");
  obstacle1Img = loadImage("./assets/obstacle1.png")
  obstacle2Img = loadImage("./assets/obstacle2.png")
  heartImg = loadImage("assets/heart.png")
  blast = loadAnimation("assets/B1.png","assets/B2.png","assets/B3.png","assets/B4.png","assets/B5.png","assets/B6.png")
  blast.looping=false
}

function setup() {
  canvas = createCanvas(windowWidth, windowHeight);
  database = firebase.database();
  game = new Game();
  game.getState();
  game.start();
}

function draw() {
  background(backgroundImage);
  if (playerCount === 2) {
    game.update(1);
  }

  if (gameState === 1) {
    game.play();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
