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

io.on('connection', (socket) => {
    console.log(socket.id);

    socket.on('device-size', deviceSize => {
        socket.broadcast.emit('mupi-size', deviceSize);
    })

    socket.on('mobile-instructions', move => {
        console.log(move);
        socket.broadcast.emit('mupi-instructions', move);
    })
})


