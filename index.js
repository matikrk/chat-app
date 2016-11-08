var app = require('express')();
var http = require('http').Server(app);

var io = require('socket.io')(http);

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/static/index.html');
});

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

var port = 8080;
http.listen(port, function() {
    console.log(`listening on *:${port}`);
});
