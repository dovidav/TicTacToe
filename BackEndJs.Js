//var app = require('express')();
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var user1 = '', user2 = '';

app.use(express.static(__dirname)); //This makes the css and client side js available

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
});


io.on('connection', function (socket) {
    if(user1==''){
        user1 = socket.client.id;
        //io.sockets.broadcast.emit('newconnection','X');
        socket.broadcast.emit('newconnection','X');
        console.log('X connected with id ' + socket.client.id);
    } else if(user2=='') {
        user2=socket.client.id;
        // io.sockets.broadcast.emit('newconnection','O');
        socket.broadcast.emit('newconnection','O');
        console.log('O connected with id ' + socket.client.id);
    } else {
        io.sockets.connected[socket.client.id].emit('newconnection','Full');
    }

    socket.on('disconnect', function () {
        if(user1==socket.client.id){
            socket.broadcast.emit('disconnected','X');
            console.log('X with id ' + socket.client.id + ' disconnected');
        } else if (user2==socket.client.id){
            socket.broadcast.emit('disconnected','O');
            console.log('O with id ' + socket.client.id + ' disconnected');
        }
    });
    socket.on('selectbox', function (msg) {
        if(user1==socket.client.id){
            socket.broadcast.emit('boxselected','X', msg);
            console.log('X with id ' + socket.client.id + ' selected ' + msg);
        } else if (user2==socket.client.id){
            socket.broadcast.emit('boxselected','O', msg);
            console.log('O with id ' + socket.client.id + ' selected ' + msg);
        }
    });
});
http.listen(3000, function () {
    console.log('listening on *:3000');
});