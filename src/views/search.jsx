const React = require('react');
const PropTypes = require('prop-types');
const Base = require('./base');

class Home extends React.Component {
    render() {
        return (
            <Base title='Home'>
            <div className="mdl-layout mdl-js-layout mdl-layout--fixed-drawer mdl-layout--fixed-header">
                <header className="mdl-layout__header">
                    <div className="mdl-layout__header-row">
                        <div className="mdl-layout-spacer"></div>
                        <div className="mdl-textfield mdl-js-textfield mdl-textfield--expandable mdl-textfield--floating-label mdl-textfield--align-right">
                            <label className="mdl-button mdl-js-button mdl-button--icon"
                                htmlFor="fixed-header-drawer-exp">
                                <i className="material-icons">search</i>
                            </label>
                            <div className="mdl-textfield__expandable-holder">
                                <input className="mdl-textfield__input" type="text" name="sample"
                                    id="fixed-header-drawer-exp">
                                </input>
                            </div>
                        </div>
                    </div>
                </header>
                <div className="mdl-layout__drawer">
                    <span className="mdl-layout-title">roomchata</span>
                    <nav className="mdl-navigation">
                        <a className="mdl-navigation__link" href="">Link</a>
                        <a className="mdl-navigation__link" href="">Link</a>
                        <a className="mdl-navigation__link" href="">Link</a>
                        <a className="mdl-navigation__link" href="">Link</a>
                    </nav>
                </div>
                <main className="mdl-layout__content">
                    <div className="mdl_card mdl-cell mdl-cell--12-col mdl-grid" id="page-content">
                        <div id="messages" className="mdl-cell mdl-cell--12-col mdl-cell--12-col-tablet mdl-cell--12-col-desktop">
                            <span id="message-filler"></span>
                        </div>
                        <div className="mdl-cell mdl-cell--12-col mdl-cell--12-col-tablet mdl-cell--12-col-desktop"
                            id="enter_message_form">
                            <form id="message-form" action="#">
                                <div className="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
                                    <input className="mdl-textfield__input" type="text" id="message"></input>
                                </div>
                                <button id="submit" type="submit" className="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect">
                                    Send
                                </button>
                            </form>
                        </div>
                    </div>
                </main>
            </div>
            </Base>
        )
    }
}

Home.propTypes = {
}

module.exports = Home;
