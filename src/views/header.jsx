const React = require('react');

class Header extends React.Component {
    render() {
        return (
            <header className="mdl-layout__header">
                <div className="mdl-layout__header-row">
                    <span className="mdl-layout-title" name="email">{this.props.email}</span>
                    <div className="mdl-layout-spacer"></div>
                    <form name="search">
                        <div className="mdl-textfield mdl-js-textfield mdl-textfield--expandable mdl-textfield--floating-label mdl-textfield--align-left">
                            <label className="mdl-button mdl-js-button mdl-button--icon"
                                htmlFor="fixed-header-drawer-exp">
                                <i className="material-icons">search</i>
                            </label>
                            <div className="mdl-textfield__expandable-holder">
                                <input className="mdl-textfield__input" type="text" name="search"
                                    id="fixed-header-drawer-exp">
                                </input>
                            </div>
                        </div>
                    </form>
                </div>
            </header>
        );
    }
}

module.exports = Header;
