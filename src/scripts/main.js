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

    signIn(evt) {
        evt.preventDefault();

        if (this.email_input.split('@').length !== 2 ||
            this.username_input.value.length <= 1 ||
            this.password_input.value.length <= 1) {
            alert('Please enter a valid email, username, or password.');
        } else {
            this.auth.signInWithEmailAndPassword(this.email_input.value, this.password_input.value).catch(function(error) {
                console.log(error.message);
                alert(error.message);
            });
        }
    }

    signUp(evt) {
        evt.preventDefault();

        if (this.email_input.split('@').length !== 2 ||
            this.username_input.value.length <= 1 ||
            this.password_input.value.length <= 1) {
            alert('Please enter a valid email, username, or password.');
        } else {
            this.auth.createUserWithEmailAndPassword(this.email_input.value, this.password_input.value).catch(function (error) {
                console.log(error.message);
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

            // TODO: do stuff to update the client side's profile picture and username

            this.loadMessages();
            this.saveMessagingDeviceToken();
        } else {
            this.user_pic.setAttribute('hidden', 'true');
            this.username.setAttribute('hidden', 'true');
            this.sign_out_button.setAttribute('hidden', 'true');
            this.sign_in_button.removeAttribute('hidden');
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

    setImageUrl(image_uri, image_element) {
        if (image_uri.startsWith('gs://')) {
            image_element.src = this.LOADING_IMAGE_URL;
            this.storage.refFromURL(image_uri).getMeatadata().then(function(metadata) {
                image_element.src = metadata.downloadURLs[0];
            });
        } else {
            image_element.src = image_uri;
        }
    }

    saveImageMessage(evt) {
        evt.preventDefault();
        const file = evt.target.files[0];

        this.image_form.reset();

        if (!file.type.match('image.*')) {
            alert('You can only upload images.');
            return;
        }

        if (this.checkSignedInWithMessage()) {
            const current_user = this.auth.currentUser;

            this.messages_reference.push({
                name: current_user.displayMessage,
                imageUrl: this.LOADING_IMAGE_URL,
                photoUrl: current_user.photoURL,
            }).then(function(data) {
                const file_path = current_user.uid + '/' + data.key + '/' + file.name;
                return this.storage.ref(file_path).put(file).then(function(snapshot) {
                    const full_path = snapshot.metadata.fullPath;
                    return data.update({
                        imageUrl: this.storage.ref(full_path).toString(),
                    });
                }.bind(this));
            }.bind(this)).catch(function(error) {
                console.log('$$$ could not upload image to the database', error);
            });
        }
    }
}

window.onload = function() {
    window.roomchata = new Roomchata();
};
