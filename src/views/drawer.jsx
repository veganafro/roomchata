const React = require('react');

class Drawer extends React.Component {
    render() {
        return (
            <div className="mdl-layout__drawer">
                <span className="mdl-layout-title">roomchata</span>
                <nav className="mdl-navigation">
                    {this.props.conversations.map(user => (
                        <a className="mdl-navigation__link conversations" href="" key={user.email}>{user.email}</a>
                    ))}
                    <a className="mdl-navigation__link" key="logout" href="/logout">Logout</a>
                </nav>
            </div>
        );
    }
}

module.exports = Drawer;
