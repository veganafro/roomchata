const md5 = require('md5');
const path = require('path');
const express = require('express');
const passport = require('passport');
const bcrypt = require('bcrypt-nodejs');
const admin = require('firebase-admin');
const session = require('express-session');
const body_parser = require('body-parser');
const cookie_parser = require('cookie-parser');
const react_views = require('express-react-views');
const LocalStrategy = require('passport-local').Strategy;

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
    console.log('$$$ args at serializeUser', arguments);
    done(null, user);
});

passport.deserializeUser(function(user, done) {
    console.log('$$$ args at deserializeUser', arguments);
    done(null, user);
});

passport.use('local-signup', new LocalStrategy({
        usernameField: 'login_email_text',
        passwordField: 'login_password_text',
        passReqToCallback: true
    },
    function(req, email, password, done) {
        process.nextTick(function() {
            admin.database().ref('/users').child(md5(email)).once('value')
                .then(function(snapshot) {
                    // will return `true` if snapshot.val() is `null` and email address isn't taken
                    if (!snapshot.val()) {
                        const new_user = {
                            id: md5(email),
                            email: email,
                            marinade: bcrypt.hashSync(password, bcrypt.genSaltSync(8), null)
                        };

                        admin.database().ref('/users').child(md5(email)).set(new_user)
                            .then(function(data) {
                                console.log('$$$ successfully created user', data);
                                return done(null, new_user);
                            }).catch(function(error) {
                                console.log('$$$ did not create new user', error);
                                return done(error)
                            });
                    } else {
                        console.log('$$$ tried to create already existing user', snapshot.val());
                        return done(null, false);
                    }
                });
        });
    }
));


app.use('/scripts', express.static(path.join(__dirname, 'scripts')));
app.use('/stylesheets', express.static(path.join(__dirname, 'stylesheets')));

app.engine('jsx', react_views.createEngine());

app.get('/', function(request, response) {
    response.render('login');
});

app.get('/search', function(request, response) {
    response.render('search', {search_bar_text: request.user.username});
});

app.get('/room', function(request, response) {

});

app.post('/', passport.authenticate('local-signup'), function(request, response) {
    response.redirect('/search');
});

app.post('/search', function(request, response) {
    response.redirect('/search');
});

app.listen(process.env.PORT || 3000, function() {
    console.log('Listening on port', this.address().port, 'in context', app.settings.env);
});
