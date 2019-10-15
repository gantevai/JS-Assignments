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
    this.animate(direction);
    if (direction == 'left') {
      if (this.positionX != LEFT_END) {
        this.positionX -= LANE_WIDTH;
      }
    } else if (direction == 'right') {
      if (this.positionX != RIGHT_END) {
        this.positionX += LANE_WIDTH;
      }
    }
    setTimeout(
      function() {
        this.car.style.transform = 'none';
      }.bind(this),
      200
    );
    this.updateCarHorizontalPosition();
  }

  updateCarHorizontalPosition() {
    this.car.style.left = this.positionX + 'px';
  }

  destroy() {
    this.car.style.backgroundImage = 'url(../images/explosion.png)';
  }

  animate(direction) {
    if (direction == 'left') {
      this.car.style.transform = 'rotate(-35deg)';
    } else if (direction == 'right') {
      this.car.style.transform = 'rotate(35deg)';
    }
  }
}
