const NGROK = `https://${window.location.hostname}`;
console.log('Server IP: ', NGROK);
let socket = io(NGROK, {
    path: '/real-time'
});

let isTouched = false;

let nameInput;
let lastNameInput;
let phoneInput;

let screenData;
let send;
let sendI;
let sendInfo = false;
let addPos = 70;

let userdata = {
    name: undefined,
    lastName: undefined,
    phone: undefined
};

function setup() {
    frameRate(60);
    canvas = createCanvas(windowWidth, windowHeight);
    canvas.style('z-index', '-1');
    canvas.style('position', 'fixed');
    canvas.style('top', '0');
    canvas.style('right', '0');
    positionX = windowWidth / 2;
    positionY = windowHeight / 2;
    background(0);
    angleMode(DEGREES);


    screenData = loadImage('images/1.png')

    sendI = loadImage('images/send.png')

    send = new Button(positionX - 53, positionY + addPos, sendI);

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
    image(screenData, 0, 0);
    textSize(20)
    fill(250);
    text('Nombre', windowWidth / 2 - 100, windowHeight / 2 - 122);
    text('Apellido', windowWidth / 2 - 100, windowHeight / 2 - 57);
    text('Celular', windowWidth / 2 - 100, windowHeight / 2 + 7);
    nameInput.style('display', 'block');
    lastNameInput.style('display', 'block');
    phoneInput.style('display', 'block');
    if (userdata.name !== undefined && userdata.lastName !== undefined && userdata.phone !== undefined) {
        send.show2();
    }
}
/*
function saveUserdata() {
    postData(NGROK + "/user", userdata).then((data) => {
        console.log(data);
    });
    console.log(userdata);
}*/

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

    if(send.click2(107,41)){
        console.log('click')
        // saveUserdata();
        sendInfo = true;
        socket.emit('dataCollect', {sendInfo});
    }

}

function touchEnded() {
    isTouched = false;

}
/*
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
  };*/