const React = require('react');
const PropTypes = require('prop-types');

class Base extends React.Component {
    render() {
        return (
            <html>
                <head>
                    <title>{
                        this.props.title}
                    </title>
                </head>
                <body>
                    <h3>roomchata</h3>
                    {this.props.children}
                </body>
            </html>
        );
    }
}

Base.propTypes = {
    title: PropTypes.string,
};

module.exports = Base;
