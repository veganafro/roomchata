const React = require('react');
const PropTypes = require('prop-types');
const Base = require('./base');

class Login extends React.Component {
    render() {
        return (
            <Base title='Login'>
            <div className="login_form mdl-layout mdl-js-layout mdl-color--grey-100">
                <main className="login_card mdl-layout__content">
                    <div className="mdl-card mdl-shadow--6dp">
                        <div className="mdl-card__title mdl-color--primary mdl-color-text--white">
                            <h2 className="mdl-card__title-text">roomchata</h2>
                        </div>
                        <div className="mdl-card__supporting-text">
                            <form method="POST" id='loginform'>
                                <div className="mdl-textfield mdl-js-textfield">
                                    <input className="mdl-textfield__input" type="text" name="username"></input>
                                    <label className="mdl-textfield__label" htmlFor="username">Username</label>
                                </div>
                                <div className="mdl-textfield mdl-js-textfield">
                                    <input className="mdl-textfield__input" type="password" name="userpass"></input>
                                    <label className="mdl-textfield__label" htmlFor="userpass">Password</label>
                                </div>
                            </form>
                        </div>
                        <div className="mdl-card__actions mdl-card--border">
                            <button
                                type='submit'
                                form='loginform'
                                formAction='/signin'
                                className="mdl-button mdl-button--colored mdl-js-button mdl-js-ripple-effect">
                                Log in
                            </button>
                            <button
                                type='submit'
                                form='loginform'
                                formAction='/signup'
                                className="mdl-button mdl-button--colored mdl-js-button mdl-js-ripple-effect">
                                Sign up
                            </button>
                        </div>
                    </div>
                </main>
            </div>
            </Base>
        );
    }
}

module.exports = Login;
