const express = require('express')
const app = express();
const http = require('http').Server(app);

// Use express-ws to enable web sockets.
require('express-ws')(app);

app.use(express.static('public'));
//app.get('/', function(req, res) {
//    res.sendFile(__dirname + '/static/index.html');
//});

app.get('/wsLocation.js', function(req, res) {
    const location = '\'localhost\'';
    const script = `window.wsLocation = ${location};`;
    res.set('Content-Type', 'text/javascript');
    res.send(script)
});

const connectedWs = {};
const broadcastMsg = function(msg) {
    Object.values(connectedWs).forEach(ws => ws.send(msg));
};

app.ws('/chat', function(ws) {
    const user = (+new Date() + ~~(Math.random() * 1000)).toString(36);

    connectedWs[user] = ws;
    broadcastMsg(user + ' connected to chat');
    console.log(`user ${user} connected, ${Object.keys(connectedWs).length} users connected`);

    ws.on('message', function(msg) {
        broadcastMsg(user + ' response: ' + msg);
    });
    ws.on('close', function() {
        console.log(`user ${user} close connection, ${Object.keys(connectedWs).length} users connected`);
        delete connectedWs[user];
        broadcastMsg(user + ' left chat');

    });

});

// Start the websocket server
const wsPort = 65080;
const wsServer = app.listen(wsPort, function() {
    console.log('Websocket server listening on port %s', wsServer.address().port);
});

const httpPort = process.env.PORT || 8080;
http.listen(httpPort, function() {
    console.log(`listening on *:${httpPort}`);
});
