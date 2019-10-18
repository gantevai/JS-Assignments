class Helix {
  constructor(containerID) {
    this.amplitude = 50;
    this.phase = 0;
    this.animationSpeed = 0.03;
    this.maxCircleSize = 20;
    this.frameCount = 0;
    this.numRows = 10;
    this.numCols = 10;
    this.numStrands = 2;
    this.gapBetweenCols = 30;
    this.gapBetweenRows = 15;
    this.elementPositionY = 200;
    this.elementPositionX = 500;
    this.container = document.getElementById(containerID);

    setInterval(
      function() {
        this.container.innerHTML = '';
        this.animate();
      }.bind(this),
      20
    );
  }

  animate() {
    var positionX = this.elementPositionX;
    var colOffset = 0;
    this.frameCount++;
    this.phase = this.frameCount * this.animationSpeed;

    for (var count = 0; count < this.numStrands; count++) {
      var strandPhase = this.phase + count * Math.PI;
      positionX = this.elementPositionX;

      for (var colCount = 0; colCount < this.numCols; colCount++) {
        positionX = positionX + this.gapBetweenCols;
        this.colOffset = (colCount * 2 * Math.PI) / this.maxCircleSize;

        for (var rowCount = 0; rowCount < this.numRows; rowCount++) {
          var positionY =
            this.elementPositionY +
            rowCount * this.gapBetweenRows +
            Math.sin(strandPhase + this.colOffset) * this.amplitude;
          var sizeOffSet =
            (Math.cos(strandPhase - rowCount / this.numRows + this.colOffset) + 1) * 0.5;
          var circleSize = sizeOffSet * this.maxCircleSize;

          this.draw(positionX, positionY, circleSize);
        }
      }
    }
  }

  draw(x, y, circleSize) {
    this.dot = document.createElement('div');
    this.dot.classList.add('dots');
    this.dot.style.width = circleSize + 'px';
    this.dot.style.height = circleSize + 'px';
    this.dot.style.left = x + 'px';
    this.dot.style.top = y + 'px';
    this.container.appendChild(this.dot);
  }
}

new Helix('container');
