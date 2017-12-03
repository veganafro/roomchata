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

                <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:regular,bold,italic,thin,light,bolditalic,black,medium&amp;lang=en"></link>
                <link rel="stylesheet" href="stylesheets/style.css"></link>
                <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons"></link>
                <link rel="stylesheet" href="https://code.getmdl.io/1.3.0/material.indigo-pink.min.css"></link>
                <script defer src="https://code.getmdl.io/1.3.0/material.min.js"></script>
            </head>
            <body>
                {this.props.children}
                <script src="scripts/bundle.js"></script>
                <script src='scripts/main.js'></script>
            </body>
            </html>
        );
    }
}

Base.propTypes = {
    title: PropTypes.string,
}

Base.defaultProps = {
    title: 'Roomchata',
}

module.exports = Base;
