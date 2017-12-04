const React = require('react');
const PropTypes = require('prop-types');
const Base = require('./base');
const Chat = require('./chat');
const Header = require('./header');
const Drawer = require('./drawer');

class Home extends React.Component {
    render() {
        return (
            <Base title='Home'>
            <div className="mdl-layout mdl-js-layout mdl-layout--fixed-drawer mdl-layout--fixed-header">
                <Header></Header>
                <Drawer conversations={[{email: 'this is a test email'}]}></Drawer>
                <Chat></Chat>
            </div>
            </Base>
        );
    }
}

module.exports = Home;
