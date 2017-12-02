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
                    className='login_email_input'
                    type='text'
                    name='login_email_text'
                    placeholder='email address...'
                    value={this.props.login_email_text}>
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
                    className='login_sign_in_submit_input'
                    type='submit'
                    name='login_submit_button'>
                    log in
                </button>
                <button
                    className='login_sing_up_submit_input'
                    type='submit'
                    name='login_submit_button'>
                    sign up
                </button>
            </form>
            </Base>
        );
    }
}

module.exports = Login;
