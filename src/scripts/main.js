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

window.onload = function() {
    console.log('$$$ RUNNING IN MAIN');

    const search = document.querySelector('form[name=search]');
    search.addEventListener('submit', handleSearchSubmitted);
};

function handleSearchSubmitted(evt) {
    evt.preventDefault();
    console.log('$$$ SEARCH WAS SUBMITTED');

    const search_query = document.querySelector('input[name=search]');

    if (isEmpty(search_query.value)) {
        console.log('$$$ user tried to submit empty search');
    } else {
        const request = new XMLHttpRequest();
        request.open('POST', '/room', true);
        request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

        request.addEventListener('load', function() {
            const response = JSON.parse(request.response);
            if (response.hasOwnProperty('error')) {
                alert(response.error);
            }
        });
        request.addEventListener('error', function(error) {
            console.log('$$$ FOUND AN ERROR IN THE REQUEST', error);
        });

        request.send(`search_query=${search_query.value}`);
    }
}

function isEmpty(value) {
    return value === undefined || value === '';
}
