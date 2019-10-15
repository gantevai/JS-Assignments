const FPS = 90;
const FRAME_LIMIT = 1000 / FPS;
const LEFT_END = 185;
const RIGHT_END = 575;
const LANE_WIDTH = 130;
const OBSTACLE_POSITION = [185, 315, 445, 575];
const CAR_WIDTH = 80;
const CAR_HEIGHT = 150;
const OBSTACLE_START_POSITION = -200;
const BULLET_WIDTH = 15;
const BULLET_HEIGHT = 45;
const BULLET_SPEED = 3;
const BULLET_INTERVAL = 500; //in millisecond
const GAME_HEIGHT = 650;
const GAME_WIDTH = 850;

/**
 * For Shuffling Array Elements
 */
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

class Game {
  obstacleCars = [];
  bulletCount = 10;
  bulletArray = [];
  firedBullet = false;
  score = 0;
  speed = { obstacle: 2, backgroundRoad: 5 };
  obstacleInterval = 2300;

  constructor() {
    this.createGameFields();
    this.showMenu();
  }

  /**
   * Show the starting menu of the game
   */
  showMenu() {
    this.playButton = document.createElement('button');
    this.highScoreDisplay = document.createElement('div');
    this.scoreDisplay = document.createElement('div');
    this.ammoNotification = document.createElement('div');
    this.playButton.innerText = 'CLICK TO START';
    this.playButton.classList.add('play-button');
    this.highScoreDisplay.classList.add('high-score');
    this.ammoNotification.classList.add('ammo-notification');
    this.scoreDisplay.classList.add('score');
    this.gameContainer.appendChild(this.playButton);
    this.gameContainer.appendChild(this.highScoreDisplay);
    this.gameContainer.appendChild(this.scoreDisplay);
    this.gameContainer.appendChild(this.ammoNotification);
    this.getHighScore();

    this.playButton.onclick = () => {
      this.playgame();
    };
  }

  playgame() {
    this.playButton.style.display = 'none'; //hide the play button and highscore display
    this.highScoreDisplay.style.display = 'none';
    this.scoreDisplay.style.display = 'block';

    //Updating score per second
    this.updateScore = setInterval(
      function() {
        this.score++;
        this.scoreDisplay.innerText = `SCORE : ${this.score}`;
        this.increaseSpeed();
      }.bind(this),
      1000
    );

    this.createPlayerCar();
    this.moveBackground = setInterval(
      function() {
        this.moveRoadBackground();
        this.moveObstacles();
      }.bind(this),
      FRAME_LIMIT
    );
    this.createObstacles = setInterval(
      function() {
        this.createObstacleCars();
      }.bind(this),
      this.obstacleInterval
    );
    this.checkKeyPress();
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
   * Get and set highscore from the localStorage.
   */
  getHighScore() {
    if (!localStorage.getItem('highscore')) {
      localStorage.setItem('highscore', 0);
    }
    this.highScoreDisplay.innerText = `HIGHSCORE : ${localStorage.getItem('highscore')}`;
  }

  setHighScore() {
    var highscore = parseInt(localStorage.getItem('highscore'));
    if (this.score > highscore) {
      localStorage.setItem('highscore', this.score);
    }
    this.getHighScore();
  }

  /**
   *  Increasing the difficulty of the game
   */

  increaseSpeed() {
    if (this.score == 20) {
      this.speed.backgroundRoad = 7;
      this.speed.obstacle = 4;
      this.obstacleInterval = 1200;
      clearInterval(this.createObstacles);
      this.createObstacles = setInterval(
        function() {
          this.createObstacleCars();
        }.bind(this),
        this.obstacleInterval
      );
    } else if (this.score == 40) {
      this.speed.backgroundRoad = 9;
      this.speed.obstacle = 6;
      this.obstacleInterval = 800;
      clearInterval(this.createObstacles);
      this.createObstacles = setInterval(
        function() {
          this.createObstacleCars();
        }.bind(this),
        this.obstacleInterval
      );
    }
  }

  /**
   * Move the background road by increasing top value of the game wrapper
   */
  moveRoadBackground() {
    this.topValue += this.speed.backgroundRoad;
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

  /**
   * Create a player car
   */
  createPlayerCar() {
    this.car = new Car(this.gameContainer);
  }

  /**
   * Create obstacle cars
   */
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

  /**
   * Move the obstacle cars
   */
  moveObstacles() {
    for (var i = 0; i < this.obstacleCars.length; i++) {
      this.obstacleCars[i].moveObstacle(this.speed.obstacle);
      this.checkOverallCollision();
      this.checkDestroyedObstaclesAndBullets();
    }
  }

  /**
   * Check overallcollision of bullet-obstacle  and car-obstacle
   */
  checkOverallCollision() {
    for (var i = 0; i < this.obstacleCars.length; i++) {
      this.obstacleCars[i].checkCollisionAtEnd();
      if (this.checkCarCollision(this.car, this.obstacleCars[i])) {
        // console.log('GAME OVER');
        this.gameOver();
      }
    }

    for (var i = 0; i < this.bulletArray.length; i++) {
      for (var j = 0; j < this.obstacleCars.length; j++) {
        if (this.checkBulletCollision(this.bulletArray[i], this.obstacleCars[j])) {
          this.bulletArray[i].isDestroyed = true;
          this.obstacleCars[j].isDestroyed = true;
        }
      }
    }
  }

  /**
   * Check collision of car-obstacle
   */
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

  /**
   * Check collision of bullet-obstacle
   */
  checkBulletCollision(bullet, obstacle) {
    if (
      bullet.bulletPositionX < obstacle.positionX + CAR_WIDTH &&
      bullet.bulletPositionX + BULLET_WIDTH > obstacle.positionX &&
      bullet.bulletPositionY < obstacle.positionY + CAR_HEIGHT &&
      bullet.bulletPositionY + BULLET_HEIGHT > obstacle.positionY
    ) {
      return true;
    } else return false;
  }

  /**
   * Check for destroyed obstacles and bullets to remove them from game
   */
  checkDestroyedObstaclesAndBullets() {
    for (var i = 0; i < this.obstacleCars.length; i++) {
      if (this.obstacleCars[i].isDestroyed) {
        this.obstacleCars[i].destroy();
        this.obstacleCars.splice(i, 1);
      }
    }

    for (var i = 0; i < this.bulletArray.length; i++) {
      if (this.bulletArray[i].isDestroyed) {
        this.bulletArray[i].destroy();
        this.bulletArray.splice(i, 1);
      }
    }
  }

  /**
   * Check which key is pressed
   */
  checkKeyPress() {
    document.onkeydown = event => {
      const keyPressed = event.code;
      if (keyPressed == 'ArrowLeft' || keyPressed == 'KeyA') {
        this.car.moveCar('left');
      } else if (keyPressed == 'ArrowRight' || keyPressed == 'KeyD') {
        this.car.moveCar('right');
      } else if (keyPressed == 'Space') {
        if (!this.firedBullet) {
          this.createBullets();
          this.firedBullet = true;
          setTimeout(
            function() {
              this.firedBullet = false;
            }.bind(this),
            BULLET_INTERVAL
          );
        }
      }
    };
  }

  /**
   *  Create Bullets
   */
  createBullets() {
    if (this.bulletCount == 0) {
      this.ammoNotification.style.display = 'block';
      this.ammoNotification.innerText = 'No Ammo!!! Reloading';
      setTimeout(
        function() {
          this.ammoNotification.style.display = 'none';
        }.bind(this),
        500
      );

      //REARM WITH AMMO AFTER 15 SECONDS
      setTimeout(
        function() {
          this.bulletCount = 10;
          this.ammoNotification.style.display = 'block';
          this.ammoNotification.innerText = 'Ammo Reloaded';
          setTimeout(
            function() {
              this.ammoNotification.style.display = 'none';
            }.bind(this),
            500
          );
        }.bind(this),
        15000
      );
      return;
    }
    this.bulletCount--;
    this.bullet = new Bullet(this.gameContainer);
    this.bulletArray.push(this.bullet);
    clearInterval(this.bulletMover);
    this.bulletMover = setInterval(
      function() {
        this.moveBullets();
      }.bind(this),
      FRAME_LIMIT
    );
  }

  /**
   * Move Bullets forward
   */
  moveBullets() {
    for (var i = 0; i < this.bulletArray.length; i++) {
      this.bulletArray[i].move();
    }
  }

  /**
   * End the game
   */

  gameOver() {
    this.car.destroy();
    clearInterval(this.moveBackground);
    clearInterval(this.createObstacles);
    clearInterval(this.updateScore);
    this.highScoreDisplay.style.display = 'block';
    var mainMenu = document.createElement('button');
    mainMenu.classList.add('play-button');
    mainMenu.style.display = 'block';
    mainMenu.innerText = 'MAIN MENU';

    mainMenu.onclick = () => {
      location.reload();
    };
    this.gameContainer.appendChild(mainMenu);
    this.setHighScore();
  }
}
var game = new Game();
