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

    onAuthStateChanged(user) {
        if (user) {
            let profile_pic = user.photoURL;
        } else {
            this.userName.setAttribute('hidden', 'true');
        }
    }
}

window.onload = function() {
    if (window.firebase) {
        window.roomchata = new Roomchata();
    } else {
        alert('Could not connect to firebase. Try again later.');
    }
}
