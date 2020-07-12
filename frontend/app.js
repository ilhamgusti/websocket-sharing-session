// initial app files

const io = require('socket.io-client');
const randomNameGenerator = require('random-animal-name-generator');

const socket = io('localhost:5001');

const msgerForm = get('.msger-inputarea');
const msgerChat = get('.msger-chat');
const msgInput = get('.msger-input');

const username = sessionStorage.getItem('username') || randomNameGenerator();

function get(selector, root = document) {
    return root.querySelector(selector);
}

socket.on('connect', () => {
    console.log('Connected to server');
})

socket.on('disconnect', () => {
    console.log('Terputus dari server');
})

// socket.emit('chatMessage', {
//     user: 'abdul',
//     message: 'yokk semangat yok'
// })


msgerForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const msgText = msgInput.value;
    if (!msgText) return;
    if (msgText === ' ') return;

    appendMessage(username, msgText, 'right', function () {
        socket.emit('chatMessage', {
            user: username,
            message: msgText
        })
    });
    msgInput.value = "";

})

function appendMessage(username, msgText, position = 'right', callback) {
    const msgHTML = `
    <div class="msg ${position}-msg">
                <div class="msg-img" style="background-image: url(https://image.flaticon.com/icons/svg/145/145867.svg)">
                </div>

                <div class="msg-bubble">
                    <div class="msg-info">
                        <div class="msg-info-name">${username}</div>
                        <div class="msg-info-time">${Date.now()}</div>
                    </div>

                    <div class="msg-text">
                        ${msgText}
                    </div>
                </div>
            </div>
            `;
    msgerChat.insertAdjacentHTML('beforeend', msgHTML);
    msgerChat.scrollTop += 500;

    if (callback) callback();
}


socket.on('message', data => {
    console.log(data);
    appendMessage(data.user, data.message, 'left')
})