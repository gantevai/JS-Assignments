(function() {
  function Carousel(containerClass, automateDirection, slideMoveSpeed, imageHoldTime) {
    this.container = containerClass;
    var SLIDE_MOVE_SPEED = slideMoveSpeed;
    var IMAGE_HOLD_TIME = imageHoldTime;
    var AUTOMATE_DIRECTION = automateDirection;
    this.wrapper = null;
    this.imageHeight = null;
    this.imageWidth = null;
    this.totalImage = null;
    this.wrapperWidth = null;
    this.leftValue = null;
    this.leftBtn = null;
    this.rightBtn = null;
    this.imageIndex = null;
    this.clicked = null;
    this.indicatorList = null;
    this.dotIndicator = [];
    this.screenWidth = null;

    var that = this;

    this.init = function() {
      this.getMeasurement();
      this.styleWrapperAndContainer();
      this.createButtons();
      this.initializeIndexes();
      this.createIndicator();
      this.automateSlide;
      this.rightBtn.onclick = function() {
        that.rightBtnClick();
      };
      this.leftBtn.onclick = function() {
        that.leftBtnClick();
      };
    };

    this.getMeasurement = function() {
      this.wrapper = this.container.getElementsByClassName('wrapper')[0];
      this.imageHeight = this.wrapper.children[0].height;
      this.imageWidth = this.wrapper.children[0].width;
      this.totalImage = this.wrapper.children.length;
      this.wrapperWidth = this.imageWidth * this.totalImage;
    };

    this.styleWrapperAndContainer = function() {
      this.wrapper.style.width = this.wrapperWidth + 'px';
      this.wrapper.style.height = this.imageHeight + 'px';
      this.wrapper.style.left = 0;
      this.container.style.width = this.imageWidth + 'px';
      this.container.style.height = this.imageHeight + 'px';

      //Make Responsive
      this.makeResponsive = setInterval(function() {
        that.screenWidth = window.innerWidth;
        if (that.screenWidth > 600) {
          that.container.style.width = (that.imageWidth / that.screenWidth) * 100 + '%';
          console.log(that.container.style.width);
        } else {
          that.container.style.width = '80%';
        }
      });
    };

    this.createButtons = function() {
      this.leftBtn = document.createElement('div');
      this.leftBtn.classList.add('left-btn');
      this.leftBtn.innerHTML = '<';
      this.container.appendChild(this.leftBtn);
      this.rightBtn = document.createElement('div');
      this.rightBtn.classList.add('right-btn');
      this.rightBtn.innerHTML = '>';
      this.container.appendChild(this.rightBtn);
    };

    this.initializeIndexes = function() {
      this.imageIndex = 1; //(default)
      this.clicked = false;
      this.leftValue - parseInt(this.wrapper.style.left);
    };

    this.createIndicator = function() {
      this.indicatorList = document.createElement('DIV');
      this.indicatorList.className = 'indicator-list';

      for (var i = 0; i < this.totalImage; i++) {
        this.dotIndicator[i] = document.createElement('DIV');
        this.dotIndicator[i].className = 'dot-indicator';
        this.indicatorList.appendChild(this.dotIndicator[i]);
        this.dotIndicator[i].onclick = function() {
          var index = Array.prototype.slice.call(that.indicatorList.children).indexOf(this);
          that.indicatorFunctionality(index);
        };
      }
      this.container.appendChild(this.indicatorList);

      this.activateIndicator(this.dotIndicator[this.imageIndex - 1]); // to make first index activated
    };

    this.moveWrapper = function(element, value) {
      element.style.left = value + 'px';
    };

    this.activateIndicator = function(element) {
      element.style.backgroundColor = 'blue';
    };

    this.deActivateIndicator = function(element) {
      element.style.backgroundColor = 'gray';
    };

    this.rightBtnClick = function() {
      console.log('ok');
      if (!that.clicked) {
        that.clicked = true;
        that.deActivateIndicator(that.dotIndicator[that.imageIndex - 1]);
        if (that.imageIndex != that.totalImage) {
          var initialLeftValue = parseInt(that.wrapper.style.left);
          var moveSlideLeft = setInterval(function() {
            that.leftValue -= SLIDE_MOVE_SPEED;
            if (Math.abs(that.leftValue - initialLeftValue) >= that.imageWidth) {
              clearInterval(moveSlideLeft);
              that.clicked = false;
              that.imageIndex++;
              that.activateIndicator(that.dotIndicator[that.imageIndex - 1]);
              that.leftValue += Math.abs(that.leftValue - initialLeftValue) - that.imageWidth; //Shifting the extrapixels back to right.
            }
            that.moveWrapper(that.wrapper, that.leftValue);
          });
        } else {
          var slideReset = setInterval(function() {
            that.leftValue += 5 * SLIDE_MOVE_SPEED;
            if (that.leftValue >= 0) {
              clearInterval(slideReset);
              that.imageIndex = 1;
              that.clicked = false;
              that.activateIndicator(that.dotIndicator[that.imageIndex - 1]);
              that.leftValue = 0;
            }
            that.moveWrapper(that.wrapper, that.leftValue);
          });
        }
        clearInterval(that.automateSlide); //stopped the automated slider
        that.automateSlide = setInterval(function() {
          if (AUTOMATE_DIRECTION == 'right') {
            that.rightBtnClick();
          } else {
            that.leftBtnClick();
          }
        }, IMAGE_HOLD_TIME); //Restarted the automated slider
      }
    };

    this.leftBtnClick = function() {
      if (!that.clicked) {
        that.clicked = true;
        that.deActivateIndicator(that.dotIndicator[that.imageIndex - 1]);
        if (that.imageIndex != 1) {
          var initialLeftValue = parseInt(that.wrapper.style.left);
          var moveSlideRight = setInterval(function() {
            that.leftValue += SLIDE_MOVE_SPEED;
            if (Math.abs(that.leftValue - initialLeftValue) >= that.imageWidth) {
              clearInterval(moveSlideRight);
              that.clicked = false;
              that.imageIndex--;
              that.activateIndicator(that.dotIndicator[that.imageIndex - 1]);
              that.leftValue -= Math.abs(that.leftValue - initialLeftValue) - that.imageWidth; //Shifting the extrapixels back to left.
            }
            that.moveWrapper(that.wrapper, that.leftValue);
          });
        } else {
          var slideReset = setInterval(function() {
            that.leftValue -= 5 * SLIDE_MOVE_SPEED;
            if (that.leftValue <= that.imageWidth - that.wrapperWidth) {
              clearInterval(slideReset);
              that.imageIndex = that.totalImage;
              that.clicked = false;
              that.activateIndicator(that.dotIndicator[that.imageIndex - 1]);
              that.leftValue -= that.leftValue - (that.imageWidth - that.wrapperWidth);
            }
            that.moveWrapper(that.wrapper, that.leftValue);
          });
        }
        clearInterval(that.automateSlide); //stopped the automated slider
        that.automateSlide = setInterval(function() {
          if (AUTOMATE_DIRECTION == 'right') {
            that.rightBtnClick();
          } else {
            that.leftBtnClick();
          }
        }, IMAGE_HOLD_TIME); //Restarted the automated slider
      }
    };

    this.indicatorFunctionality = function(clickedIndex) {
      if (!that.clicked) {
        that.clicked = true;
        that.deActivateIndicator(that.dotIndicator[that.imageIndex - 1]);
        clickedIndex = clickedIndex + 1;
        var stopValue = (1 - clickedIndex) * that.imageWidth;
        if (that.imageIndex > clickedIndex) {
          var moveSlideRight = setInterval(function() {
            that.leftValue += SLIDE_MOVE_SPEED;
            if (that.leftValue >= stopValue) {
              clearInterval(moveSlideRight);
              that.imageIndex = clickedIndex;
              that.activateIndicator(that.dotIndicator[that.imageIndex - 1]);
              that.clicked = false;
              that.leftValue -= that.leftValue - stopValue;
            }
            that.moveWrapper(that.wrapper, that.leftValue);
          });
        } else if (that.imageIndex < clickedIndex) {
          var moveSlideLeft = setInterval(function() {
            that.leftValue -= 3 * SLIDE_MOVE_SPEED;
            if (that.leftValue <= stopValue) {
              clearInterval(moveSlideLeft);
              that.imageIndex = clickedIndex;
              that.activateIndicator(that.dotIndicator[that.imageIndex - 1]);
              that.clicked = false;
              that.leftValue += that.leftValue - stopValue;
            }
            that.moveWrapper(that.wrapper, that.leftValue);
          });
        } else {
          that.activateIndicator(that.dotIndicator[that.imageIndex - 1]);
          that.clicked = false;
        }
        clearInterval(that.automateSlide); //stopped the automated slider
        that.automateSlide = setInterval(function() {
          if (AUTOMATE_DIRECTION == 'right') {
            that.rightBtnClick();
          } else {
            that.leftBtnClick();
          }
        }, IMAGE_HOLD_TIME); //Restarted the automated slider
      }
    };

    this.automateSlide = setInterval(function() {
      if (AUTOMATE_DIRECTION == 'right') {
        that.rightBtnClick();
      } else {
        that.leftBtnClick();
      }
    }, IMAGE_HOLD_TIME);

    this.init();
  }
  var container1 = document.getElementsByClassName('container')[0];
  new Carousel(container1, 'left', 3, 3000);

  var container2 = document.getElementsByClassName('container')[1];
  new Carousel(container2, 'right', 5, 5000);

  var container3 = document.getElementsByClassName('container')[2];
  new Carousel(container3, 'right', 7, 2000);

  var container4 = document.getElementsByClassName('container')[3];
  new Carousel(container4, 'left', 2, 4000);
})();
