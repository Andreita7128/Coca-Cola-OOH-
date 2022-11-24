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

let screen = "Home";
let score = 0;
let imagesScreen = [];
let imageActual = 1;
let next = false;

let gui;
let canSave = 0;

let poten = 50;
let potenPrevious = poten;
let arduinoDist = 0;

let startGif = true;
let gifStart;

let instructions1 = true;

function preload() {}

function setup() {
    frameRate(60);
    createCanvas(mupiWidth, mupiHeight);

    pjX = mupiWidth / 2;
    pjY = mupiHeight - 407;
    pjImageFront = loadImage('images/carFront.png');

    canImage = loadImage('images/canGod.png');
    car1 = loadImage('images/car1.png');
    car2 = loadImage('images/car2.png');
    gui = loadImage('images/gui.png');
    gifStart = loadImage('images/start.png')

    for (let i = 1; i < 14; i++) {
        imagesScreen.push(loadImage(`images/${i}.png`));
    }

    pj = new Player(pjX, pjY, mupiWidth, pjImageFront);
}

function draw() {
    background(255);

    switch (screen) {
        case "Home":
            image(imagesScreen[0], 0, 0);

            if (arduinoDist > 0 && arduinoDist < 30) {
                screen = "Game";
            }
            break;
        case "Game":
            let potenValueMedium = 25;
            image(imagesScreen[1], 0, 0);

            if (instructions1) {
                imageMode(CENTER)
                image(imagesScreen[10], mupiWidth / 2, mupiHeight / 2)
                imageMode(CORNER)
            }
            setTimeout(() => {
                instructions1 = false
                startMove = true;
            }, 4000);

            if (startGif) {
                imageMode(CENTER)
                image(gifStart, mupiWidth / 2, mupiHeight / 2)
                imageMode(CORNER)
            }
            // setTimeout(() => {
            //     startMove = true;
            // }, 3000);

            if (poten > potenValueMedium && startMove) {
                pj.moveRight();
            }

            if (poten < potenValueMedium && startMove) {
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
            if (startMove) {
                pj.show();
            }
            image(gui, 0, 0);

            fill(255);
            textSize(40);
            text(`${canSave}/10`, 1025, 105);
            text(`x${pj.getLives()}`, 1300, 105);
            text(score, 790, 105)

            if (canSave === 10) {
                screen = "Finish";
            }

            if (pj.getLives() === 0) {
                screen = "Lost";
                score = 0;
            }

            break;

        case "Finish":
            image(imagesScreen[2], 0, 0);
            setTimeout(() => {
                screen = "Scan";
            }, 3000);
            break;

        case "Lost":
            image(imagesScreen[3], 0, 0);
            setTimeout(() => {
                screen = "Scan";
            }, 4000);
            break;

        case "Scan":
            image(imagesScreen[4], 0, 0);
            break;

        case "Win":
            if (score > 70) {
                image(imagesScreen[5], 0, 0);

                if (frameCount % 300 === 0) {
                    screen = "Photo";
                }
            } else {
                image(imagesScreen[9], 0, 0);
            }
            break;

        case "Photo":
            image(imagesScreen[6], 0, 0);

            if (frameCount % 500 === 0) {
                screen = "Create";
                imageActual = 10;
            }

            break;

        case "Create":
            image(imagesScreen[7], 0, 0);
            if (frameCount % 400 === 0) {
                screen = "Reward";
            }

            break;

        case "Reward":
            image(imagesScreen[8], 0, 0);

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
        screen = "Win";

    }
})

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}

function randomItem() {
    if (frameCount % 150 === 0 && countItem <= 30) {
        const num = Math.round(random(1));
        const x = Math.floor(random(mupiWidth - 300));
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