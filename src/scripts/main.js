class Roomchata {

    loadMessages() {
        this.messages_reference = this.database.ref('messages');
        this.messages_reference.off();

        const set_message = function(data) {
            const value = data.val();
            this.displayMessage(data.key, value.name, value.text, value.photoUrl, value.imageUrl);
        }.bind(this);

        this.messages_reference.limitToLast(10).on('child_added', set_message);
        this.messages_reference.limitToLast(10).on('child_changed', set_message);
    }

    saveTextMessage(evt) {
        evt.preventDefault();

        if (this.message_input.value && this.checkSignedInWithMessage()) {
            const current_user = this.auth.currentUser;

            this.messages_reference.push({
                name: current_user.displayName,
                text: this.message_input.value,
                photoUrl: current_user.photoURL,
            }).then(function() {
                this.message_input.value = '';
                this.toggleButton();
            }.bind(this)).catch(function(error) {
                console.log('$$$ could not add message to the database', error);
            });
        }
    }
}

const socket = io();

window.onload = function() {
    console.log('$$$ RUNNING IN MAIN');

    const search = document.querySelector('form[name=search]');
    search.addEventListener('submit', handleSearchSubmitted);

    const current_connections = document.querySelectorAll('a[class*=conversations]');
    current_connections.forEach(function(connection) {
        connection.addEventListener('click', handleConnectionChosen);
    });
};

function handleConnectionChosen(evt) {
    evt.preventDefault();
    const selected_user = evt.target;
    socket.emit('open_conversation', selected_user.textContent);
}

socket.on('show_conversation', function(data) {
    const message_list = document.querySelector('div[id*=messages]');
    clearElement(message_list);
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
        alert(data.message);
    }
});

function handleSearchSubmitted(evt) {
    evt.preventDefault();
    console.log('$$$ SEARCH WAS SUBMITTED');

    const search_query = document.querySelector('input[name=search]');

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

function clearElement(element) {
    while (element.firstChild) {
        element.removeChild(element.firstChild);
    }
}

function isEmpty(value) {
    return value === undefined || value === '';
}
