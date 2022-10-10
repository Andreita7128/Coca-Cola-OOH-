let x = 200;
let y = 650;

let pj;

let collectable1 = 0;
let collectable2 = 0;

let redCollectable = [];
let greenCollectable = [];

let screen = 0;

function setup() {
  createCanvas(400, 700);
  pj = new Player(x, y);

  for (let i = 0; i < 3; i++) {
    redCollectable[i] = new Collectable((65 * i) + 30, -20);
    greenCollectable[i] = new Collectable((90 * i) + 40, -20);
  }
}

function draw() {
  background(10);

  if (screen === 0) {
    noStroke();

    fill(250);
    pj.show();

    fill(180, 10, 10);
    circle(300, 50, 15);
    text(`${collectable1}/2`, 310, 55);
    for (let i = 0; i < redCollectable.length; i++) {
      redCollectable[i].show();
      redCollectable[i].move();
      redCollectable[i].contact(pj.x, pj.y);

      if (redCollectable[i].trap) {
        collectable1++;
        redCollectable.splice(i, 1);
      }
    }

    fill(10, 180, 10);
    circle(350, 50, 15);
    text(`${collectable2}/2`, 360, 55);
    for (let i = 0; i < greenCollectable.length; i++) {
      greenCollectable[i].show();
      greenCollectable[i].move();
      greenCollectable[i].contact(pj.x, pj.y);

      if (greenCollectable[i].trap) {
        collectable2++;
        greenCollectable.splice(i, 1);
      }
    }

    if (collectable1 === 2 && collectable2 === 2) {
      screen = 1;
    }
  }

  if (screen === 1) {
    fill(250);
    textSize(50);
    textAlign(CENTER);
    text('WIN', 200, 350);
  }
}

function keyPressed() {
  if (keyCode === RIGHT_ARROW) {
    pj.moveRight();
  } else if (keyCode === LEFT_ARROW) {
    pj.moveLeft();
  }
}