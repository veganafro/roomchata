const mongoose = require('mongoose');

const User = new mongoose.Schema({
    username: String,
    key: String,
    rooms: [String]
});

const Room = new mongoose.Schema({
    name: String,
    members: [String]
});

const Message = new mongoose.Schema({

});
