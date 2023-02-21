class Game {
  constructor() {
    this.resetTitle = createElement("h2");
    this.resetButton = createButton("");

    this.leadeboardTitle = createElement("h2");

    this.leader1 = createElement("h2");
    this.leader2 = createElement("h2");
    this.playerMoving=false
    this.leftKeyActive=false
    this.blast=false
  }

  getState() {
    var gameStateRef = database.ref("gameState");
    gameStateRef.on("value", function(data) {
      gameState = data.val();
    });
  }
  update(state) {
    database.ref("/").update({
      gameState: state
    });
  }

  start() {
    player = new Player();
    playerCount = player.getCount();

    form = new Form();
    form.display();

    car1 = createSprite(width / 2 - 50, height - 100);
    car1.addAnimation("car1", car1_img);
    car1.addAnimation("blast", blast)
    car1.scale = 0.07;

    car2 = createSprite(width / 2 + 100, height - 100);
    car2.addAnimation("car2", car2_img);
    car2.addAnimation("blast", blast)
    car2.scale = 0.07;

    cars = [car1, car2];
    //creating the groups for fuel tanks, coins, and obstacles

    fuels = new Group ()
    coins = new Group ()
    obstacles = new Group ()
    
    var obstaclesPositions=[
      {x:width/2+250, y:height-750,  image:obstacle2Img},
      {x:width/2-150, y:height-1100, image:obstacle1Img},
      {x:width/2+250, y:height-1360, image:obstacle1Img},
      {x:width/2-180, y:height-1520, image:obstacle2Img},
      {x:width/2,     y:height-1880, image:obstacle1Img},
      {x:width/2-180, y:height-2040, image:obstacle2Img},
      {x:width/2+180, y:height-2300, image:obstacle1Img},
      {x:width/2+250, y:height-2560, image:obstacle2Img},
      {x:width/2-150, y:height-2820, image:obstacle2Img},
      {x:width/2+250, y:height-3080, image:obstacle1Img},
      {x:width/2,     y:height-3340, image:obstacle2Img},
      {x:width/2-180, y:height-3600, image:obstacle1Img},
    ]


    //creating the fuel tanks
   this.addSprites(fuels,4,fuelImage,0.02)

    // creating coins
   this.addSprites(coins,20,powerCoinImage,0.08)


   //creating obstacles
   this.addSprites(obstacles,12 , obstacle1Img, 0.05, obstaclesPositions)
  }

  addSprites(spriteGroup,numberOfSprites,spriteImage,scale,positions=[]){
    for(var c=0; c<numberOfSprites; c++ ) {
     var x,y
     if(positions.length>0){
      x=positions[c].x
      y=positions[c].y
      spriteImage=positions[c].image
     }
     else{
      x=random(width/2-150,width/2+150)
      y=random(height-400,-height*4)
     }
     
     var sprite=createSprite(x,y)
     sprite.addImage(spriteImage)
     spriteGroup.add(sprite)
     sprite.scale=scale
    }
  }

  handleElements() {
    form.hide();
    form.titleImg.position(40, 50);
    form.titleImg.class("gameTitleAfterEffect");

    //C39
    this.resetTitle.html("Reset Game");
    this.resetTitle.class("resetText");
    this.resetTitle.position(width / 2 + 200, 40);

    this.resetButton.class("resetButton");
    this.resetButton.position(width / 2 + 230, 100);

    this.leadeboardTitle.html("Leaderboard");
    this.leadeboardTitle.class("resetText");
    this.leadeboardTitle.position(width / 3 - 60, 40);

    this.leader1.class("leadersText");
    this.leader1.position(width / 3 - 50, 80);

    this.leader2.class("leadersText");
    this.leader2.position(width / 3 - 50, 130);
  }

  handleFuel(index){
   //adding fuel
   cars[index-1].overlap(fuels, function(collector, collected){
    player.fuel=185
    //collected is that particular in the group collectibles(in this case fuels group), that triggered the touchhin event
    collected.remove()
   })
   //reducing Fuel
   if(player.fuel>0 && this.playerMoving){
    player.fuel=player.fuel-1
   }

   if(player.fuel<=0){
    gameState=2
    this.gameOver()
   }
  }

  handlePowerCoins(index){
   cars[index-1].overlap(coins, function(collector, collected){
    player.score=player.score+10
    player.update()
    collected.remove()
   })
  }

  handleObstacleCollision(index){
   if(cars[index-1].collide(obstacles)){
    if(this.leftKeyActive){
      player.positionX=player.positionX+100
    }
    else{
      player.positionX=player.positionX-100
    }
    if(player.life>0){
      player.life=player.life-(185/4)
    }
    player.update()
   }
  }

  handlecarsCollision(index){
   if(index==1){
    if(cars[index-1].collide(cars[1])){
      if(this.leftKeyActive){
        player.positionX=player.positionX+100
      }
      else{
        player.positionX=player.positionX-100
      }
      if(player.life>0){
        player.life=player.life-(185/4)
      }
      player.update()
    }
   }

   if(index==2){
    if(cars[index-1].collide(cars[0])){
      if(this.leftKeyActive){
        player.positionX=player.positionX+100
      }
      else{
        player.positionX=player.positionX-100
      }
      if(player.life>0){
        player.life=player.life-(185/4)
      }
      player.update()
    }
   }
  }

  gameOver(){
    swal({
      title:"Game Over!!",
      text:"Oops you ran out of fuel",
      imageUrl: "https://di-uploads-pod16.dealerinspire.com/vikingmotors/uploads/2020/12/empty-gas-tank.jpg",
      imageSize: "200x200",
      confirmButtonText: "Thanks For PLaying"
    })
  }

  showRank () {
    swal ({
      title:`Awesome!!!${"\n"}Rank${"\n"}${player.rank}`,
      text: "You Reached The Finish line Successfully",
      imageUrl: "https://www.kindpng.com/picc/m/547-5470027_cartoon-plaid-fabric-trophy-elements-formula-1-racing.png",
      imageSize: "200x200",
      confirmButtonText: "ok"
    })
  }

    showLife() {
      push ()
      image(heartImg,width/2-600,height-player.positionY-100,20,20)
      fill("white")
      rect (width/2-570,height-player.positionY-100,185,20)
      fill("red")
      rect (width/2-570,height-player.positionY-100,player.life,20)
      pop ()
    }

    showFuel() {
     push()
     image(fuelImage,width/2-600,height-player.positionY-50,20,20)
     fill("white")
     rect(width/2-570,height-Player.positionY-50,185,20)
     fill("yellow")
     rect(width/2-570,height-player.positionY-50,player.fuel,20)
    }


  play() {
    this.handleElements();
    this.handleResetButton();

    Player.getPlayersInfo();
    player.getCarsAtEnd();

    if (allPlayers !== undefined) {
      image(track, 0, -height * 5, width, height * 6)
      
      this.showLife();
      this.showFuel();
      this.showLeaderboard();

      //index of the array
      var index = 0;
      for (var plr in allPlayers) {
        //add 1 to the index for every loop
        index = index + 1;

        //use data form the database to display the cars in x and y direction
        var x = allPlayers[plr].positionX;
        var y = height - allPlayers[plr].positionY;
        var currentLife = allPlayers[plr].life

        if(currentLife<=0){
          cars[index-1].changeAnimation("blast")
          cars[index-1].scale=2
        }

        cars[index - 1].position.x = x;
        cars[index - 1].position.y = y;

        if (index === player.index) {
          if(currentLife>0){
            stroke(10);
            fill("black");
            ellipse(x, y, 60, 60);
          }
          


          this.handleFuel(index)

          this.handlePowerCoins(index)

          this.handleObstacleCollision(index)
          this.handlecarsCollision(index)

          if(player.life<=0){
            this.blast=true
            this.playerMoving=false
          }

          // Changing camera position in y direction
          camera.position.y = cars[index - 1].position.y;
        }
      }

      // handling keyboard events
      this.handlePlayerControls();
      
      const finishLine= height * 6-100

      if(player.positionY>finishLine){
        gameState=2
        player.rank=player.rank+1
        Player.updateCarsAtEnd(player.rank)
        player.update()
        this.showRank()

      }
      drawSprites();
    }
  }

  handleResetButton() {
    this.resetButton.mousePressed(() => {
      database.ref("/").set({
        carsAtEnd:0,
        playerCount: 0,
        gameState: 0,
        players: {}
      });
      window.location.reload();
    });
  }

  showLeaderboard() {
    var leader1, leader2;
    var players = Object.values(allPlayers);
    if (
      (players[0].rank === 0 && players[1].rank === 0) ||
      players[0].rank === 1
    ) {
      // &emsp;    This tag is used for displaying four spaces.
      leader1 =
        players[0].rank +
        "&emsp;" +
        players[0].name +
        "&emsp;" +
        players[0].score;

      leader2 =
        players[1].rank +
        "&emsp;" +
        players[1].name +
        "&emsp;" +
        players[1].score;
    }

    if (players[1].rank === 1) {
      leader1 =
        players[1].rank +
        "&emsp;" +
        players[1].name +
        "&emsp;" +
        players[1].score;

      leader2 =
        players[0].rank +
        "&emsp;" +
        players[0].name +
        "&emsp;" +
        players[0].score;
    }

    this.leader1.html(leader1);
    this.leader2.html(leader2);
  }

  handlePlayerControls() {
    if(!this.blast){
    if (keyIsDown(UP_ARROW)) {
      this.playerMoving=true
      player.positionY += 10;
      player.update();
    }

    if (keyIsDown(LEFT_ARROW) && player.positionX > width / 3 - 45) {
      this.leftKeyActive=true
      player.positionX -= 5;
      player.update();
    }

    if (keyIsDown(RIGHT_ARROW) && player.positionX < width / 2 + 220) {
      this.leftKeyActive=false
      player.positionX += 5;
      player.update();
    }
  }
  }
}
