const path = require('path');
const express = require('express');
const passport = require('passport');
const admin = require('firebase-admin');
const session = require('express-session');
const body_parser = require('body-parser');
const cookie_parser = require('cookie-parser');
const react_views = require('express-react-views');

const session_options = {
    secret: 'secretsdontmakefriendsfriendsmakesecrets',
    saveUninitialized: false,
    resave: false
};

const app = express();

if (app.settings.env === 'development') {
    require('dotenv').config();
}

admin.initializeApp({
    credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL
    }),
    databaseURL: process.env.FIREBASE_DATABASE_URL
});

app.set('view engine', 'jsx');
app.set('views', path.join(__dirname, 'views'));

app.use(cookie_parser());
app.use(body_parser.urlencoded({extended: false}));

app.use(session(session_options));
app.use(passport.initialize());
app.use(passport.session());


passport.serializeUser(function(user, done) {
    done(null, user.id);
});

passport.deserializeUser(function(id, done) {

});


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
