require('firebase/storage');
const firebase = require('firebase');

class Roomchata {
    constructor() {
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
        this.auth.onAuthStateChanged(this.onAuthStateChanged().bind(this));
    }

    signIn(email, password) {
        if (email.split('@').length !== 2) {
            alert('Please enter a valid email.');
        } else {
            this.auth().signInWithEmailAndPassword(email, password).catch(function(error) {
                alert(error.message);
            });
        }
    }

    signOut() {
        this.auth.signOut();
    }

    onAuthStateChanged(user) {
        if (user) {
            let profile_pic = user.photoURL;
            let user_name = user.displayName;

            // do stuff to update the client side's profile picture and username

            this.loadMessages();
            this.saveMessagingDeviceToken();
        } else {
            this.userPic.setAttribute('hidden', 'true');
            this.userName.setAttribute('hidden', 'true');
            this.signOutButton.setAttribute('hidden', 'true');
            this.signInButton.removeAttribute('hidden');
        }
    }

    checkSignedInWithMessage() {
        if (this.auth.currentUser) {
            return true;
        }
        alert('You must sign in first');
        return false;
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

    saveImageMessage(evt) {
        evt.preventDefault();
        // TODO: implement image sending
    }
}

window.onload = function() {
    window.roomchata = new Roomchata();
};

module.exports = {
    Roomchata: Roomchata,
};
