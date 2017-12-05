const React = require('react');

class Chat extends React.Component {
    render() {
        return (
            <main className="mdl-layout__content">
                <div className="mdl_card mdl-cell mdl-cell--12-col mdl-grid" id="page-content">
                    <div id="messages" className="mdl-cell mdl-cell--12-col mdl-cell--12-col-tablet mdl-cell--12-col-desktop">
                        <span id="message-filler"></span>
                    </div>
                    <div className="mdl-cell mdl-cell--12-col mdl-cell--12-col-tablet mdl-cell--12-col-desktop"
                        id="enter_message_form">
                        <form id="message-form">
                            <div className="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
                                <input className="mdl-textfield__input" type="text" id="message" name="message"></input>
                            </div>
                            <button id="send" name="send" type="submit" className="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect">
                                send
                            </button>
                        </form>
                    </div>
                </div>
            </main>
        );
    }
}

module.exports = Chat;
