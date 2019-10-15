const FPS = 90;
const FRAME_LIMIT = 1000 / FPS;
const LEFT_END = 185;
const RIGHT_END = 575;
const LANE_WIDTH = 130;
const OBSTACLE_POSITION = [185, 315, 445, 575];
const CAR_WIDTH = 80;
const CAR_HEIGHT = 150;

function shuffle(a) {
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function getRandomValue(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
}

class Car {
  constructor(gameContainer) {
    this.gameContainer = gameContainer;
    this.createPlayerCar();
  }

  createPlayerCar() {
    this.car = document.createElement('div');
    this.car.classList.add('player-car');
    this.car.style.bottom = 0;
    this.car.style.left = '315px';
    this.gameContainer.appendChild(this.car);
    this.positionX = this.car.offsetLeft;
    this.positionY = this.car.offsetTop;
  }

  moveCar(direction) {
    this.car.style.transition = '0.5s ease';
    if (direction == 'left') {
      if (this.positionX != LEFT_END) {
        this.positionX -= LANE_WIDTH;
      }
    } else if (direction == 'right') {
      if (this.positionX != RIGHT_END) {
        this.positionX += LANE_WIDTH;
      }
    }
    this.updateCarHorizontalPosition();
  }

  updateCarHorizontalPosition() {
    this.car.style.left = this.positionX + 'px';
  }
}

class Obstacle {
  isDestroyed = false;

  constructor(gameContainer) {
    this.gameContainer = gameContainer;
    this.createObstacleCar();
  }
  createObstacleCar() {
    this.obstacle = document.createElement('div');
    this.obstacle.classList.add('obstacle-car');
    this.positionY = this.obstacle.offsetTop;
    this.gameContainer.appendChild(this.obstacle);
  }

  setObstaclePosition(position) {
    this.obstacle.style.left = position + 'px';
    this.positionX = position;
  }

  moveObstacle() {
    this.positionY += 2;
    this.updateObstacleVerticalPosition();
  }

  updateObstacleVerticalPosition() {
    this.obstacle.style.top = this.positionY + 'px';
  }

  checkCollisionAtEnd() {
    if (this.positionY >= 650) {
      this.isDestroyed = true;
    }
  }

  destroy() {
    this.gameContainer.removeChild(this.obstacle);
  }
}

class Game {
  obstacleCars = [];
  constructor() {
    this.createGameFields();
    this.showMenu();
  }

  /**
   * Show the starting menu of the game
   */
  showMenu() {
    this.playButton = document.createElement('button');
    this.gameOverDisplay = document.createElement('div');
    this.playButton.innerText = 'CLICK TO START';
    this.gameOverDisplay.innerText = 'GAME OVER';
    this.playButton.classList.add('play-button');
    this.gameOverDisplay.classList.add('game-over');
    this.gameContainer.appendChild(this.playButton);
    this.gameContainer.appendChild(this.gameOverDisplay);
    this.playButton.onclick = () => {
      this.playButton.style.display = 'none'; //hide the play button
      this.createPlayerCar();
      this.moveBackground = setInterval(
        function() {
          this.moveRoadBackground();
          this.moveObstacles();
          this.checkOverallCollision();
          this.checkDestroyedObstacles();
        }.bind(this),
        FRAME_LIMIT
      );
      this.createObstacles = setInterval(
        function() {
          this.createObstacleCars();
        }.bind(this),
        2300
      );
      this.checkKeyPress();
    };
  }

  /**
   * Create the container for the game and the wrapper for the road background.
   * Add classes to the container and wrapper
   * Store the initial top value of the wrapper in the topValue variable to use it in moving effect of
     background road. 
   */
  createGameFields() {
    this.body = document.querySelector('body');
    this.gameContainer = document.createElement('div');
    this.gameContainer.classList.add('game-container');
    this.body.appendChild(this.gameContainer);
    this.gameWrapper = document.createElement('div');
    this.gameWrapper.classList.add('wrapper');
    this.gameContainer.appendChild(this.gameWrapper);
    this.topValue = this.gameWrapper.offsetTop;
    this.defaultTopValue = this.topValue;
  }

  /**
   * Move the background road by increasing top value of the game wrapper
   */
  moveRoadBackground() {
    this.topValue += 5;
    this.checkAndRepeatRoadBackground();
    this.updateRoadBackground();
  }

  /**
   * Update the background road by assigning changed top value to the game wrapper div.
   */
  updateRoadBackground() {
    this.gameWrapper.style.top = this.topValue + 'px';
  }

  /**
   * Check when the background road image needs to be repeated.
   */
  checkAndRepeatRoadBackground() {
    if (this.topValue >= 0) {
      this.topValue = this.defaultTopValue;
    }
  }

  createPlayerCar() {
    this.car = new Car(this.gameContainer);
  }

  createObstacleCars() {
    var obstacleCount = getRandomValue(1, OBSTACLE_POSITION.length);
    // console.log(obstacleCount);
    for (var i = 0; i < obstacleCount; i++) {
      this.obstacle = new Obstacle(this.gameContainer);
      this.obstacle.setObstaclePosition(OBSTACLE_POSITION[i]);
      this.obstacleCars.push(this.obstacle);
    }
    shuffle(OBSTACLE_POSITION);
  }

  moveObstacles() {
    for (var i = 0; i < this.obstacleCars.length; i++) {
      this.obstacleCars[i].moveObstacle();
      this.checkOverallCollision();
    }
  }

  checkOverallCollision() {
    for (var i = 0; i < this.obstacleCars.length; i++) {
      this.obstacleCars[i].checkCollisionAtEnd();
      if (this.checkCarCollision(this.car, this.obstacleCars[i])) {
        // console.log('GAME OVER');
        this.gameOver();
      }
    }
  }

  checkCarCollision(car, obstacle) {
    if (
      car.positionX < obstacle.positionX + CAR_WIDTH &&
      car.positionX + CAR_WIDTH > obstacle.positionX &&
      car.positionY < obstacle.positionY + CAR_HEIGHT &&
      car.positionY + CAR_HEIGHT > obstacle.positionY
    ) {
      // collision detected!
      return true;
    } else return false;
  }

  checkDestroyedObstacles() {
    for (var i = 0; i < this.obstacleCars.length; i++) {
      if (this.obstacleCars[i].isDestroyed) {
        this.obstacleCars[i].destroy();
        this.obstacleCars.splice(i, 1);
      }
    }
  }

  checkKeyPress() {
    document.onkeydown = event => {
      const keyPressed = event.code;
      if (keyPressed == 'ArrowLeft') {
        this.car.moveCar('left');
      } else if (keyPressed == 'ArrowRight') {
        this.car.moveCar('right');
      }
    };
  }

  gameOver() {
    clearInterval(this.moveBackground);
    clearInterval(this.createObstacles);
    this.playButton.style.display = 'block';
    this.gameOverDisplay.style.display = 'block';
  }
}

new Game();
