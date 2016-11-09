


/* The external ip is determined by app.js and passed into the template. */
var webSocketHost = location.protocol === 'https:' ? 'wss://' : 'ws://';
//var externalIp = $('body').data('external-ip');
var externalIp = window.wsLocation;
var webSocketUri = webSocketHost + externalIp + ':65080/chat';

var websocket = new WebSocket(webSocketUri);

websocket.onopen = function() {
    console.log('Connected');
};

websocket.onclose = function() {
    console.log('Closed');
};

websocket.onmessage = function(e) {
    console.log('Message received');
    $('#messages').append($('<li>').text(e.data));

};

websocket.onerror = function(e) {
    console.log('Error', e.data , e);
};


$('form').submit(function() {
    var text = $('#m').val();
    websocket.send('test')
    $('#m').val('');
    return false;
});
