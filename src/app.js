require('firebase/storage');
const path = require('path');
const express = require('express');
const firebase = require('firebase');
const session = require('express-session');
const body_parser = require('body-parser');
const cookie_parser = require('cookie-parser');
const react_views = require('express-react-views');

const session_options = {
    secret: 'a secret',
    saveUninitialized: false,
    resave: false
};

const app = express();

if (app.settings.env === 'development') {
    require('dotenv').config();
}

firebase.initializeApp({
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: process.env.FIREBASE_AUTH_DOMAIN,
    databaseURL: process.env.FIREBASE_DATABASE_URL,
    projectId: process.env.FIREBASE_PROJECT_ID,
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID
});

const storage = firebase.storage();
const database = firebase.database();

app.set('view engine', 'jsx');
app.set('views', path.join(__dirname, 'views'));

app.use(cookie_parser());
app.use(session(session_options));
app.use(body_parser.urlencoded({extended: false}));
app.use('/scripts', express.static(path.join(__dirname, 'scripts')));
app.use('/stylesheets', express.static(path.join(__dirname, 'stylesheets')));

app.engine('jsx', react_views.createEngine());

app.get('/', function(request, response) {
    response.render('login');
});

app.get('/search', function(request, response) {
    response.render('search');
});

app.get('/room', function(request, response) {

});

app.post('/', function(request, response) {
    const email = request.body.login_email_text;
    const password = request.body.login_password_text;
});

app.post('/search', function(request, response) {
    response.redirect('/search');
});

app.listen(process.env.PORT || 3000, function() {
    console.log('Listening on port', this.address().port, 'in context', app.settings.env);
});
