class Obstacle {
  isDestroyed = false;

  constructor(gameContainer) {
    this.gameContainer = gameContainer;
    this.createObstacleCar();
  }
  createObstacleCar() {
    this.obstacle = document.createElement('div');
    this.obstacle.classList.add('obstacle-car');
    this.positionY = OBSTACLE_START_POSITION;
    this.gameContainer.appendChild(this.obstacle);
  }

  setObstaclePosition(position) {
    this.obstacle.style.left = position + 'px';
    this.positionX = position;
  }

  moveObstacle(speed) {
    this.positionY += speed;
    this.updateObstacleVerticalPosition();
  }

  updateObstacleVerticalPosition() {
    this.obstacle.style.top = this.positionY + 'px';
  }

  checkCollisionAtEnd() {
    if (this.positionY >= GAME_HEIGHT) {
      this.isDestroyed = true;
    }
  }

  destroy() {
    this.obstacle.style.backgroundImage = 'url(../images/explosion.png)';
    setTimeout(() => {
      this.gameContainer.removeChild(this.obstacle);
    }, 500);
  }
}
