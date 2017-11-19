const React = require('react');
const PropTypes = require('prop-types');

const env_vars = process !== 'undefined' ? process.env : undefined;

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
                <div>{this.props.env_vars}</div>
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
    env_vars: env_vars
}

module.exports = Base;
