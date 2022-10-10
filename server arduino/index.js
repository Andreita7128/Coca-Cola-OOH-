const express = require('express');
const { Server } = require('socket.io');
const PORT = 5050;
const SERVER_IP = '192.168.1.83'

const app = express();
app.use(express.json())
app.use('/app', express.static('public-mobile'));
app.use('/mupi', express.static('public-mupi'))

const httpServer = app.listen(PORT, () => {
    console.log(`http://${SERVER_IP}:${PORT}/app`);
    console.log(`http://${SERVER_IP}:${PORT}/mupi`)
})

const io = new Server(httpServer, { path: '/real-time' });

let characterMessage = {
    x: 0
};

let btnPressed = false; 

io.on('connection', (socket) => {
    console.log(socket.id);

    socket.on('device-size', deviceSize => {
        socket.broadcast.emit('mupi-size', deviceSize);
    })


    socket.broadcast.emit('positions', characterMessage);
})

const { SerialPort, ReadlineParser } = require('serialport');
const protocolConfiguration = {
    path: '/COM6',
    baudRate: 9600
}

const port = new SerialPort(protocolConfiguration);
const parser = port.pipe(new ReadlineParser);

parser.on('data', (data) => {
    console.log(data);
    let dataArray = data.split(' ');

    let message = {
        actionA : dataArray[0],
        actionB : dataArray[1],
        signal : parseInt(dataArray[2]),

    }

    console.table(message);

} )


