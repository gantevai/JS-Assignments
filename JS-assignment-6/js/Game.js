import Bird from '../js/Bird.js';
import Pipe from './Pipe.js';

const FLAP_AUDIO = new Audio();
FLAP_AUDIO.src = 'audio/flapwing.mp3';

const SCORE_AUDIO = new Audio();
SCORE_AUDIO.src = 'audio/score.mp3';

const GAMEOVER_AUDIO = new Audio();
GAMEOVER_AUDIO.src = 'audio/gameover.mp3';

class Game {
  skyHeight = 512;
  constructor(fps) {
    this.fps = fps;
    this.init();
    this.createField();
    this.createScoreDisplay();
    this.createBird();
    this.startMenu();
  }

  startMenu() {
    this.startDisplay = document.createElement('div');
    this.startDisplay.classList.add('start-menu');
    this.gameContainer.appendChild(this.startDisplay);
    this.handleMovement();
  }

  handleMovement(restart) {
    document.onkeydown = event => {
      if (event.code == 'Space') {
        if (restart) {
          clearInterval(this.deadBirdFall);
          this.gameContainer.innerHTML = '';
          this.init();
          this.createScoreDisplay();
          this.createBird();
        } else {
          this.startDisplay.style.display = 'none';
          document.onkeydown = null;
        }

        setTimeout(
          function() {
            this.bird.birdFaceDown();
          }.bind(this),
          200
        );
        this.play = setInterval(this.startGame.bind(this), this.frameLimit);
      }
    };
    this.gameContainer.onmousedown = event => {
      if (restart) {
        clearInterval(this.deadBirdFall);
        this.gameContainer.innerHTML = '';
        this.init();
        this.createScoreDisplay();
        this.createBird();
      } else {
        this.startDisplay.style.display = 'none';
        document.onkeydown = null;
      }

      setTimeout(
        function() {
          this.bird.birdFaceDown();
        }.bind(this),
        200
      );
      this.play = setInterval(this.startGame.bind(this), this.frameLimit);
    };
  }

  startGame() {
    this.checkKeyPress();
    this.moveBackground();
    this.bird.dropBird(this.gravity);
    this.checkCollisions();
    if (this.animateBirdCounter % 5 == 0) {
      this.bird.animateBirdFly();
    }
    this.animateBirdCounter++;
    this.gravity += 0.25;
    this.pipeMovementCounter++;
    if (this.pipeMovementCounter == 120) {
      this.createPipes();
      this.pipeMovementCounter = 0;
    }
    this.movePipes();
    this.updateScore();
  }

  init() {
    this.frameLimit = 1000 / this.fps;
    this.gameContainerWidth = 600;
    this.gameContainerHeight = 650;
    this.backgroundSpeed = 0.25;
    this.groundSpeed = 2;
    this.gravity = 0.25;
    this.flyGravityValue = -3;
    this.jumpPower = 75;
    this.pipeArray = [];
    this.score = 0;
    this.pipeMovementCounter = 0; // counter to manage the interval between pipes
    this.animateBirdCounter = 0; // counter to manage animation of bird
  }

  createField() {
    this.body = document.getElementsByTagName('body')[0];
    this.gameContainer = document.createElement('div');
    this.gameContainer.classList.add('game-container');
    this.gameContainer.style.width = this.gameContainerWidth + 'px';
    this.gameContainer.style.height = this.gameContainerHeight + 'px';
    this.body.appendChild(this.gameContainer);
  }

  createScoreDisplay() {
    this.scoreDisplay = document.createElement('div');
    this.scoreDisplay.classList.add('score-display');
    this.gameContainer.appendChild(this.scoreDisplay);
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

    this.groundLeft -= this.groundSpeed;
    if (this.groundLeft <= -this.gameContainerWidth) {
      this.groundLeft = 0;
    }
    this.groundWrapper.style.left = this.groundLeft + 'px';
  }

  checkKeyPress() {
    document.onkeydown = event => {
      if (event.code == 'Space') {
        this.gravity = this.flyGravityValue;
        FLAP_AUDIO.play();
        this.bird.flyBird(this.jumpPower);
      }
    };
    this.gameContainer.onmousedown = event => {
      this.gravity = this.flyGravityValue;
      FLAP_AUDIO.play();
      this.bird.flyBird(this.jumpPower);
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

    for (var i = 0; i < this.pipeArray.length; i++) {
      if (this.checkBirdPipeCollision(this.pipeArray[i])) {
        this.bird.isDead = true;
        this.gameOver();
      }
    }
  }

  checkBirdPipeCollision(pipe) {
    if (
      this.bird.birdPositionX < pipe.pipeLeftValue + pipe.pipeWidth &&
      this.bird.birdPositionX + this.bird.birdWidth > pipe.pipeLeftValue &&
      this.bird.birdPositionY < 0 + pipe.pipeTopHeight &&
      this.bird.birdPositionY + this.bird.birdHeight > 0
    ) {
      // collision detected!
      return true;
    }

    if (
      this.bird.birdPositionX < pipe.pipeLeftValue + pipe.pipeWidth &&
      this.bird.birdPositionX + this.bird.birdWidth > pipe.pipeLeftValue &&
      this.bird.birdPositionY < pipe.pipeBottomPositionY + pipe.pipeBottomHeight &&
      this.bird.birdPositionY + this.bird.birdHeight > pipe.pipeBottomPositionY
    ) {
      // collision detected!
      return true;
    }
  }

  updateScore() {
    this.scoreDisplay.innerText = this.score;
    this.checkPipePassedByPlayer();
    for (var i = 0; i < this.pipeArray.length; i++) {
      if (!this.pipeArray[i].isScored) {
        if (this.pipeArray[i].passedByPlayer) {
          this.score++;
          SCORE_AUDIO.play();
          this.pipeArray[i].isScored = true;
          // console.log(this.score);
        }
      }
    }
  }

  checkPipePassedByPlayer() {
    for (var i = 0; i < this.pipeArray.length; i++) {
      if (!this.pipeArray[i].passedByPlayer) {
        if (
          this.pipeArray[i].pipeLeftValue + this.pipeArray[i].pipeWidth <
          this.bird.birdPositionX
        ) {
          this.pipeArray[i].passedByPlayer = true;
        }
      }
    }
  }

  gameOver() {
    GAMEOVER_AUDIO.play();
    clearInterval(this.play);
    document.onkeydown = null;
    this.gameOverMenu();
    this.deadBirdFall = setInterval(
      function() {
        this.bird.deadFall(this.gravity);
        this.gravity += 0.5;
        if (this.bird.birdPositionY + this.bird.birdHeight > this.skyHeight) {
          clearInterval(this.deadBirdFall);
        }
      }.bind(this),
      this.frameLimit
    );
  }

  gameOverMenu() {
    this.scoreDisplay.style.display = 'none';
    this.gameOverDisplay = document.createElement('div');
    this.gameOverDisplay.classList.add('game-over');
    this.gameContainer.appendChild(this.gameOverDisplay);
    this.highscoreDisplay = document.createElement('div');
    this.highscoreDisplay.classList.add('high-score');
    this.endScoreDisplay = document.createElement('div');
    this.endScoreDisplay.classList.add('end-score');
    this.gameOverDisplay.appendChild(this.endScoreDisplay);
    this.gameOverDisplay.appendChild(this.highscoreDisplay);
    this.endScoreDisplay.innerText = this.score;
    this.setHighScore();

    this.handleMovement(true);
  }

  setHighScore() {
    if (!localStorage.getItem('highscore')) {
      localStorage.setItem('highscore', this.score);
    } else {
      var highscore = parseInt(localStorage.getItem('highscore'));
      if (this.score > highscore) {
        localStorage.setItem('highscore', this.score);
      }
    }
    this.highscoreDisplay.innerText = `${localStorage.getItem('highscore')}`;
  }
}

export default Game;
