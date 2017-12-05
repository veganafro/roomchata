const md5 = require('md5');
const path = require('path');
const uuid = require('uuid');
const express = require('express');
const passport = require('passport');
const bcrypt = require('bcrypt-nodejs');
const admin = require('firebase-admin');
const session = require('express-session');
const body_parser = require('body-parser');
const node_uuid = require('node-time-uuid');
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
    done(null, {email: user.email, id: user.id, conversations: user.conversations});
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
        const previous_conversation = current_user.open_conversation;
        current_user.open_conversation = counterpart_email;

        // update the client side with server side set cookies
        if (!current_user.hasOwnProperty('conversations') || !current_user.conversations[md5(counterpart_email)]) {

            admin.database().ref('/users').child(current_user.id).once('value')
                .then(function(snapshot) {
                    if (!snapshot.val()) {
                        console.log('$$$ COULD NOT FIND USER IN DATABASE WHEN UPDATING', snapshot);
                    } else {
                        current_user.conversations = snapshot.val().conversations;
                        console.log('$$$ CURRENT USER HAS', current_user);
                        io.sockets.connected[socket.id].emit('show_conversation',
                            {
                                active_conversation: counterpart_email,
                                message: 'Have fun chatting.',
                                history: snapshot.val()
                            }
                        );
                    }
                }).catch(function(error) {
                    console.log('$$$ CAUGHT THE FOLLOWING ERROR WHEN UPDATING CONVERSATIONS', error);
                    return;
                });
        } else {
            // get all the messages at this location and send them back to the client
            admin.database().ref('/conversations').child(current_user.conversations[md5(counterpart_email)])
                .orderByKey().limitToLast(10).once('value')
                .then(function(snapshot) {
                    if (!snapshot.val()) {
                        console.log('$$$ NO MESSAGES WERE FOUND FOR THE TWO USERS', snapshot.val());
                        io.sockets.connected[socket.id].emit('show_conversation',
                            {
                                active_conversation: counterpart_email,
                                message: 'Get to talking.',
                                history: {}
                            }
                        );
                        socket.emit('listen_for_messages', current_user.conversations[md5(counterpart_email)]);
                    } else {
                        console.log('$$$ FOUND THE FOLLOWING MESSAGES IN THE CONVERSATION', snapshot.val());
                        console.log('$$$ CURRENT USER HAS', current_user);
                        io.sockets.connected[socket.id].emit('show_conversation',
                            {
                                active_conversation: counterpart_email,
                                message: 'Keep it going.',
                                history: snapshot.val()
                            }
                        );
                        socket.emit('listen_for_messages', current_user.conversations[md5(counterpart_email)]);
                    }
                }, function(rejection_reason) {
                    console.log('$$$ PROMISE REJECTED COULD NOT FIND CONVERSATION', rejection_reason);
                    return;
                }).catch(function(error) {
                    console.log('$$$ CAUGHT THE FOLLOWING ERROR WHEN LOOKING FOR MESSAGES', error);
                    return;
                });
        }
    });

    socket.on('write_message', function(message_text) {
        const current_user = socket.request.session.passport.user;
        const message_id = new node_uuid().toString('pretty');
        const sender = current_user.email;

        const new_message = {
            text: message_text,
            sender: sender
        }

        admin.database().ref('/conversations').child(current_user.conversations[md5(current_user.open_conversation)]).child(message_id)
            .set(new_message)
            .then(function() {
                console.log('$$$ SUCCESSFULLY WROTE NEW MESSAGE');
            }).catch(function(error) {
                console.log('$$$ SOMETHING WENT WRONG WHEN WRITING THE MESSAGE', error);
                return;
            });
    });
});


function checkAuth(request, response, next) {
    if (request.isAuthenticated()) {
        if (request.route.path === '/') {
            response.redirect('/home');
        } else {
            next();
        }
    } else {
        if (request.route.path === '/') {
            next();
        } else {
            response.redirect('/logout');
        }
    }
};


app.use('/scripts', express.static(path.join(__dirname, 'scripts')));
app.use('/stylesheets', express.static(path.join(__dirname, 'stylesheets')));

app.engine('jsx', react_views.createEngine());

app.get('/', checkAuth, function(request, response) {
    response.render('login');
});

app.get('/home', checkAuth, function(request, response) {
    const current_user = request.session.passport.user;

    admin.database().ref('/users').child(current_user.id).child('conversations').once('value')
        .then(function(active_chats) {
            if (!active_chats.val()) {
                console.log('$$$ USER DID NOT HAVE ANY ACTIVE CHATS');
                response.render('home', {email: current_user.email, conversation_counterparts: []});
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
                response.render('home', {email: current_user.email, conversation_counterparts: user_display_names});
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
            if (counterpart.hasOwnProperty('conversations') && counterpart.conversations.hasOwnProperty(current_user.id)) {
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
