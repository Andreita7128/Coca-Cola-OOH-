class Button {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.size = 60;
    }

    show() {
        circle(this.x, this.y, this.size);
    }

    click() {
        return dist(this.x, this.y, mouseX, mouseY) < this.size / 2
    }
}

const NGROK = `https://${window.location.hostname}`;
console.log('Server IP: ', NGROK);
let socket = io(NGROK, {
    path: '/real-time'
});

let positionX, positionY = 0;
let move = null;
let isTouched = false;
let addPos = 70;
let up;
let down;
let right;
let left;
let screen = 1;

function setup() {
    frameRate(12);
    canvas = createCanvas(windowWidth, windowHeight);
    canvas.style('z-index', '-1');
    canvas.style('position', 'fixed');
    canvas.style('top', '0');
    canvas.style('right', '0');
    positionX = windowWidth / 2;
    positionY = windowHeight / 2;
    background(0);
    angleMode(DEGREES);

    up = new Button(positionX, positionY - addPos);
    down = new Button(positionX, positionY + addPos);
    left = new Button(positionX - addPos, positionY);
    right = new Button(positionX + addPos, positionY);


    socket.emit('device-size', {
        windowWidth,
        windowHeight
    });

}

function draw() {
    background(0, 5);
    fill(254, 0, 26);
    console.log(screen);

    switch (screen) {
        case 0:
            setTimeout(() => {
                screen = 1;
            }, 5000)
            break;

        case 1:
            up.show();
            down.show();
            right.show();
            left.show();
            break;

    }

}

function touchStarted() {
    isTouched = true;
}

function touchEnded() {
    isTouched = false;

    if (screen === 1) {
        if (up.click()) {
            move = 'up';
        } else if (down.click()) {
            move = 'down'
        } else if (right.click()) {
            move = 'right'
        } else if (left.click()) {
            move = 'left';
        }
        socket.emit('mobile-instructions', {
            move
        });
    }
}