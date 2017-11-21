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
                {this.props.children}
                <script src="scripts/bundle.js"></script>
                <script src='scripts/main.js'></script>
            </body>
            </html>
        );
    }
}

Base.defaultProps = {
}

module.exports = Base;
