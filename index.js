var express = require('express')
var app = express();
var http = require('http').Server(app);

// Use express-ws to enable web sockets.
require('express-ws')(app);

app.use(express.static('public'));
//app.get('/', function(req, res) {
//    res.sendFile(__dirname + '/static/index.html');
//});

app.get('/wsLocation.js', function(req, res) {
    var location = '\'localhost\'';
    var script = `window.wsLocation = ${location};`;
    res.set('Content-Type', 'text/javascript');
    res.send(script)
});

var connectedWs = {};
var broadcastMsg = function(msg) {
        Object.values(connectedWs).forEach(ws => ws.send(msg));
    }
    // A simple echo service.
app.ws('/chat', function(ws) {
    var user = (+new Date() + ~~(Math.random() * 1000)).toString(36);

    connectedWs[user] = ws;
    ws.send(user + 'open');
    console.log(`user ${user} connected, ${Object.keys(connectedWs).length} users connected`);

    ws.on('message', function(msg) {
        broadcastMsg(msg);
        //  ws.send(user + 'response: ' + msg);
    });
    ws.on('close', function() {
        console.log(`user ${user} close connection, ${Object.keys(connectedWs).length} users connected`);
        delete connectedWs[user]
    });

});

// Start the websocket server
var wsServer = app.listen('65080', function() {
    console.log('Websocket server listening on port %s', wsServer.address().port);
});


var port = process.env.PORT || 8080;
http.listen(port, function() {
    console.log(`listening on *:${port}`);
});
