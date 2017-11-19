const path = require('path');
const express = require('express');
const firebase = require('firebase');
const body_parser = require('body-parser');
const react_views = require('express-react-views');

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

app.set('view engine', 'jsx');
app.set('views', path.join(__dirname, 'views'));

app.use(body_parser.urlencoded({extended: false}));
app.use('/scripts', express.static(path.join(__dirname, 'scripts')));

app.engine('jsx', react_views.createEngine());

app.get('/', function(request, response) {
    response.render('base');
});

app.get('/search', function(request, response) {
    response.render('search');
});

app.get('/room', function(request, response) {

});

app.post('/', function(request, response) {

});

app.post('/search', function(request, response) {
    response.redirect('/search');
});

app.listen(process.env.PORT || 3000, function() {
    console.log('Listening on port', this.address().port, 'in context', app.settings.env);
    console.log({
        apiKey: process.env.FIREBASE_API_KEY,
        authDomain: process.env.FIREBASE_AUTH_DOMAIN,
        databaseURL: process.env.FIREBASE_DATABASE_URL,
        projectId: process.env.FIREBASE_PROJECT_ID,
        storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
        messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID
    });
});
