const express = require('express');
const body_parser = require('body-parser');

const app = express();
app.set('view engine', 'hbs');
app.use(bodyParser.urlencoded({extended: false}));

app.get('/', function(reqeust, response) {

});

app.post('/', function(request, response) {

});

app.get('/home', function(request, response) {

});
