/* The external ip is determined by app.js and passed into the template. */
const webSocketHost = location.protocol === 'https:' ? 'wss://' : 'ws://';
const externalIp = window.wsLocation;
const webSocketUri = webSocketHost + externalIp + ':65080/chat';

const websocket = new WebSocket(webSocketUri);

websocket.onopen = function () {
    console.log('Connected');

};

websocket.onclose = function () {
    console.log('Closed');
};

websocket.onmessage = function (e) {
    console.log('Message received');
    const messages = document.getElementById('messages');
    const li = document.createElement('li');
    li.textContent = e.data;
    messages.appendChild(li);
};

websocket.onerror = function (e) {
    console.log('Error', e.data, e);
};


const submitForm = document.getElementById('submitForm');
const onSubmit = function (e) {
    e.preventDefault();
    const input = document.getElementById('textInput');
    const text = input.value;
    websocket.send(text);
    input.value = '';
};
submitForm.addEventListener('submit', onSubmit);