const mongoose = require('mongoose');

const User = new mongoose.Schema({
    username: String,
    key: String,
    rooms: [Room]
});

const Room = new mongoose.Schema({

});
