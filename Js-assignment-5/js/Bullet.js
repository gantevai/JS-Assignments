class Bullet {
  isDestroyed = false;

  constructor(gameContainer) {
    this.gameContainer = gameContainer;
    this.car = gameContainer.getElementsByClassName('player-car')[0];
    this.create();
  }

  create() {
    this.bullet = document.createElement('div');
    this.bullet.classList.add('bullet');
    this.bulletPositionX = this.car.offsetLeft + (CAR_WIDTH - BULLET_WIDTH) / 2;
    this.bullet.style.left = this.bulletPositionX + 'px';
    this.bulletPositionY = GAME_HEIGHT - CAR_HEIGHT - BULLET_HEIGHT;
    this.bullet.style.top = this.bulletPositionY + 'px';
    this.gameContainer.appendChild(this.bullet);
  }

  move() {
    this.bulletPositionY -= BULLET_SPEED;
    this.updateBulletPosition();
    this.checkBulletPassOutOfScreen();
  }

  updateBulletPosition() {
    this.bullet.style.top = this.bulletPositionY + 'px';
  }

  checkBulletPassOutOfScreen() {
    if (this.bulletPositionY <= -BULLET_HEIGHT) {
      this.isDestroyed = true;
    }
  }

  destroy() {
    this.gameContainer.removeChild(this.bullet);
  }
}
