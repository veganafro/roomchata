const React = require('react');
const PropTypes = require('prop-types');
const Base = require('./base');

class Login extends React.Component {
    render() {
        return (
            <Base title='Login'>
            <h1 className='login_header'>roomchata</h1>
            <form method='POST'>
                <input
                    className='login_username_input'
                    type='text'
                    name='login_username_text'
                    placeholder='username...'
                    value={this.props.login_username_text}>
                </input>
            </form>
            </Base>
        );
    }
}

module.exports = Login;
