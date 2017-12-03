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
                    <span className="mdl-layout-title">Title</span>
                    <nav className="mdl-navigation">
                        <a className="mdl-navigation__link" href="">Link</a>
                        <a className="mdl-navigation__link" href="">Link</a>
                        <a className="mdl-navigation__link" href="">Link</a>
                        <a className="mdl-navigation__link" href="">Link</a>
                    </nav>
                </div>
                <main className="mdl-layout__content">
                    <div className="page-content"></div>
                </main>
            </div>
            </Base>
        )
    }
}

Home.propTypes = {
}

module.exports = Home;
