const mongoose = require('mongoose');

// this schema models a user
// it's important to note that the String array `rooms` will contain IDs of rooms the user belongs to
// this can be used to somewhat quickly look up rooms from the `Room` collection
const User = new mongoose.Schema({
    username: String,
    key: String,
    rooms: [String]
});

// this schema models a room
// it's important to note that the String array `members` will contain IDs of users in the room
// this can be used to somewhat quickly look up users form the `User` collection
// but for reasons pertaining to good database design, this String array will likely be excluded
const Room = new mongoose.Schema({
    name: String,
    users: [String]
});

// this schema models a message
// it's important to note that the String `room` will be an ID of the room the message was sent in
// this can be used to somewhat quickly look up messages that belong in the room
const Message = new mongoose.Schema({
    room: String,
    sender: String,
    message: String,
    timestamp: Number,
});
