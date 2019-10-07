; (function () {
    function getRandomInt(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
    }

    function Box(parentElem) {
        this.parentElem = parentElem;
        this.element = null;
        this.x = null;
        this.y = null;
        this.dx = 1;
        this.dy = 1;

        this.init = function () {
            this.element = document.createElement('div');
            this.element.classList.add('box');
            this.parentElem.appendChild(this.element);
        }

        this.checkCollion = function (box) {
            // checkCollision
        }

        this.init();

        this.setPosition = function (x, y) {
            this.x = x;
            this.y = y;
        }

        this.move = move.bind(this);

        function move() {
            this.x += this.dx;
            this.y += this.dy;

            this.draw();
        }

        this.draw = function () {
            this.element.style.top = this.x + 'px';
            this.element.style.left = this.y + 'px';
        }
    }

    function Game(boxCount) {
        var GAME_WIDTH = 500;
        var GAME_HEIGHT = 500;
        var GAME_ANIMATION_FRAME = 24;
        this.boxes = [];
        this.boxCount = boxCount;
        this.parentElem = document.getElementById('app');


        this.moveBoxes = function () {
            for (var i = 0; i < this.boxCount; i++) {
                this.boxes[i].move()
            }
        }

        this.init = function () {
            this.createBoxes();
            setInterval(this.moveBoxes.bind(this), GAME_ANIMATION_FRAME);
            return this;

        }

        this.createBoxes = function () {
            for (var i = 0; i < this.boxCount; i++) {
                var box = new Box(this.parentElem);
                var randomX = getRandomInt(0, GAME_WIDTH);
                var randomY = getRandomInt(0, GAME_HEIGHT);
                box.setPosition(randomX, randomY);
                box.draw();
                this.boxes.push(box);
            }
        }
    }
    new Game(10).init();
})()


