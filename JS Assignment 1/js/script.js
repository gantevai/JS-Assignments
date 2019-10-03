// var FPS = 90;
// var FRAME_LIMIT = 1000 / FPS;
// var leftBtn = document.createElement('left-btn')
// container.appendChild(leftBtn);
// leftBtn.style.height = '20px';
// leftBtn.style.width = '20px';
// leftBtn.style.backgroundColor = 'black';
// var rightBtn = document.createElement('right-btn')
// rightBtn.style.height = '20px';
// rightBtn.style.width = '20px';
// rightBtn.style.backgroundColor = 'black';


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
var leftBtn = document.getElementById('leftBtn');
var rightBtn = document.getElementById('rightBtn');
var imageIndex = 1;
var clicked = false;

var dot = [];
var indicatorList = document.createElement("DIV");
indicatorList.style.position = 'absolute';
indicatorList.style.bottom = '0px';
indicatorList.style.left = '40%';
indicatorList.className = "indicator-list";
for (var i = 0; i < totalImage; i++) {
    dot[i] = document.createElement("DIV")
    createDotClass(dot[i]);
    indicatorList.appendChild(dot[i]);
}
container.appendChild(indicatorList);

// Click function of indicators
dot[0].onclick = function () { indicatorFunctionality(0) };
dot[1].onclick = function () { indicatorFunctionality(1) };
dot[2].onclick = function () { indicatorFunctionality(2) };
dot[3].onclick = function () { indicatorFunctionality(3) };

activateIndicator(dot[imageIndex - 1]); // to make first index activated

rightBtn.onclick = function () {
    if (!clicked) {
        clicked = true;
        deActivateIndicator(dot[imageIndex - 1]);
        if (imageIndex != totalImage) {
            var moveSlideLeft = setInterval(function () {
                value -= 10;
                moveWrapper(wrapper, value);
                if (value % imageWidth == 0) {
                    clearInterval(moveSlideLeft);
                    clicked = false;
                    imageIndex++;
                    activateIndicator(dot[imageIndex - 1]);
                }
            })
        }
        else {
            var slideReset = setInterval(function () {
                value += 20;
                moveWrapper(wrapper, value);
                if (value == 0) {
                    clearInterval(slideReset);
                    imageIndex = 1;
                    clicked = false;
                    activateIndicator(dot[imageIndex - 1]);

                }
            })
        }
    }
}

leftBtn.onclick = function () {
    if (!clicked) {
        clicked = true;
        deActivateIndicator(dot[imageIndex - 1]);
        if (imageIndex != 1) {
            var moveSlideRight = setInterval(function () {
                value += 10;
                moveWrapper(wrapper, value);
                if (value % imageWidth == 0) {
                    clearInterval(moveSlideRight);
                    clicked = false;
                    imageIndex--;
                    activateIndicator(dot[imageIndex - 1]);
                }
            })

        }
        else {
            var slideReset = setInterval(function () {
                value -= 20;
                moveWrapper(wrapper, value);
                if (value == imageWidth - wrapperWidth) {
                    clearInterval(slideReset);
                    imageIndex = totalImage;
                    clicked = false;
                    activateIndicator(dot[imageIndex - 1]);
                }
            })
        }
    }
}

function indicatorFunctionality(clickedIndex) {
    if (!clicked) {
        clicked = true;
        deActivateIndicator(dot[imageIndex - 1]);
        console.log("xiryyooo");
        clickedIndex = clickedIndex + 1;   //array starts from 0 so add 1 to match the real index
        stopValue = (1 - clickedIndex) * imageWidth;
        if (imageIndex > clickedIndex) {
            var moveSlideRight = setInterval(function () {
                value += 10;
                moveWrapper(wrapper, value);
                if (value == stopValue) {
                    clearInterval(moveSlideRight);
                    imageIndex = clickedIndex;
                    activateIndicator(dot[imageIndex - 1]);
                    clicked = false;
                }
            })
        }
        else if (imageIndex < clickedIndex) {
            var moveSlideLeft = setInterval(function () {
                value -= 10;
                moveWrapper(wrapper, value);
                if (value == stopValue) {
                    clearInterval(moveSlideLeft);
                    imageIndex = clickedIndex;
                    activateIndicator(dot[imageIndex - 1]);
                    clicked = false;
                }
            })
        }
        else {
            activateIndicator(dot[imageIndex - 1]);
            clicked = false;
        }
    }
}

function moveWrapper(element, value) {
    element.style.left = value + 'px';
}

function createDotClass(element) {
    element.style.height = '20px';
    element.style.width = '20px';
    element.style.backgroundColor = 'gray';
    element.style.borderRadius = '50%';
    element.style.display = 'inline-block';
}

function activateIndicator(element) {
    element.style.backgroundColor = 'blue';
}

function deActivateIndicator(element) {
    element.style.backgroundColor = 'gray';
}
