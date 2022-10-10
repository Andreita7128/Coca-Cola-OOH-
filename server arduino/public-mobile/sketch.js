class Button {
    constructor(x, y, image) {
        this.x = x;
        this.y = y;
        this.image = image;
        this.size = 60;
    }

    show() {
        imageMode(CENTER);
        image(this.image, this.x, this.y);
        imageMode(CORNER);
    }

    show2() {
        image(this.image, this.x, this.y);
    }

    click() {
        return dist(this.x, this.y, mouseX, mouseY) < this.size / 2
    }

    click2(b, h) {
        return mouseX > this.x && mouseX < (this.x + b) && mouseY > this.y && mouseY < (this.y + h);
    }
}

const NGROK = `https://${window.location.hostname}`;
console.log('Server IP: ', NGROK);
let socket = io(NGROK, {
    path: '/real-time'
});

let isTouched = false;
let addPos = 70;
let play;
let playI;
let playPress = false;
let screenMobile = 0;

let nameInput;
let lastNameInput;
let phoneInput;
let send;
let sendI;
let sendInfo = false;

let mark;
let cocacola;

let userdata = {name: undefined, lastName: undefined, phone: undefined};

function setup() {
    frameRate(1);
    canvas = createCanvas(windowWidth, windowHeight);
    canvas.style('z-index', '-1');
    canvas.style('position', 'fixed');
    canvas.style('top', '0');
    canvas.style('right', '0');
    positionX = windowWidth / 2;
    positionY = windowHeight / 2;
    background(0);
    angleMode(DEGREES);

   
    sendI = loadImage('images/send.png')

    send = new Button(positionX - 53, positionY + addPos, sendI);

    mark = loadImage('images/markMobile.png');
    cocacola = loadImage('images/logoMobile.png');

    socket.emit('device-size', {
        windowWidth,
        windowHeight
    });

    nameInput = createInput('');
    nameInput.position(windowWidth / 2 - 100, windowHeight / 2 - 115);
    nameInput.size(200);
    nameInput.input(nameEvent);
    nameInput.style('display', 'none');

    lastNameInput = createInput('');
    lastNameInput.position(windowWidth / 2 - 100, windowHeight / 2 - 50);
    lastNameInput.size(200);
    lastNameInput.input(lastNameEvent);
    lastNameInput.style('display', 'none');

    phoneInput = createInput('');
    phoneInput.position(windowWidth / 2 - 100, windowHeight / 2 + 15);
    phoneInput.size(200);
    phoneInput.input(phoneEvent);
    phoneInput.style('display', 'none');

}

function draw() {
    background(0, 5);
    fill(254, 0, 26);
    console.log(screenMobile);
    fill(255);
    noStroke();
    rect(0, 0, windowWidth, windowHeight)
    image(mark, 0, windowHeight/2 + 150,windowWidth);
    image(cocacola, windowWidth/2 + 100, windowHeight/2 + 200)

    
}

function saveUserdata() {
    postData(NGROK + "/user", userdata).then((data) => {
        console.log(data);
    });
    console.log(userdata);
}

function nameEvent() {
    userdata.name = this.value();
}

function lastNameEvent() {
    userdata.lastName = this.value();
}

function phoneEvent() {
    userdata.phone = this.value();
}

function touchStarted() {
    isTouched = true;
    if (screenMobile === 0 && play.click2(107, 41)) {
        playPress = true;
    }
    if (screenMobile === 0 && playPress) {
        screenMobile++;
        socket.emit('press-play', {
            playPress
        })
    }
    if(send.click2(107,41)){
        console.log('click')
        saveUserdata();
        sendInfo = true;
        socket.emit('reward', {sendInfo});
    }
}

function touchEnded() {
    isTouched = false;

}

const postData = async (url = "", data = {}) => {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(data),
    });
    return data;
  };