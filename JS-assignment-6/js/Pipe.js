function getRandomValue(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
}

class Pipe {
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
    this.setRandomHeight();
  }

  setRandomHeight() {
    var randomHeight = getRandomValue(10, 400);
    this.pipeTop.style.height = randomHeight + 'px';
  }
}
export default Pipe;
