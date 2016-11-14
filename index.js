const express = require('express')
const app = express();
const http = require('http').Server(app);
const request = require('request');

// Use express-ws to enable web sockets.
require('express-ws')(app);

app.use(express.static('public'));

//app.get('/', function(req, res) {
//    res.sendFile(__dirname + '/static/index.html');
//});


// [START external_ip]
// In order to use websockets on App Engine, you need to connect directly to
// application instance using the instance's public external IP. This IP can
// be obtained from the metadata server.
const METADATA_NETWORK_INTERFACE_URL = 'http://metadata/computeMetadata/v1/' +
    '/instance/network-interfaces/0/access-configs/0/external-ip';

function getExternalIp(cb) {
    const options = {
        url: METADATA_NETWORK_INTERFACE_URL,
        headers: {
            'Metadata-Flavor': 'Google'
        }
    };

    request(options, function(err, resp, body) {
        if (err || resp.statusCode !== 200) {
            console.log('Error while talking to metadata server, assuming localhost');
            return cb('localhost');
        }
        return cb(body);
    });
}
// [END external_ip]

app.get('/wsLocation.js', function(req, res) {
    //  const location = '\'localhost\'';
    getExternalIp(function(location) {
        const script = `window.wsLocation = \'${location}\';`;
        res.set('Content-Type', 'text/javascript');
        res.send(script)
    });
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
