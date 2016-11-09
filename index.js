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
const wsServer = app.listen('65080', function() {
    console.log('Websocket server listening on port %s', wsServer.address().port);
});


const port = process.env.PORT || 8080;
http.listen(port, function() {
    console.log(`listening on *:${port}`);
});
