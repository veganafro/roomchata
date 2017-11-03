const mongoose = require('mongoose');

const User = new mongoose.Schema({
    username: String,
    key: String,
    rooms: Object
});

const Room = new mongoose.Schema({
    
});
