var imageHeight = document.querySelector('.container .wrapper img').height;
var imageWidth = document.querySelector('.container .wrapper img').width;
var totalImage = document.getElementsByClassName('wrapper')[0].children.length;
var wrapperWidth = imageWidth * totalImage;

var container = document.getElementsByClassName('container')[0];
var wrapper = document.getElementsByClassName('wrapper')[0];
wrapper.style.width = wrapperWidth + 'px';
wrapper.style.height = imageHeight + 'px';
wrapper.style.left = 0;
container.style.width = imageWidth + 'px';
container.style.height = imageHeight + 'px';
// var screenWidth = screen.width;

// if (screenWidth > 700) {
//     container.syle.width = (imageWidth / screenWidth) * 100 + '%';
// }
// else {
//     container.style.width = '100%';
// }

var value = parseInt(wrapper.style.left);
var leftBtn, rightBtn;
createButtons();
var imageIndex = 1;
var clicked = false;
var SLIDE_MOVE_SPEED = 2;
var IMAGE_HOLD_TIME = 3000; //in milliseconds

var dot = [];
var indicatorList = document.createElement('DIV');
indicatorList.className = 'indicator';

for (var i = 0; i < totalImage; i++) {
  dot[i] = document.createElement('DIV');
  dot[i].className = 'dots';
  indicatorList.appendChild(dot[i]);
  dot[i].setAttribute('onclick', `indicatorFunctionality(${i})`);
}

container.appendChild(indicatorList);

activateIndicator(dot[imageIndex - 1]); // to make first index activated

var automatedSlide = setInterval(function() {
  rightBtnClick();
}, IMAGE_HOLD_TIME);

rightBtn.onclick = function() {
  rightBtnClick();
};

leftBtn.onclick = function() {
  leftBtnClick();
};

function moveWrapper(element, value) {
  element.style.left = value + 'px';
}

function activateIndicator(element) {
  element.style.backgroundColor = 'blue';
}

function deActivateIndicator(element) {
  element.style.backgroundColor = 'gray';
}

function rightBtnClick() {
  if (!clicked) {
    clicked = true;
    deActivateIndicator(dot[imageIndex - 1]);
    if (imageIndex != totalImage) {
      var moveSlideLeft = setInterval(function() {
        value -= 5 * SLIDE_MOVE_SPEED;
        moveWrapper(wrapper, value);
        if (value % imageWidth == 0) {
          clearInterval(moveSlideLeft);
          clicked = false;
          imageIndex++;
          activateIndicator(dot[imageIndex - 1]);
        }
      });
    } else {
      var slideReset = setInterval(function() {
        value += 20;
        moveWrapper(wrapper, value);
        if (value == 0) {
          clearInterval(slideReset);
          imageIndex = 1;
          clicked = false;
          activateIndicator(dot[imageIndex - 1]);
        }
      });
    }
    clearInterval(automatedSlide); //stopped the automated slider
    //Restarted the automated slider
    automatedSlide = setInterval(function() {
      rightBtnClick();
    }, IMAGE_HOLD_TIME);
  }
}

function leftBtnClick() {
  if (!clicked) {
    clicked = true;
    deActivateIndicator(dot[imageIndex - 1]);
    if (imageIndex != 1) {
      var moveSlideRight = setInterval(function() {
        value += 5 * SLIDE_MOVE_SPEED;
        moveWrapper(wrapper, value);
        if (value % imageWidth == 0) {
          clearInterval(moveSlideRight);
          clicked = false;
          imageIndex--;
          activateIndicator(dot[imageIndex - 1]);
        }
      });
    } else {
      var slideReset = setInterval(function() {
        value -= 20;
        moveWrapper(wrapper, value);
        if (value == imageWidth - wrapperWidth) {
          clearInterval(slideReset);
          imageIndex = totalImage;
          clicked = false;
          activateIndicator(dot[imageIndex - 1]);
        }
      });
    }
    clearInterval(automatedSlide); //stopped the automated slider
    //Restarted the automated slider
    automatedSlide = setInterval(function() {
      rightBtnClick();
    }, IMAGE_HOLD_TIME);
  }
}

function indicatorFunctionality(clickedIndex) {
  if (!clicked) {
    clicked = true;
    deActivateIndicator(dot[imageIndex - 1]);
    clickedIndex = clickedIndex + 1;
    var stopValue = (1 - clickedIndex) * imageWidth;
    if (imageIndex > clickedIndex) {
      var moveSlideRight = setInterval(function() {
        value += 5 * SLIDE_MOVE_SPEED;
        moveWrapper(wrapper, value);
        if (value == stopValue) {
          clearInterval(moveSlideRight);
          imageIndex = clickedIndex;
          activateIndicator(dot[imageIndex - 1]);
          clicked = false;
        }
      });
    } else if (imageIndex < clickedIndex) {
      var moveSlideLeft = setInterval(function() {
        value -= 10;
        moveWrapper(wrapper, value);
        if (value == stopValue) {
          clearInterval(moveSlideLeft);
          imageIndex = clickedIndex;
          activateIndicator(dot[imageIndex - 1]);
          clicked = false;
        }
      });
    } else {
      activateIndicator(dot[imageIndex - 1]);
      clicked = false;
    }
    clearInterval(automatedSlide); //stopped the automated slider
    //Restarted the automated slider
    automatedSlide = setInterval(function() {
      rightBtnClick();
    }, IMAGE_HOLD_TIME);
  }
}

function createButtons() {
  leftBtn = document.createElement('div');
  leftBtn.classList.add('left-btn');
  container.appendChild(leftBtn);

  rightBtn = document.createElement('div');
  rightBtn.classList.add('right-btn');
  container.appendChild(rightBtn);
}
