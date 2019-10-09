const SPEED = [-1, 1];
const GAME_WIDTH = 640;
const GAME_HEIGHT = 600;
const GAME_ANIMATION_FRAME = 20;
const ANT_WIDTH = 28;
const ANT_HEIGHT = 35;
const SMASH_AUDIO = new Audio();
SMASH_AUDIO.src = 'js/smash.mp3';
const GAME_COMPLETE = new Audio();
GAME_COMPLETE.src = 'js/game-complete.mp3';

function getRandomValue(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
}

class Ant {
  constructor(gameContext) {
    this.parentElement = gameContext.parentElement;
    this.create();
    this.directionX = SPEED[getRandomValue(0, SPEED.length)];
    this.directionY = SPEED[getRandomValue(0, SPEED.length)];
    this.isSmashed = false;
    this.turnAround();
    this.element.onclick = () => {
      if (!this.isSmashed) {
        this.element.classList.add('dead');
        this.isSmashed = true;
        SMASH_AUDIO.play();
        gameContext.score++;
        gameContext.scoreBox.innerHTML = gameContext.score;
        setTimeout(() => {
          this.parentElement.removeChild(this.element);
        }, 1000);
      }
    };
  }

  create() {
    this.element = document.createElement('div');
    this.element.classList.add('ants');
    this.parentElement.appendChild(this.element);
  }

  setPosition(positionX, positionY) {
    this.antPositionX = positionX;
    this.antPositionY = positionY;
  }

  move() {
    this.turnAround();
    this.antPositionX += this.directionX;
    this.antPositionY += this.directionY;
    this.draw();
    this.checkCollision();
  }

  draw() {
    this.element.style.left = this.antPositionX + 'px';
    this.element.style.top = this.antPositionY + 'px';
  }

  checkCollision() {
    //right and left wall collision
    if (this.antPositionX + ANT_WIDTH >= GAME_WIDTH || this.antPositionX <= 0) {
      this.directionX = -this.directionX;
    }

    // top and bottom wall collision
    if (this.antPositionY + ANT_HEIGHT >= GAME_HEIGHT || this.antPositionY <= 0) {
      this.directionY = -this.directionY;
    }
  }

  turnAround() {
    if (this.directionX < 0 && this.directionY < 0) {
      this.element.style.transform = 'rotate(315deg)';
    } else if (this.directionX < 0 && this.directionY > 0) {
      this.element.style.transform = 'rotate(225deg)';
    } else if (this.directionX > 0 && this.directionY > 0) {
      this.element.style.transform = 'rotate(135deg)';
    } else if (this.directionX > 0 && this.directionY < 0) {
      this.element.style.transform = 'rotate(45deg)';
    }
  }
}

class Game {
  score = 0;
  difficultyChanged = false;
  antArray = [];
  xyArray = [];

  constructor(gameWrapperId, antCount) {
    this.parentElement = document.getElementById(gameWrapperId);
    this.scoreBox = this.parentElement.getElementsByClassName('score')[0];
    this.parentElement.style.width = GAME_WIDTH + 'px';
    this.parentElement.style.height = GAME_HEIGHT + 'px';
    this.scoreBox.innerHTML = this.score;
    this.antCount = antCount;
    this.init();
  }

  init() {
    this.createAnts();
    setInterval(this.moveAnts.bind(this), GAME_ANIMATION_FRAME);
  }

  createAnts() {
    for (var i = 0; i < this.antCount; i++) {
      this.ant = new Ant(this);
      this.createNewPositionAndCheckOverlaps();
      this.ant.setPosition(this.xyArray[i].x, this.xyArray[i].y);
      this.ant.draw();
      this.antArray.push(this.ant);
    }
  }

  createNewPositionAndCheckOverlaps() {
    var randomX = getRandomValue(0, GAME_WIDTH - ANT_WIDTH);
    var randomY = getRandomValue(0, GAME_HEIGHT - ANT_HEIGHT);
    for (var i = 0; i < this.xyArray.length; i++) {
      if (
        randomX >= this.xyArray[i].x &&
        randomX <= this.xyArray[i].x + ANT_WIDTH &&
        randomY >= this.xyArray[i].y &&
        randomY <= this.xyArray[i].y + ANT_HEIGHT
      ) {
        this.createNewPositionAndCheckOverlaps();
      }
    }
    this.xyArray.push({ x: randomX, y: randomY });
  }

  moveAnts() {
    for (var i = 0; i < this.antArray.length; i++) {
      this.antArray[i].move();
      this.detectOverallCollision();
      this.checkDeadAnt();
    }
    if (!this.difficultyChanged) {
      this.changeDifficulty();
    }
  }

  changeDifficulty() {
    if (this.score >= 10 && this.score % 5 == 0) {
      for (var i = 0; i < this.antArray.length; i++) {
        this.antArray[i].directionX *= 3;
        this.antArray[i].directionY *= 3;
      }
      this.difficultyChanged = true;
    }
  }

  checkDeadAnt() {
    for (var i = 0; i < this.antArray.length; i++) {
      if (this.antArray[i].isSmashed) {
        this.antArray.splice(i, 1);
      }
    }
    if (this.antArray.length == 0) {
      GAME_COMPLETE.play();
      alert('CONGRATULATIONS!!! YOU SMASHED ALL ANTS');
    }
  }

  detectOverallCollision() {
    for (var i = 0; i < this.antArray.length; i++) {
      for (var j = 0; j < this.antArray.length; j++) {
        if (i != j) {
          if (this.detectAntCollision(this.antArray[i], this.antArray[j])) {
            this.changeVelocityAfterCollision(this.antArray[i], this.antArray[j]);
          }
        }
      }
    }
  }

  detectAntCollision(ant1, ant2) {
    if (
      ant1.antPositionX < ant2.antPositionX + ANT_WIDTH &&
      ant1.antPositionX + ANT_WIDTH > ant2.antPositionX &&
      ant1.antPositionY < ant2.antPositionY + ANT_HEIGHT &&
      ant1.antPositionY + ANT_HEIGHT > ant2.antPositionY
    ) {
      // collision detected!
      console.log('Collsion');
      return true;
    } else return false;
  }

  changeVelocityAfterCollision(ant1, ant2) {
    // Change velocity at X-axis
    var u1 = ant1.directionX; //Initial speed at X-axis of ant 1
    var u2 = ant2.directionX; //Initial speed at X-axis of ant 2
    ant1.directionX = u2;
    ant2.directionX = u1;

    //Change velocity at Y-axis
    u1 = ant1.directionY; //Initial speed at Y-axis of ant 1
    u2 = ant2.directionY; //Initial speed at Y-axis of ant 2
    ant1.directionY = u2;
    ant2.directionY = u1;

    ant1.move();
    ant2.move();
  }
}

new Game('game-wrapper1', 20);
new Game('game-wrapper2', 20);
