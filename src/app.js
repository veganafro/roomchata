const path = require('path');
const express = require('express');
const firebase = require('firebase');
const session = require('express-session');
const body_parser = require('body-parser');
const react_views = require('express-react-views');
const Roomchata = require('./scripts/main').Roomchata;

const session_options = {
    secret: 'a secret',
    saveUninitialized: false,
    resave: false
};

const app = express();

if (app.settings.env === 'development') {
    require('dotenv').config();
}

const firebase_client = new Roomchata();

app.set('view engine', 'jsx');
app.set('views', path.join(__dirname, 'views'));

app.use(session(session_options));
app.use(body_parser.urlencoded({extended: false}));
app.use('/scripts', express.static(path.join(__dirname, 'scripts')));
app.use('/stylesheets', express.static(path.join(__dirname, 'stylesheets')));

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
});
