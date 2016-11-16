const express = require('express');
const app = express();

// Use express-ws to enable web sockets.
require('express-ws')(app);

const connectedUsers = {};
const broadcastMsg = function (msg) {
    Object.values(connectedUsers).forEach(({ws}) => ws.send(msg));
};

app.ws('/chat', function (ws) {
    const user = (+new Date()).toString(36) + (~~(Math.random() * 1000)).toString(36);

    connectedUsers[user] = {ws, name: user};
    broadcastMsg(user + ' connected to chat');
    console.log(`user ${user} connected, ${Object.keys(connectedUsers).length} users connected`);

    ws.on('message', function (msg) {
        broadcastMsg(user + ' response: ' + msg);
    });

    ws.on('close', function () {
        console.log(`user ${user} close connection, ${Object.keys(connectedUsers).length} users connected`);
        delete connectedUsers[user];
        broadcastMsg(user + ' left chat');
    });

});

// Start the websocket server
const wsPort = 65080;
const wsServer = app.listen(wsPort, function () {
    console.log('Websocket server listening on port %s', wsServer.address().port);
});