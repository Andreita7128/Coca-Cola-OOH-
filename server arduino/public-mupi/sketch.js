

const NGROK = `https://${window.location.hostname}`;
let socket = io(NGROK, {
    path: '/real-time'
});
console.log('Server IP', NGROK);

let posX, posY = 0;
let deviceWidth, deviceHeight = 0;
let mupiWidht, mupiHeight = 0;
let pj;
let pjX, pjY = 0;
let screen = 0;

let screen0;
let screen1;
let screen2;
let screen3;

let win = false;
let data = false

let winImage;
let loseImage;

let poten = 0;
let potenPrevious = poten;
let dist = 0;

function preload() {}

function setup() {
    frameRate(60);
    canvas = createCanvas(windowWidth, windowHeight);
    canvas.style('z-index', '-1');
    canvas.style('position', 'fixed');
    canvas.style('top', '0');
    canvas.style('right', '0');
    mupiWidth = 540;
    mupiHeight = 1200;
    pjX = mupiWidth / 2;
    pjY = windowHeight - 40;

    background(255);

    screen0 = loadImage('images/mupi1.png');
    screen1 = loadImage('images/mupi2.png');
    screen2 = loadImage('images/game.png');
    screen3 = loadImage('images/data.png');

    winImage = loadImage('images/win.png');
    loseImage = loadImage('images/lose.png');

    pj = new Player(pjX, pjY, mupiWidth);
}

function draw() {
    background(255);

    switch (screen) {
        case 0:
            image(screen0, 0, 0, 400, 700);
            if(dist > 0 && dist < 30){
                screen = 2
            }
            break;
        case 1:
            image(screen1, 0, 0, 493.71, 700);
            break;
        case 2:
            image(screen2, 0, 0);
            fill(254, 0, 26);
            pj.show();

            if (potenPrevious <= poten) {
                potenPrevious = poten;
                pj.moveRight();
            }

            if (potenPrevious >= poten) {
                potenPrevious = poten;
                pj.moveLeft();
            }
            break;

        case 3:
            image(screen3, 0, 0, 493.71, 700);
            break;

        case 4:
            image(winImage, 0, 0, 493.71, 700);
            break;
        case 5:
            image(loseImage, 0, 0, 493.71, 700);
            break;
    }
}

socket.on('messageArduino', (arduinoMessage) => {
    // console.log(arduinoMessage.poten);


    poten = arduinoMessage.poten;
    dist = arduinoMessage.dist;

    console.log(poten);

});

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}


function changeScreenData() {

}