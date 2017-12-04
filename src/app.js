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
const memorystore = require('memorystore')(session);
const LocalStrategy = require('passport-local').Strategy;

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

app.use(session({
    secret: 'secretsdontmakefriendsfriendsmakesecrets',
    saveUninitialized: false,
    resave: false,
    store: new memorystore({
        checkPeriod: 24 * 60 * 60 * 1000
    })
}));
app.use(passport.initialize());
app.use(passport.session());


passport.serializeUser(function(user, done) {
    console.log('$$$ args at serializeUser', arguments);
    done(null, user.id);
});

passport.deserializeUser(function(user_id, done) {
    console.log('$$$ args at deserializeUser', arguments);

    admin.database().ref('/users').child(user_id).once('value')
        .then(function(snapshot) {
            console.log('$$$ successfully deserialized a user', snapshot.val());
            done(null, snapshot.val());
        }).catch(function(error) {
            console.log('$$$ could not deserialize user', error);
            done(error, {});
        });
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
                }).catch(function(error) {
                    console.log('$$$ a database error occurred when creating user', error);
                    return done(error);
                });
        });
    }
));

passport.use('local-signin', new LocalStrategy({
        usernameField: 'login_email_text',
        passwordField: 'login_password_text',
        passReqToCallback: true
    },
    function(req, email, password, done) {
        process.nextTick(function() {
            admin.database().ref('/users').child(md5(email)).once('value')
                .then(function(snapshot) {
                    if (!snapshot.val()) {
                        console.log('$$$ could not find user with email', snapshot);
                        return done(null, false);
                    }

                    const user = snapshot.val();

                    if (bcrypt.compareSync(password, user.marinade)) {
                        console.log('$$$ successfully logged in', user);
                        return done(null, user);
                    }

                    console.log('$$$ wrong password was entered', user);
                    return done(null, false);
                }).catch(function(error) {
                    console.log('$$$ a database error occurred when searching for a user', error);
                    return done(error);
                });
        });
    }
));

app.use(function (request, response, next) {
    console.log('$$$ request auth status', request.isAuthenticated());
    next();
});


app.use('/scripts', express.static(path.join(__dirname, 'scripts')));
app.use('/stylesheets', express.static(path.join(__dirname, 'stylesheets')));

app.engine('jsx', react_views.createEngine());

app.get('/', function(request, response) {
    response.render('login');
});

app.get('/search', function(request, response) {
    response.render('home');
});

app.get('/room', function(request, response) {

});

app.get('/logout', function(request, response) {
    request.logout();
    request.session.destroy(function(error) {
        response.redirect('/');
    });
});

app.post('/signin', passport.authenticate('local-signin'), function(request, response) {
    response.redirect('/search');
});

app.post('/signup', passport.authenticate('local-signup'), function(request, response) {
    response.redirect('/search');
});

app.post('/search', function(request, response) {
    response.redirect('/search');
});

app.listen(process.env.PORT || 3000, function() {
    console.log('Listening on port', this.address().port, 'in context', app.settings.env);
});
