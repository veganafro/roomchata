require('firebase/storage');
const firebase = require('firebase');

firebase.initializeApp({
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: process.env.FIREBASE_AUTH_DOMAIN,
    databaseURL: process.env.FIREBASE_DATABASE_URL,
    projectId: process.env.FIREBASE_PROJECT_ID,
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID
});

const auth = firebase.auth();
const storage = firebase.storage();
const database = firebase.database();

auth.onAuthStateChanged(onAuthStateChanged);

function signIn(username, email, password, auth) {
    if (emai.split('@').length !== 2 ||
        username.length <= 1 ||
        password.length <= 1) {
        console.log('$$$ please enter a valid email, username, or password.');
    } else {
        auth.signInWithEmailAndPassword(email, password).catch(function(error) {
            console.log(error.message);
        });
    }
}

function signUp(username, email, password, auth) {
    if (email.split('@').length !== 2 ||
        username.length <= 1 ||
        password.length <= 1) {
        alert('Please enter a valid email, username, or password.');
    } else {
        auth.createUserWithEmailAndPassword(email, password).catch(function (error) {
            console.log(error.message);
        });
    }
}

function signOut(auth) {
    auth.signOut();
}

function onAuthStateChanged(user) {
    if (user) {
        let profile_pic = user.photoURL;
        let user_name = user.displayName;

        // TODO: do stuff to update the client side's profile picture and username
    } else {
        // TODO: do stuff on the client side to display the initial log in page
    }
}

function checkSignedInWithMessage(auth) {
    if (auth.currentUser) {
        return true;
    }
    alert('You must sign in first');
    return false;
}

module.exports = {
    signIn: signIn,
    signUp: signUp,
    signOut: signOut,
    onAuthStateChanged: onAuthStateChanged,
    checkSignedInWithMessage: checkSignedInWithMessage,
};
