function getRandomValue(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
}

class Pipe {
  gapBetweenPipes = 150;
  minPipeHeight = 20;
  maxPipeHeight = 300;
  pipeWidth = 70;
  skyHeight = 512;
  isDestroyed = false;
  constructor(gameContainer) {
    this.gameContainer = gameContainer;
    this.create();
  }

  create() {
    this.pipeTop = document.createElement('div');
    this.pipeTop.classList.add('pipe');
    this.pipeTop.classList.add('invert-pipe');
    this.pipeBottom = document.createElement('div');
    this.pipeBottom.classList.add('pipe');
    this.gameContainer.appendChild(this.pipeTop);
    this.gameContainer.appendChild(this.pipeBottom);
    this.pipeLeftValue = this.pipeTop.offsetLeft;
    this.setRandomHeight();
  }

  setRandomHeight() {
    var randomHeight = getRandomValue(this.minPipeHeight, this.maxPipeHeight);
    this.pipeTop.style.height = randomHeight + 'px';
    this.pipeBottom.style.height = this.skyHeight - randomHeight - this.gapBetweenPipes + 'px';
    this.pipeBottom.style.top = randomHeight + this.gapBetweenPipes + 'px';
  }

  move() {
    this.pipeLeftValue -= 2;
    this.updatePipePosition();
  }

  updatePipePosition() {
    this.pipeTop.style.left = this.pipeLeftValue + 'px';
    this.pipeBottom.style.left = this.pipeLeftValue + 'px';
  }

  checkPipeOutOfScreen() {
    if (this.pipeLeftValue + this.pipeWidth <= 0) {
      this.isDestroyed = true;
      this.destroy();
    }
  }

  destroy() {
    this.gameContainer.removeChild(this.pipeTop);
    this.gameContainer.removeChild(this.pipeBottom);
  }
}
export default Pipe;
