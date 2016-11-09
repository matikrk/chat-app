var express = require('express')
var app = express();
var http = require('http').Server(app);

var path = require('path');

var io = require('socket.io')(http);

app.use(express.static(path.join(__dirname, 'public')));
//app.get('/', function(req, res) {
//    res.sendFile(__dirname + '/static/index.html');
//});
io.on('connection', function(socket) {
    var user = 'user' + ~~(Math.random() * 100);

    console.log(`user ${user} connected`);

    socket.on('chat message', function(msg) {
      io.emit('chat message', msg);
    });

    socket.on('disconnect', function() {
        console.log(`user ${user} disconnected`);
    });
});

var port = process.env.PORT || 8080;
http.listen(port, function() {
    console.log(`listening on *:${port}`);
});
