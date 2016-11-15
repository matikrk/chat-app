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
const eventType = {
    MESSAGE: 'MESSAGE',
    TYPING: 'TYPING',
};

websocket.onmessage = function (e) {
    console.log('Message received');
    let data;
    try {
        data = JSON.parse(e.data);
    } catch (e) {
        console.error('Can\'t parse message: ' + e.data)
    }
    switch (data.event) {
        case eventType.MESSAGE: {
            handleNewMessage(data);
            break;
        }
        case eventType.TYPING: {
            handleUserTyping(data);
            break;
        }
        default: {
            console.warn('Not known event type');
        }
    }
};

const handleNewMessage = function ({user, text}) {
    const messages = document.getElementById('messages');
    const li = document.createElement('li');
    const div = [document.createElement('div'), document.createElement('div')];
    div[0].textContent = user;
    div[0].className = 'user';
    div[1].textContent = text;
    div[1].className = 'msg';

    li.appendChild(div[0]);
    li.appendChild(div[1]);
    messages.appendChild(li);
};
const handleUserTyping = function ({user}) {
    console.log(`user ${user} is typing`)
};

websocket.onerror = function (e) {
    console.log('Error', e.data, e);
};


const submitForm = document.getElementById('submitForm');
const onSubmit = function (e) {
    e.preventDefault();
     const input = document.getElementById('textInput');
    const text = input.value;
    websocket.send(JSON.stringify({
        event: eventType.MESSAGE,
        text: text
    }));
    input.value = '';
};
submitForm.addEventListener('submit', onSubmit);