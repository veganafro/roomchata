const md5 = require('md5');
const path = require('path');
const uuid = require('uuid/v1');
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

const http = require('http').Server(app);
const io = require('socket.io')(http);

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

const session_middleware = session({
    secret: 'secretsdontmakefriendsfriendsmakesecrets',
    saveUninitialized: false,
    resave: false,
    store: new memorystore({
        checkPeriod: 24 * 60 * 60 * 1000
    })
});

app.use(session_middleware);
app.use(passport.initialize());
app.use(passport.session());


passport.serializeUser(function(user, done) {
    console.log('$$$ args at serializeUser', arguments);
    done(null, {id: user.id, conversations: user.conversations});
});

passport.deserializeUser(function(user, done) {
    console.log('$$$ args at deserializeUser', arguments);

    admin.database().ref('/users').child(user.id).once('value')
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
                            marinade: bcrypt.hashSync(password, bcrypt.genSaltSync(8), null),
                            conversations: {}
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


io.use(function(socket, next) {
    session_middleware(socket.request, {}, next);
});

io.on('connection', function(socket) {
    socket.on('open_conversation', function(counterpart_email) {
        const current_user = socket.request.session.passport.user;
        current_user.open_conversation = counterpart_email;

        admin.database().ref('/conversations').child(current_user.conversations[md5(counterpart_email)])
            .orderByKey().limitToLast(10).once('value')
            .then(function(snapshot) {
                if (!snapshot.val()) {
                    console.log('$$$ NO MESSAGES WERE FOUND FOR THE TWO USERS', snapshot.val());
                    io.sockets.connected[socket.id].emit('show_conversation', {message: 'No messaging history found.'});
                    return;
                }

                console.log('$$$ FOUND THE FOLLOWING MESSAGES IN THE CONVERSATION', snapshot.val());
                io.sockets.connected[socket.id].emit('show_conversation',
                    {
                        message: 'Have fun chatting.',
                        history: snapshot.val()
                    }
                );
                return;
            }, function(rejection_reason) {
                console.log('$$$ PROMISE REJECTED COULD NOT FIND CONVERSATION', rejection_reason);
                io.sockets.connected[socket.id].emit('show_conversation', {message: 'Something went wrong when looking up message history.'});
                return;
            }).catch(function(error) {
                console.log('$$$ CAUGHT THE FOLLOWING ERROR WHEN LOOKING FOR MESSAGES', error);
                io.sockets.connected[socket.id].emit('show_conversation', {message: 'Something went wrong in the database.'});
                return;
            });
    });
});


function checkAuth(request, response, next) {
    if (request.isAuthenticated()) {
        next();
    } else {
        response.redirect('/logout');
    }
};


app.use('/scripts', express.static(path.join(__dirname, 'scripts')));
app.use('/stylesheets', express.static(path.join(__dirname, 'stylesheets')));

app.engine('jsx', react_views.createEngine());

app.get('/', function(request, response) {
    response.render('login');
});

app.get('/home', checkAuth, function(request, response) {
    const current_user = request.session.passport.user;

    admin.database().ref('/users').child(current_user.id).child('conversations').once('value')
        .then(function(active_chats) {
            if (!active_chats.val()) {
                console.log('$$$ USER DID NOT HAVE ANY ACTIVE CHATS');
                response.render('home', {conversation_counterparts: []});
                return;
            }

            const users_to_lookup = Object.keys(active_chats.val());

            const promises = users_to_lookup.map(function(user_id) {
                return admin.database().ref('/users').child(user_id).once('value');
            });
            Promise.all(promises).then(function(snapshots) {
                const user_display_names = snapshots.map(function(snapshot) {
                    return {email: snapshot.val().email};
                });
                response.render('home', {conversation_counterparts: user_display_names});
            });
        }).catch(function(error) {
            console.log('$$$ SOMETHING WENT WRONG WHEN LOOKING IN THE DATABASE', error);
            response.redirect('/');
        });
});

app.post('/connect', checkAuth, function(request, response) {
    const current_user = request.session.passport.user;
    const submitted_value = request.body.search_query;

    admin.database().ref('/users').child(md5(submitted_value)).once('value')
        .then(function(snapshot) {
            if (!snapshot.val()) {
                console.log('$$$ YOU CANNOT CHAT WITH NON EXISTENT USERS');
                response.send({error: 'You cannot chat with nonexistent users.'});
                return;
            }

            const counterpart = snapshot.val();
            // you're already chatting with this person, don't update the database
            if (counterpart.conversations.hasOwnProperty(current_user.id)) {
                console.log('$$$ YOU CANNOT RECREATE CHATS');
                response.send({error: 'You cannot recreate existing chats'});
                return;
            }

            const users_to_connect = [counterpart.id, current_user.id];
            const conversation_id = uuid();

            const promises = users_to_connect.map(function(user_id, index) {
                return admin.database().ref('/users').child(user_id).child('conversations')
                    .child(users_to_connect[(users_to_connect.length - 1) - index])
                    .set(conversation_id);
            });

            Promise.all(promises).then(function(snapshots) {
                console.log('$$$ SUCCESSFULLY CONNECTED USERS');
                response.send({
                    success: `Successfully connected you to ${counterpart.email}.`,
                    connection: counterpart.email
                });
            });
        }).catch(function(error) {
            console.log('$$$ A DATABASE ERROR OCCURRED WHILE LOOKING FOR A USER', error);
            response.send({error: 'A database error occurred while looking for a user.'});
        });
});

app.get('/logout', function(request, response) {
    request.logout();
    request.session.destroy(function(error) {
        response.redirect('/');
    });
});

app.post('/signin', passport.authenticate('local-signin'), function(request, response) {
    response.redirect('/home');
});

app.post('/signup', passport.authenticate('local-signup'), function(request, response) {
    response.redirect('/home');
});

app.post('/home', function(request, response) {
    response.redirect('/home');
});

http.listen(process.env.PORT || 3000, function() {
    console.log('Listening on port', this.address().port, 'in context', app.settings.env);
});
