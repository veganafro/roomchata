const mongoose = require('mongoose');

const User = new mongoose.Schema({
    username: String,
    key: String,
    room: Object
});
