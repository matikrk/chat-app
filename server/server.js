const express = require('express');
const app = express();

// Use express-ws to enable web sockets.
require('express-ws')(app);

const connectedUsers = {};
const broadcastMsg = function (msg) {
    Object.values(connectedUsers).forEach(({ws}) => ws.send(msg));
};

const eventType = {
    MESSAGE: 'MESSAGE',
    TYPING: 'TYPING',
};

app.ws('/chat', function (ws) {
    const user = (+new Date()).toString(36) + (~~(Math.random() * 1000)).toString(36);

    connectedUsers[user] = {ws, name: user};

    broadcastMsg(JSON.stringify({
        event: eventType.MESSAGE,
        text: `User ${user} enter to chat`,
        user: 'System'
    }));

    console.log(`user ${user} connected, ${Object.keys(connectedUsers).length} users connected`);

    ws.on('message', function (msg) {

        let data;
        try {
            data = JSON.parse(msg);
        } catch (e) {
            console.error('Can\'t parse message: ' + msg)
            return;
        }

        switch (data.event) {
            case eventType.MESSAGE: {
                handleNewMessage(data,user);
                break;
            }
            case        eventType.TYPING: {
                handleUserTyping(data);
                break;
            }
            default: {
                console.warn('Not known event type');
            }
        }

    });


    ws.on('close', function () {
        console.log(`user ${user} close connection, ${Object.keys(connectedUsers).length} users connected`);
        delete connectedUsers[user];
        broadcastMsg(JSON.stringify({
            event: eventType.MESSAGE,
            text: `User ${user} quit from chat`,
            user: 'System'
        }));
    });

    const handleNewMessage=function(data,user){
        broadcastMsg(JSON.stringify({
            event: eventType.MESSAGE,
            text: data.text,
            user: user
        }));
    };
    const handleUserTyping=function(){};
});

// Start the websocket server
const wsPort = 65080;
const wsServer = app.listen(wsPort, function () {
    console.log('Websocket server listening on port %s', wsServer.address().port);
});