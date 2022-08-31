class Level {
    constructor(size) {
        this.level = [
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            [1, 0, 2, 0, 1, 1, 0, 3, 0, 1],
            [1, 0, 1, 0, 1, 1, 0, 1, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 1, 0, 1, 1, 0, 1, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 1, 1, 0, 1, 0, 1, 0, 1, 1],
            [1, 1, 1, 0, 1, 1, 1, 0, 1, 1],
            [1, 1, 1, 0, 0, 3, 0, 0, 1, 1],
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        ]
        this.size = size;
    }

    show() {
        for (let i = 0; i < 15; i++) {
            for (let j = 0; j < 10; j++) {
                if (this.level[i][j] === 0) {
                    fill(255)
                    stroke(10)
                }
                if (this.level[i][j] === 2) {
                    fill(10, 200, 10);
                } else if (this.level[i][j] === 3) {
                    fill(180, 10, 10);
                } else if (this.level[i][j] === 1) {
                    fill(10)
                    stroke(255)
                    //noStroke();
                }

                rect((j * this.size), (i * this.size), this.size)
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
        let result = false;
        if (this.level[pcCol][pcFil] === 2) {
            result = true;
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
        this.x = (fil * map.size) + 20;
        this.y = (col * map.size) + 20;
    }

    show() {
        circle(this.x, this.y, 20);
        // image(this.image1, this.x, this.y, 40, 60);
    }

    truePosition() {
        this.x = (this.fil * this.map.size) + 20;
        this.y = (this.col * this.map.size) + 20;
    }

    // moveUp() {
    //     console.log('up');
    //     console.log(this.map.canMove(this.fil, this.col + 1))
    //     if(this.map.canMove(this.fil, this.col + 1) === true){
    //         console.log('entra')
    //         this.col += 1;
    //         this.truePosition;
    //     }
    // }

    // moveDown() {
    //     if(this.map.canMove(this.fil, this.col - 1)) {
    //         this.col -= 1;
    //         this.truePosition();
    //     }
    // }

    // moveLeft() {
    //     if(this.map.canMove(this.fil - 1, this.col)) {
    //         this.fil -= 1;
    //         this.truePosition;
    //     }
    // }

    // moveRight() {
    //     if(this.map.canMove(this.fil + 1, this.col)) {
    //         this.fil += 1;
    //         this.truePosition;
    //     }
    // }

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

function setup() {
    frameRate(60);
    canvas = createCanvas(windowWidth, windowHeight);
    canvas.style('z-index', '-1');
    canvas.style('position', 'fixed');
    canvas.style('top', '0');
    canvas.style('right', '0');
    posX = (mapSize * 10)/2;
    posY = (mapSize * 15)/2;
    mupiWidth = windowWidth;
    mupiHeight = windowHeight;
    background(0);

    map = new Level(mapSize);
    pjImage = loadImage("images/pj.png");
    pj = new Player(pjImage, pjFil, pjCol, map);
}

function draw() {
    background(0, 5);

    switch (screen) {
        case 0:
            fill(255);
            textSize(30);
            textAlign(CENTER);
            text(`
            Reto Coca - Cola
            Escanea el QR`, posX, posY);
            break;


        case 1:
            map.show();
            fill(254, 0, 26);
            pj.show()
            if (map.win(pj.getFil(), pj.getCol())) {
                screen = 3
            }
            break;

        case 3:
            textAlign(CENTER);
            text(`
            Ganaste!!
            para reclamar tu recompensa
            por favor llena los siguientes datos`, posX, posY);
            let btn = createButton("llenar datos");
            btn.mousePressed(function () {
                screen++;
            })
            break;

            case 4:
                text('datos', posX, posY);
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