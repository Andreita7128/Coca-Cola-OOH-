const express = require('express');
const { Server } = require('socket.io');
const { SerialPort, ReadlineParser } = require('serialport'); // *New: Importing Serialport package
const cors = require('cors');
const PORT = 5050;

//⚙️ HTTP COMMUNICATION SETUP _________________________________________________
const app = express();
const MOBILE = express.static('public-mobile');
const MUPI = express.static('public-mupi');
app.use('/mobile-display', MOBILE);
app.use('/mupi-display', MUPI);
app.use(express.json());
//============================================ END

//⚙️ SERIAL COMMUNICATION SETUP -------------------------------------------------
const protocolConfiguration = { // *New: Defining Serial configurations
    path: '/COM5', //*Change this COM# or usbmodem#####
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
        dist: dataArray[1]
    }

    console.log(arduinoMessage);

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

});