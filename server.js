const express = require('express');
const Bundler = require('parcel-bundler');
const http = require('http');
const PORT = 5001;
let app = express();

let bundler = new Bundler('./frontend/chat.html')
app.use(bundler.middleware())

const server = http.createServer(app);
const io = require('socket.io')(server);


server.listen(PORT, () => {
    console.log('server running on port: ' + PORT)
});


io.on('connect', socket =>{
    console.log('User connect ke server');

    socket.on('disconnect', () => {
        console.log('User Terputus dari server');
    })

    socket.on('chatMessage', data => {
        socket.broadcast.emit('message', data);
        console.log(data);
    })
})






