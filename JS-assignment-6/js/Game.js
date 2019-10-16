import Bird from '../js/Bird.js';
import Pipe from './Pipe.js';

class Game {
  constructor(fps) {
    this.init(fps);
    this.createField();
    this.createBird();
    this.moveBackgroundImage = setInterval(
      function() {
        this.moveBackground();
        this.moveGround();
        this.bird.dropBird(this.gravity);
        this.bird.animateBirdFly();
        this.gravity += 0.25;
        this.createPipes();
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
    this.jumpPower = 70;
    this.pipeArray = [];
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
}

export default Game;
