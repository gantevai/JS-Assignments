import Bird from '../js/Bird.js';
import Pipe from './Pipe.js';

class Game {
  constructor(fps) {
    this.init(fps);
    this.createField();
    this.createBird();
    this.play = setInterval(
      function() {
        this.moveBackground();
        this.moveGround();
        this.bird.dropBird(this.gravity);
        this.checkCollisions();
        this.bird.animateBirdFly();
        this.gravity += 0.25;
        this.pipeMovementCounter++;
        if (this.pipeMovementCounter == 120) {
          this.createPipes();
          this.pipeMovementCounter = 0;
        }
        this.movePipes();
      }.bind(this),
      this.frameLimit
    );
    this.checkKeyPress();
  }

  init(fps) {
    this.frameLimit = 1000 / fps;
    this.gameContainerWidth = 600;
    this.gameContainerHeight = 650;
    this.backgroundSpeed = 1;
    this.groundSpeed = 5;
    this.gravity = 0.25;
    this.jumpPower = 75;
    this.pipeArray = [];
    this.pipeMovementCounter = 0; // counter to manage the interval between pipes
  }

  createField() {
    this.body = document.getElementsByTagName('body')[0];
    this.gameContainer = document.createElement('div');
    this.gameContainer.classList.add('game-container');
    this.gameContainer.style.width = this.gameContainerWidth + 'px';
    this.gameContainer.style.height = this.gameContainerHeight + 'px';
    this.body.appendChild(this.gameContainer);
    this.createBackgroundAndGround();
  }

  createBird() {
    this.bird = new Bird(this.gameContainer);
  }

  createBackgroundAndGround() {
    this.backgroundWrapper = document.createElement('div');
    this.backgroundWrapper.classList.add('background-wrapper');
    this.groundWrapper = document.createElement('div');
    this.groundWrapper.classList.add('ground-wrapper');
    this.gameContainer.appendChild(this.backgroundWrapper);
    this.gameContainer.appendChild(this.groundWrapper);
    this.backgroundLeft = 0;
    this.groundLeft = 0;
  }

  moveBackground() {
    this.backgroundLeft -= this.backgroundSpeed;
    if (this.backgroundLeft <= -this.gameContainerWidth) {
      this.backgroundLeft = 0;
    }
    this.backgroundWrapper.style.left = this.backgroundLeft + 'px';
  }

  moveGround() {
    this.groundLeft -= this.groundSpeed;
    if (this.groundLeft <= -this.gameContainerWidth) {
      this.groundLeft = 0;
    }
    this.groundWrapper.style.left = this.groundLeft + 'px';
  }

  checkKeyPress() {
    document.onkeydown = event => {
      if (event.code == 'Space') {
        this.gravity = 0.25;
        this.bird.flyBird(this.jumpPower);
      }
    };
  }

  createPipes() {
    this.pipe = new Pipe(this.gameContainer);
    this.pipeArray.push(this.pipe);
  }

  movePipes() {
    for (var i = 0; i < this.pipeArray.length; i++) {
      this.pipeArray[i].move();
    }
  }

  checkCollisions() {
    //Check if bird is dead by collision
    if (this.bird.isDead) {
      this.gameOver();
    }
    //Check if first pipe is out of screen

    if (this.pipeArray.length != 0) {
      this.pipeArray[0].checkPipeOutOfScreen();
      if (this.pipeArray[0].isDestroyed) {
        this.pipeArray.shift();
      }
    }
  }

//   checkBirdPipeCollision(pipe) {
//     if (this.bird.b)
//       if (
//         this.bird.birdPositionX < rect2.x + rect2.width &&
//         this.bird.birdPositionX + this.bird.birdPositionX.width > rect2.x &&
//         this.bird.birdPositionY < rect2.y + rect2.height &&
//         this.bird.birdPositionY + this.bird.birdPositionX.height > rect2.y
//       ) {
//         // collision detected!
//       }
  }

  gameOver() {
    clearInterval(this.play);
  }
}

export default Game;
