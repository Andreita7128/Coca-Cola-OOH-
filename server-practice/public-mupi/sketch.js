class Level {
    constructor(size, mapTiles, rightAnswer, answ2, answ3, water) {
        this.level = [
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            [1, 0, 2, 0, 1, 1, 1, 0, 3, 0, 1],
            [1, 5, 1, 5, 1, 1, 1, 5, 1, 5, 1],
            [1, 0, 5, 0, 5, 0, 5, 0, 5, 0, 1],
            [1, 5, 1, 5, 1, 1, 1, 5, 1, 5, 1],
            [1, 0, 5, 0, 5, 0, 5, 0, 5, 0, 1],
            [1, 1, 1, 5, 1, 0, 1, 5, 1, 1, 1],
            [1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1],
            [1, 1, 1, 5, 0, 4, 0, 5, 1, 1, 1],
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        ]
        this.size = size;
        this.mapTiles = mapTiles;
        this.rightAnswer = rightAnswer;
        this.answ2 = answ2;
        this.answ3 = answ3;
        this.water = water;
    }

    show() {
        for (let i = 0; i < 15; i++) {
            for (let j = 0; j < 11; j++) {
                if (this.level[i][j] === 0) {
                    image(this.mapTiles, (j * this.size) + 27, (i * this.size));
                } else if (this.level[i][j] === 2) {
                    image(this.rightAnswer, (j * this.size) + 27, (i * this.size));
                } else if (this.level[i][j] === 3) {
                    image(this.answ2, (j * this.size) + 27, (i * this.size));
                } else if (this.level[i][j] === 4) {
                    image(this.answ3, (j * this.size) + 27, (i * this.size));
                } else if(this.level[i][j] === 5){
                    image(this.water, (j * this.size) + 27, (i * this.size));
                }
                else {
                    noStroke();
                }
                fill(255, 0);
                rect((j * this.size) + 27, (i * this.size), this.size)
            }
        }
    }

    canMove(pcFil, pcCol) {
        let result = true;
        switch (this.level[pcCol][pcFil]) {
            case 1:
                result = false
                break;
        }
        return result;
    }

    win(pcFil, pcCol) {
        let result = null;
        if (this.level[pcCol][pcFil] === 2) {
            result = true;
        } else if (this.level[pcCol][pcFil] !== 0 && this.level[pcCol][pcFil] !== 2 && this.level[pcCol][pcFil] !== 5) {
            result = false;
        }
        return result;
    }
}

class Player {
    constructor(image1, fil, col, map) {
        this.image1 = image1;
        this.fil = fil;
        this.col = col;
        this.map = map;
        this.x = (fil * map.size) + 27;
        this.y = (col * map.size) - map.size;
    }

    show() {
        image(this.image1, this.x, this.y);
    }

    truePosition() {
        this.x = (this.fil * this.map.size) + 27;
        this.y = (this.col * this.map.size) - map.size;
    }

    getFil() {
        return this.fil;
    }

    getCol() {
        return this.col;
    }

    setFil(nfil) {
        this.fil = nfil;
    }

    setCol(ncol) {
        this.col = ncol;
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
let pjImage;
let pjFil = 5;
let pjCol = 8;

let map;
let screen = 0;

let tiles;
let rightColor;
let color2;
let color3;
let water;
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

    tiles = loadImage('images/map.png');
    rightColor = loadImage('images/answer1.png');
    color2 = loadImage('images/answer2.png');
    color3 = loadImage('images/answer3.png');
    water = loadImage('images/water.png');
    pjImage = loadImage('images/Bear.png');
    screen0 = loadImage('images/mupi1.png');
    screen1 = loadImage('images/mupi2.png');
    screen2 = loadImage('images/game.png');
    screen3 = loadImage('images/data.png');

    winImage = loadImage('images/win.png');
    loseImage = loadImage('images/lose.png');

    map = new Level(mapSize, tiles, rightColor, color2, color3, water);
    pj = new Player(pjImage, pjFil, pjCol, map);

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
            map.show();
            fill(254, 0, 26);
            pj.show()
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