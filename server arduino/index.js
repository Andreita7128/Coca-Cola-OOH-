const express = require('express');
const { Server } = require('socket.io');
const { SerialPort, ReadlineParser } = require('serialport'); // *New: Importing Serialport package
const cors = require('cors');
const { FireStoreDB } = require("./firebase-config.js");
const PORT = 5050;

//⚙️ HTTP COMMUNICATION SETUP _________________________________________________
const app = express();
const MOBILE = express.static('public-mobile');
const MUPI = express.static('public-mupi');
const leadsCollection = new FireStoreDB('Leads')
const cuponesCollection = new FireStoreDB('Cupones')
app.use(cors({ origin: "*" }))
app.use('/mobile-display', MOBILE);
app.use('/mupi-display', MUPI);
app.use(express.json());
//============================================ END

//⚙️ SERIAL COMMUNICATION SETUP -------------------------------------------------
const protocolConfiguration = { // *New: Defining Serial configurations
    path: '/COM4', //*Change this COM# or usbmodem#####
    baudRate: 9600
};
const port = new SerialPort(protocolConfiguration);
const parser = port.pipe(new ReadlineParser);
//============================================ END

//⚙️ WEBSOCKET COMMUNICATION SETUP -------------------------------------------------
const httpServer = app.listen(PORT, () => {
    console.table(
        {
            'Mobile display:' : 'http://localhost:5050/mobile-display',
            'Mupi display:' : 'http://localhost:5050/mupi-display',
        }
    )
});
const ioServer = new Server(httpServer, { path: '/real-time' });
//============================================ END

/* 🔄 SERIAL COMMUNICATION WORKING___________________________________________
Listen to the 'data' event, arduinoData has the message inside*/

parser.on('data', (arduinoData) => {

    let dataArray = arduinoData.split(' ');

    let arduinoMessage = {
        poten: dataArray[0],
        arduinoDist: dataArray[1]
    }

    //console.log(arduinoMessage);

    ioServer.emit('messageArduino', arduinoMessage);
    
 
});

/* 🔄 WEBSOCKET COMMUNICATION __________________________________________

1) Create the socket methods to listen the events and emit a response
It should listen for directions and emit the incoming data.*/

ioServer.on('connection', (socket) => {

    socket.on('orderForArduino', (orderForArduino) => {
        //port.write
        console.log('point: ' + orderForArduino);
    });

    socket.on('dataCollect', sendInfo => {
        console.log(sendInfo);
        socket.broadcast.emit('dataCollect', sendInfo);
    })

});

//Aqui van los get y post

app.get('/leads', (request, response) => {
    timeStamp();
    leadsCollection.getCollection()
        .then((leads) => {
            console.log(leads);
            response.send(leads);
        })
})

app.get('/cupones', (request, response) => {
    timeStamp();
    cuponesCollection.getCollection()
        .then((leads) => {
            console.log(leads);
            response.send(leads);
        })
})  // cupones|
// :)
app.post('/add-new-lead', (request, response) => {
    timeStamp();
    console.log(request.body);
    request.body.timeStamp = timeStamp();
    leadsCollection.addNewDocument(request.body);
    response.status(200).end();
})

app.post('/add-new-cupon', (request, response) => {
    timeStamp();
    console.log(request.body);
    request.body.timeStamp = timeStamp();
    cuponesCollection.addNewDocument(request.body);
    response.status(200).end();
})

function timeStamp() {
    let date = new Date();
    let [month, day, year] = [date.getMonth() + 1, date.getDate(), date.getFullYear()];
    let [hour, minutes, seconds] = [date.getHours(), date.getMinutes(), date.getSeconds()];
    console.log(`${hour}:${minutes}:${seconds} - ${month}/${day}/${year}`);
    return `${hour}:${minutes}:${seconds} - ${month}/${day}/${year}`
}