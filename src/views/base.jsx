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

                <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:regular,bold,italic,thin,light,bolditalic,black,medium&amp;lang=en">
                <link rel="stylesheet" href="stylesheets/style.css">
            </head>
            <body>
                <h3 className='base_header'>roomchata</h3>
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
