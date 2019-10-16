class Bird {
  birdHeight = 40;
  birdWidth = 50;
  birdPositionX = 200;
  birdPositionY = 200;
  birdBackgroundPositionX = 0;

  constructor(gameContainer) {
    this.gameContainer = gameContainer;
    this.createBird();
  }

  createBird() {
    this.birdElement = document.createElement('div');
    this.birdElement.classList.add('bird');
    this.birdElement.style.height = this.birdHeight + 'px';
    this.birdElement.style.width = this.birdWidth + 'px';
    this.birdElement.style.left = this.gameContainer.appendChild(this.birdElement);

    this.setInitialPosition(this.birdPositionX, this.birdPositionY);
  }

  setInitialPosition(x, y) {
    this.birdElement.style.left = x + 'px';
    this.birdElement.style.top = y + 'px';
  }

  flyBird(jumpPower) {
    this.birdPositionY -= jumpPower;
    this.bird.style.transform = 'rotate(-45deg)'; 
    this.updateBirdPositionYInDOM();
  }

  updateBirdPositionYInDOM() {
    this.birdElement.style.top = this.birdPositionY + 'px';
  }

  dropBird(gravity) {
    this.birdPositionY += gravity;
    this.updateBirdPositionYInDOM();
  }

  animateBirdFly() {
    this.birdElement.style.backgroundPositionX = this.birdBackgroundPositionX + 'px';
    this.birdBackgroundPositionX -= this.birdWidth;
    if (this.birdBackgroundPositionX <= -174) {
      this.birdBackgroundPositionX = 0;
    }
  }
}

export default Bird;
