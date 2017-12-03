require('firebase/storage');
const firebase = require('firebase');

class Roomchata {
    constructor() {
        this.email_input = document.querySelector('input[name=login_email_text]');
        this.username_input = document.querySelector('input[name=login_username_text]');
        this.password_input = document.querySelector('input[name=login_password_text]');
        this.sign_in_button = document.querySelector('button[name=login_submit_button]');

        firebase.initializeApp({
            apiKey: process.env.FIREBASE_API_KEY,
            authDomain: process.env.FIREBASE_AUTH_DOMAIN,
            databaseURL: process.env.FIREBASE_DATABASE_URL,
            projectId: process.env.FIREBASE_PROJECT_ID,
            storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
            messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID
        });
        this.auth = firebase.auth();
        this.storage = firebase.storage();
        this.database = firebase.database();
        this.auth.onAuthStateChanged(this.onAuthStateChanged.bind(this));
    }

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
    // window.roomchata = new Roomchata();
};
