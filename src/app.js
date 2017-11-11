const path = require('path');
const express = require('express');
const body_parser = require('body-parser');
const react_views = require('express-react-views');

const app = express();

app.set('view engine', 'jsx');
app.engine('jsx', react_views.createEngine());

app.set('views', path.join(__dirname, 'views'));
app.use(body_parser.urlencoded({extended: false}));

app.get('/', function(reqeust, response) {
    response.render('base');
});

app.get('/search', function(request, response) {
    response.render('search');
});

app.post('/', function(request, response) {

});

app.get('/home', function(request, response) {

});

app.get('/room', function(request, response) {

});

app.listen(process.env.PORT || 3000, function() {
    console.log('Listening on port', this.address().port, 'in context', app.settings.env);
});
