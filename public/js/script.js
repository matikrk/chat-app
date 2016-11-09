/* The external ip is determined by app.js and passed into the template. */
const webSocketHost = location.protocol === 'https:' ? 'wss://' : 'ws://';
//const externalIp = $('body').data('external-ip');
const externalIp = window.wsLocation;
const webSocketUri = webSocketHost + externalIp + ':65080/chat';

const websocket = new WebSocket(webSocketUri);

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
    console.log('Error', e.data, e);
};

$('form').submit(function() {
    const text = $('#m').val();
    websocket.send(text)
    $('#m').val('');
    return false;
});
