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

let items = [];
let canImage;
let countGodCan = 0;
let obstacles = [];
let obstacleImage;
let car1;
let car2;
let countObstacle = 0;
let countItem = 0;

let screen = 0;
let score = 0;
let imagesScreen = [];
let imageActual = 1;
let next = false;

let gui;
let canSave = 0;

let poten = 50;
let potenPrevious = poten;
let arduinoDist = 0;

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
    car1 = loadImage('images/car1.png');
    car2 = loadImage('images/car2.png');
    gui = loadImage('images/gui.png');

    for (let i = 1; i < 17; i++) {
        imagesScreen.push(loadImage(`images/${i}.png`));
    }

    pj = new Player(pjX, pjY, mupiWidth, pjImageFront, pjImageRight, pjImageLeft);

}

function draw() {
    background(255);

    switch (screen) {
        case 0:
            image(imagesScreen[0], 0, 0);

            if (arduinoDist > 0 && arduinoDist < 30) {
                screen = 1;
            }
            break;
        case 1:
            image(imagesScreen[imageActual], 0, 0);

            if (frameCount % 240 === 0) {
                next = true;
            }
            if (potenPrevious !== poten && next) {
                imageActual++;
                potenPrevious = poten;
                next = false;
            }
            if (imageActual === 7) {
                screen = 2;
            }
            break;
        case 2:
            image(imagesScreen[7], 0, 0);

            setTimeout(() => {
                startMove = true;
            }, 3000);

            if (poten > 50 && startMove) {
                pj.moveRight();
            }

            if (poten < 50 && startMove) {
                pj.moveLeft();
            }

            randomItem();

            items.forEach(element => {
                element.show();
                element.move();
                if (element.near(pj.getX(), pj.getY()) && element.getType() === 0) {
                    canSave += 1;
                    score += 10;
                    items.splice(element, 1);
                }

                if (element.near(pj.getX(), pj.getY()) && element.getType() === 1) {
                    pj.loseLive();
                    score -= 20;
                    items.splice(element, 1);
                }
            });

            pj.show();
            image(gui, 0, 0);

            fill(255);
            textSize(40);
            text(`${canSave}/10`, 1025, 105);
            text(`x${pj.getLives()}`, 1300, 105);
            text(score, 790, 105)

            if (canSave === 10) {
                screen = 3;
            }

            if (pj.getLives() === 0) {
                screen = 4;
                score = 0;
            }

            break;

        case 3:
            image(imagesScreen[8], 0, 0);
            setTimeout(() => {
                screen = 5;
            }, 3000);
            break;

        case 4:
            image(imagesScreen[9], 0, 0);
            setTimeout(() => {
                screen = 5;
            }, 4000);
            break;

        case 5:
            image(imagesScreen[10], 0, 0);
            break;

        case 6:
            if (score > 70) {
                image(imagesScreen[11], 0, 0);

                if (frameCount % 300 === 0) {
                    screen = 7;
                }
            } else {
                image(imagesScreen[15], 0, 0);
            }
            break;

        case 7:
            image(imagesScreen[12], 0, 0);

            if (frameCount % 500 === 0) {
                screen = 8;
                imageActual = 13;
            }

            break;

        case 8:
            image(imagesScreen[imageActual], 0, 0);
            if (frameCount % 400 === 0) {
                screen = 9;
            }

            break;

        case 9:
            image(imagesScreen[14], 0, 0);

            break;
    }
}

socket.on('messageArduino', (arduinoMessage) => {

    poten = arduinoMessage.poten;
    arduinoDist = arduinoMessage.arduinoDist;

    //  console.log(poten);

});

socket.on('dataCollect', instructions => {
    let {
        sendInfo
    } = instructions;
    if (sendInfo) {
        screen = 6;

    }
})

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}

function randomItem() {
    if (frameCount % 150 === 0 && countItem <= 30) {
        const num = Math.round(random(1));
        const x = Math.floor(random(mupiWidth - 120));
        const y = -20;

        switch (num) {
            case 0:
                items.push(new Item(x, y, canImage, 76, 154, 0));
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
        countItem++;
    }
}

function randomCar() {

    let chooseCar = Math.round(random(1));
    const x = Math.floor(random(mupiWidth - 120));
    const y = -20;

    switch (chooseCar) {
        case 0:
            items.push(new Item(x, y, car1, 151, 237, 1));
            break;

        case 1:
            items.push(new Item(x, y, car2, 151, 237, 1));

            break;
    }
}

function changeScreenData() {
    socket.emit('data-screen', {
        data
    })
}