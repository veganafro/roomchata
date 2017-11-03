const mongoose = require('mongoose');

// this schema models a user
// it's important to note that the String array `rooms` will contain IDs of rooms the user belongs to
// this can be used to somewhat quickly look up rooms from the `Room` collection
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
    room: String,
    sender: String,
    message: String,
    timestamp: Number,
});
