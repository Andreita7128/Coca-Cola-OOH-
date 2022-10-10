class Player {
    constructor(x, y) {
       // this.image1 = image1;
        this.x = x;
        this.y = y;
        this.d = 30;
    }

    show() {
        circle(this.x, this.y, this.d);
    }
}

const NGROK = `https://${window.location.hostname}`;
let socket = io(NGROK, {
    path: '/real-time'
});
console.log('Server IP', NGROK);

let posX, posY = 0;
let move;
let deviceWidth, deviceHeight = 0;
let mupiWidht, mupiHeight = 0;
let mapSize = 40;
let pj;
let pjX = 200;
let pjY = 500;

let screen = 0;

let screen0;
let screen1;
let screen2;
let screen3;


let win = false;
let data = false

let winImage;
let loseImage;


function setup() {
    frameRate(60);
    canvas = createCanvas(windowWidth, windowHeight);
    canvas.style('z-index', '-1');
    canvas.style('position', 'fixed');
    canvas.style('top', '0');
    canvas.style('right', '0');
    posX = (mapSize * 10) / 2;
    posY = (mapSize * 15) / 2;
    mupiWidth = windowWidth;
    mupiHeight = windowHeight;
    background(255);

    screen0 = loadImage('images/mupi1.png');
    screen1 = loadImage('images/mupi2.png');
    screen2 = loadImage('images/game.png');
    screen3 = loadImage('images/data.png');

    winImage = loadImage('images/win.png');
    loseImage = loadImage('images/lose.png');

    pj = new Player(pjX, pjY);

}

function draw() {
    background(255);
    console.log(screen)

    switch (screen) {
        case 0:
            image(screen0, 0, 0, 400, 700);
            break;
        case 1:
            image(screen1, 0, 0, 493.71, 700);
            break;
        case 2:
            image(screen2, 0, 0);
            fill(254, 0, 26);
            pj.show()

            socket.on('positions', (positions) => {
    
                character.x = map(positions.x, 100, 0, 0, windowWidth);
                character.y = map(positions.y, 100, 0, 0, windowHeight);
            
            });
            
            if (map.win(pj.getFil(), pj.getCol())) {
                win = true;
                screen++;
                data = true;
                changeScreenData();
            } else if (map.win(pj.getFil(), pj.getCol()) === false) {
                screen++;
                data = true;
                changeScreenData();
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

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}

socket.on('mupi-size', deviceSize => {
    let {
        windowWidth,
        windowHeight
    } = deviceSize;
    deviceWidth = windowWidth;
    deviceHeight = windowHeight;
    screen = 1;
    console.log(`User is using a smartphone size of ${deviceWidth} and ${deviceHeight}`);
});

socket.on('mupi-instructions', instructions => {
    let {
        move
    } = instructions;
    switch (move) {
        case 'up':
            if (map.canMove(pj.getFil(), pj.getCol() - 1)) {
                pj.setCol(pj.getCol() - 1);
                pj.truePosition();
            }
            break;
        case 'down':
            if (map.canMove(pj.getFil(), pj.getCol() + 1)) {
                pj.setCol(pj.getCol() + 1);
                pj.truePosition();
            }
            break;
        case 'left':
            if (map.canMove(pj.getFil() - 1, pj.getCol())) {
                pj.setFil(pj.getFil() - 1);
                pj.truePosition();
            }
            break;
        case 'right':
            if (map.canMove(pj.getFil() + 1, pj.getCol())) {
                pj.setFil(pj.getFil() + 1);
                pj.truePosition();
                break;
            }
    }
})

socket.on('press-play', instructions => {
    let {
        playPress
    } = instructions;
    if (playPress) {
        screen = 2;
    }
})

socket.on('reward', instructions => {
    let {
        sendInfo
    } = instructions;
    console.log(win)
    if (sendInfo && screen === 3) {
        console.log(sendInfo)
        if (win !== false) {
            screen = 4;
        } else {
            screen = 5;
        }
    }
})

function changeScreenData() {
    socket.emit('data-screen', {
        data
    })
}