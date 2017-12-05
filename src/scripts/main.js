const socket = io(`http://localhost:${process.env.PORT}`);
require("firebase/database");
const firebase = require('firebase/app').initializeApp({
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: process.env.FIREBASE_AUTH_DOMAIN,
    databaseURL: process.env.FIREBASE_DATABASE_URL,
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET
});

const database = firebase.database();

socket.on('connect', function() {
    console.log('$$$ SOCKET CONNECTED ON THE CLIENT SIDE');

    socket.on('listen_for_messages', function(conversation) {
        console.log('$$$ LISTENING ON THE CLIENT SIDE NOW', conversation);
        database.ref('/conversations').child(conversation)
            .orderByKey().limitToLast(1).on('child_added', function(snapshot) {
                console.log('$$$ HEARD A NEW MESSAGE WRITTEN', snapshot.val());
            });
    });
});

let active_conversation;

window.onload = function() {
    const search = document.querySelector('form[name*=search]');
    search.addEventListener('submit', handleSearchSubmitted);

    const current_connections = document.querySelectorAll('a[class*=conversations]');
    current_connections.forEach(function(connection) {
        connection.addEventListener('click', handleConnectionChosen);
    });

    const send_message = document.querySelector('button[id*=send]');
    send_message.addEventListener('click', handleSendMessage);
};

function handleSendMessage(evt) {
    evt.preventDefault();
    const message_text = document.querySelector('input[name*=message]');
    if (isEmpty(message_text.value)) {
        alert('Write a message to send or pick a conversation.');
    } else {
        socket.emit('write_message', message_text.value, active_conversation);
        const message_list = document.querySelector('div[id*=messages]');
        const message_sender = document.querySelector('span[name*=email]');
        const message = makeMessageElement(message_text.value, message_sender.textContent);

        message_list.appendChild(message);
        setTimeout(function() {message.classList.add('visible')}, 1);
        message_list.scrollTop = message_list.scrollHeight;
        message_text.value = "";
    }
}

function handleConnectionChosen(evt) {
    evt.preventDefault();
    const selected_user = evt.target;
    socket.emit('open_conversation', selected_user.textContent);
}

socket.on('show_conversation', function(data) {
    const message_list = document.querySelector('div[id*=messages]');
    clearMessages(message_list);
    message_list.appendChild(makeNodeWithType('span'));
    if (data.hasOwnProperty('history')) {
        alert(data.message);
        Object.keys(data.history).map(function(message_id) {
            const message = makeMessageElement(
                data.history[message_id].text,
                data.history[message_id].sender
            );
            message_list.appendChild(message);
            setTimeout(function() {message.classList.add('visible')}, 1);
        });
        message_list.scrollTop = message_list.scrollHeight;
    } else {
        console.log('$$$ SOMETHING WENT WRONG GETTING MESSAGE HISTORY');
    }
    active_conversation = data.active_conversation;
});

function handleSearchSubmitted(evt) {
    evt.preventDefault();

    const search_query = document.querySelector('input[name*=search]');

    if (isEmpty(search_query.value)) {
        console.log('$$$ user tried to submit empty search');
    } else {
        const request = new XMLHttpRequest();
        request.open('POST', '/connect', true);
        request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

        request.addEventListener('load', successfullyConnectUsers.bind(null, request));
        request.addEventListener('error', function(error) {
            console.log('$$$ FOUND AN ERROR IN THE REQUEST', error);
        });

        request.send(`search_query=${search_query.value}`);
    }
}

function successfullyConnectUsers(request) {
    const response = JSON.parse(request.response);
    console.log('$$$ HERE IS THE RESPONSE AFTER CONNECTING USERS', response);
    if (response.hasOwnProperty('error')) {
        alert(response.error);
    } else {
        // hacky non-sense to update the user stored in the session
        socket.emit('open_conversation', response.connection);

        const connections_list = document.querySelector('.mdl-navigation');
        const added_connection = makeNodeWithType('a', response.connection);

        added_connection.setAttribute('href', "");
        added_connection.classList.add('mdl-navigation__link');
        added_connection.addEventListener('click', handleConnectionChosen);
        connections_list.insertBefore(added_connection, connections_list.firstChild);

        alert(response.success);
    }
    document.querySelector('input[name=search]').value = "";
}

function makeMessageElement(message, sender) {
    const message_container = makeNodeWithType('div');
    const content = makeNodeWithType('div', message);
    const user = makeNodeWithType('div', sender);

    message_container.classList.add('message-container');
    content.classList.add('message');
    user.classList.add('sender');

    message_container.appendChild(content);
    message_container.appendChild(user);

    return message_container;
}

function makeNodeWithType(type) {
    let node = document.createElement(type);
    for (let index = 1; index < arguments.length; index += 1) {
        let child = arguments[index];

        if (typeof child === 'string') {
            child = document.createTextNode(child);
        }
        node.appendChild(child);
    }
    return node;
}

function clearMessages(element) {
    while (element.firstChild) {
        setTimeout(function() {element.firstChild.classList.remove('visible')}, 1);
        element.removeChild(element.firstChild);
    }
}

function isEmpty(value) {
    return value === undefined || value === '' || value === null;
}
