const React = require('react');
const PropTypes = require('prop-types');

class Base extends React.Component {
    render() {
        return (
            <html>
            <head>
                <title>
                    {this.props.title}
                </title>
            </head>
            <body>
                <h3>roomchata</h3>
                <script src="https://www.gstatic.com/firebasejs/4.6.2/firebase.js"></script>
                <script src="https://www.gstatic.com/firebasejs/4.6.2/firebase-app.js"></script>
                <script src="https://www.gstatic.com/firebasejs/4.6.2/firebase-auth.js"></script>
                <script src="https://www.gstatic.com/firebasejs/4.6.2/firebase-database.js"></script>
                <script src="https://www.gstatic.com/firebasejs/4.6.2/firebase-firestore.js"></script>
                <script src="https://www.gstatic.com/firebasejs/4.6.2/firebase-messaging.js"></script>
                <script src='scripts/main.js'></script>
            </body>
            </html>
        );
    }
}

Base.defaultProps = {
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: process.env.FIREBASE_AUTH_DOMAIN,
    databaseURL: process.env.FIREBASE_DATABASE_URL,
    projectId: process.env.FIREBASE_PROJECT_ID,
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID
}

module.exports = Base;
