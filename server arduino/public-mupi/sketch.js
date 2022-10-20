const NGROK = `https://${window.location.hostname}`;
let socket = io(NGROK, {
    path: '/real-time'
});
console.log('Server IP', NGROK);

let posX, posY = 0;
let mupiWidth = 1440;
let mupiHeight = 1024;

let pj;
let pjX, pjY = 0;
let pjImageFront;
let pjImageRight;
let pjImageLeft;
let startMove = false;

let cans = [];
let canImage;
let car1;
let car2;
let countGodCan = 0;
let countObstacle = 0;
let countCan = 0;

let obstacles = [];
let obstacleImage;

let screen = 0;
let score = 0;


let screen0;
let screen3;
let scan;

let instructions = [];
let ins = 0;
let next = false;

let street;
let gui;
let canSave = 0;

let win = false;
let data = false

let winImage;
let loseImage;

let poten = 50;
let potenPrevious = poten;
let dist = 0;


let photo = [];
let photoScreen = 0;

function preload() {}

function setup() {
    frameRate(60);
    createCanvas(mupiWidth, mupiHeight);



    pjX = mupiWidth / 2;
    pjY = mupiHeight - 407;
    pjImageFront = loadImage('images/carFront.png');
    pjImageRight = loadImage('images/carRight.png');
    pjImageLeft = loadImage('images/carLeft.png');

    canImage = loadImage('images/canGod.png');
    car1 = loadImage('images/canBad.png')

    screen0 = loadImage('images/1.png');
    street = loadImage('images/8.png');
    gui = loadImage('images/gui.png');
    screen3 = loadImage('images/9.png');
    scan = loadImage('images/10.png');

    for (let i = 2; i < 8; i++) {
        instructions.push(loadImage(`images/${i}.png`))
        console.log(instructions)
    }

    for (let i = 13; i < 17; i++) {
        photo.push(loadImage(`images/${i}.png`))
        console.log(instructions)
    }

    car1 = loadImage('images/car1.png');
    car2 = loadImage('images/car2.png');



    winImage = loadImage('images/11.png');
    loseImage = loadImage('images/12.png');

    pj = new Player(pjX, pjY, mupiWidth, pjImageFront, pjImageRight, pjImageLeft);

}

function draw() {
    background(255);

    switch (screen) {
        case 0:
            image(screen0, 0, 0);
            if (dist > 0 && dist < 30) {
                screen = 1;
            }
            break;
        case 1:
            image(instructions[ins], 0, 0);
            if(frameCount  % 180 === 0){
                next = true;
            }
            if (potenPrevious !== poten && next) {
                ins++;
                potenPrevious = poten;
                next = false;
            }
            if (ins === 5) {
                screen = 2;
            }
            break;
        case 2:
            image(street, 0, 0);
            image(gui, 0, 0);

            setTimeout(() => {
                startMove = true;
            }, 3000);

            if (poten > 50 && startMove) {
                potenPrevious = poten;
                pj.moveRight();
            }

            if (poten < 50 && startMove) {
                potenPrevious = poten;
                pj.moveLeft();
            }

            console.log(mouseX, pj.x)

            randomCollectable();
            cans.forEach(element => {
                element.show();
                element.move();
                if (element.near(pj.getX(), pj.getY()) && element.getType() === 0) {
                    canSave += 1;
                    score += 10;
                    cans.splice(element, 1);
                }

                if (element.near(pj.getX(), pj.getY()) && element.getType() === 1) {
                    pj.loseLive();
                    score -= 20;
                    cans.splice(element, 1);
                }
            });

            pj.show();

            fill(255);
            textSize(50);
            text(`${canSave}/10`, 1205, mupiHeight - 110);
            text(`x${pj.getLives()}`, 1290, 125);
            //text(score, 1000, 200)

            if (canSave === 10 || pj.getLives() === 0) {
                screen = 3;
            }

            break;

        case 3:
            image(screen3, 0, 0);
            setTimeout(() => {
                screen = 4;
            }, 2000);
            break;

        case 4:
            image(scan, 0, 0);
            break;
        case 5:
            if (score > 70) {
                image(winImage, 0, 0);

                if(frameCount  % 180 === 0){
                    screen = 6;
                }
            } else {
                image(loseImage, 0, 0);
                if(frameCount  % 180 === 0){
                    screen = 8;
                }
            }
            break;

        case 6:
            image(photo[photoScreen], 0, 0);

            if(frameCount  % 180 === 0){
                screen = 7;
                photoScreen++
            }
          
            break;

            case 7:
            image(photo[photoScreen], 0, 0);
            if(frameCount  % 180 === 0){
                photoScreen = 2;
            }
          
            break;

            case 8:
            image(photo[3], 0, 0);
           
            break;
    }
}

socket.on('messageArduino', (arduinoMessage) => {

    poten = arduinoMessage.poten;
    dist = arduinoMessage.dist;

    console.log(poten);

});

socket.on('dataCollect', instructions => {
    let {
        sendInfo
    } = instructions;
    console.log(win)
    if (sendInfo) {
        console.log(sendInfo)
        screen = 5;

    }
})

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}


function changeScreenData() {

}

function randomCollectable() {
    if (frameCount % 150 === 0 && countCan <= 30) {
        const num = Math.round(random(1));
        const x = Math.floor(random(mupiWidth - 76));
        const y = -20;

        switch (num) {
            case 0:
                cans.push(new Collectable(x, y, canImage, 76, 154, 0));
                countGodCan++;
                break;
            case 1:
                randomCar();
                countObstacle++;
                break;
        }

        if (countObstacle === 15) {
            num = 0;
        }
        countCan++;
    }
}

function randomCar() {

    let chooseCar = Math.round(random(1));
    const x = Math.floor(random(mupiWidth - 90));
    const y = -20;

    switch (chooseCar) {
        case 0:
            cans.push(new Collectable(x, y, car1, 151, 237, 1));
            break;

        case 1:
            cans.push(new Collectable(x, y, car2, 151, 237, 1));

            break;
    }
}

function changeScreenData() {
    socket.emit('data-screen', {
        data
    })
}