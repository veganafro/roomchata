const React = require('react');
const PropTypes = require('prop-types');
const Base = require('./base');

class Login extends React.Component {
    render() {
        return (
            <Base title='Login'>
            <h1 className='login_header'>roomchata</h1>
            <form method='POST'
                name='login_form'>
                <input
                    className='login_username_input'
                    type='text'
                    name='login_username_text'
                    placeholder='username...'
                    value={this.props.login_username_text}>
                </input>
                <br></br>
                <input
                    className='login_password_input'
                    type='password'
                    name='login_password_text'
                    placeholder='password...'
                    value={this.props.login_password_text}>
                </input>
                <br></br>
                <button
                    className='login_submit_input'
                    type='submit'
                    name='login_submit_button'>
                    log in
                </button>
            </form>
            </Base>
        );
    }
}

module.exports = Login;
