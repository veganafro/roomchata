const React = require('react');

class Drawer extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="mdl-layout__drawer">
                <span className="mdl-layout-title">roomchata</span>
                <nav className="mdl-navigation">
                    {this.props.conversations.map(user => (
                        <a className="mdl-navigation__link" href="" key={user.email}>{user.email}</a>
                    ))}
                    <a className="mdl-navigation__link" href="/logout">Logout</a>
                </nav>
            </div>
        );
    }
}

module.exports = Drawer;
