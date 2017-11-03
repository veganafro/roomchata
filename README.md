The content below is an example project proposal / requirements document. Replace the text below the lines marked "__TODO__" with details specific to your project. Remove the "TODO" lines.

# Roomchata

## Overview

Talking to people you know is less fun than talking to people you don't know. Use roomchata to talk
to random people and chat about whatever the group of people wants to talk about.

Roomchata allows users to log in and see the topic of a given room, enter that room, and start chatting
with other users about that topic. Users can also create rooms if they'd like.


## Data Model

Roomchata will store users, rooms, and messages

* users can have multiple rooms (via references)
* each room can have multiple messages (by embedding)

An Example User:
```javascript
{
    username: // a user defined username,
    inconspicuous: // a password hash,
    rooms: // an object of references to rooms the user belongs to
}
```

An Example Room:
```javascript
{
    room: { // an object keeping track of the active rooms
        name: // the name of the room
        members: // an object containing usernames that are in the room
    }
}
```

An Example Message:
```javascript
{
    room_name: { // an object keeping track of the messages sent in a room
        timestamp: { // an object keyed by timestamp containing the message sent at the specified time
            sender: // the sender of the message,
            message: // the message that was sent,
        }
    }
}
```

An Example Message with Embedded Items:

```javascript
{
    'ait': {
        '2017-11-02 10:26:47 PM EST': {
            'sender': 'ait student 69',
            'message': 'wao thz prjct z s fn'
        },
        '2017-11-02 10:16:37 PM EST': {
            'sender': 'ait student 69',
            'message': 'i lrv ait'
        }
    }
}
```

## [Link to Commented First Draft Schema](db.js)

## Wireframes

/ - the login page

![base](documentation/login.png)

/home - a landing page showing the rooms you belong to and a search function that creates rooms if they don't exist

![home](documentation/home.png)

/room - the room's chat history and a place to send a message to the room

![room](documentation/room.png)

## Site map

![sitemap](documentation/sitemap.png)

## User Stories or Use Cases

1. as non-registered user, I can register a new account with the site
2. as a user, I can log in to the site
3. as a user, I can create a new room
4. as a user, I can go read the chat history of rooms I belong to
5. as a user, I can send new messages to a room

## Research Topics

* (5 points) Integrate user authentication
    * I'm going to be using passport for user authentication
    * an account has been made for testing; I'll email you the password
    * see `roomchata.herokuapp.com` for login page
* (5 points) React.js
    * used React.js as the frontend framework; it's a challenging library to learn, so I've assigned it 5 points
* (5 points) Lodash.js
    * used Lodash.js to make the server-side logic purely functional; it'll be a challenging library to learn, so I've assigned it 5 points

15 points total out of 8 required points

## [Link to Initial Main Project File](src/app.js)

## Annotations / References Used

(___TODO__: list any tutorials/references/etc. that you've based your code off of_)

1. [passport.js authentication docs](http://passportjs.org/docs)
2. [tutorial on React.js](https://reactjs.org/tutorial/tutorial.html)
