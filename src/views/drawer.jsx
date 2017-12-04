const React = require('react');

class Drawer extends React.Component {
    constructor(props) {
        super(props);
        this.handleClick = this.handleClick.bind(this);
    }

    handleClick(evt) {
        evt.preventDefault();
        console.log('$$$ a link was clicked', evt);
    }

    render() {
        return (
            <div className="mdl-layout__drawer">
                <span className="mdl-layout-title">roomchata</span>
                <nav className="mdl-navigation">
                    {this.props.conversations.map(user => (
                        <a className="mdl-navigation__link" href="" key={user.email}>{user.email}</a>
                    ))}
                </nav>
            </div>
        );
    }
}

module.exports = Drawer;
