const express = require('express');
const body_parser = require('body-parser');

const app = express();

app.set('view engine', 'hbs');
// app.set('views', __dirname + '/views');
app.use(body_parser.urlencoded({extended: false}));

app.get('/', function(reqeust, response) {
    response.render('home');
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
