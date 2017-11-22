const React = require('react');
const PropTypes = require('prop-types');
const Base = require('./base');

class SearchBar extends React.Component {
    render() {
        return (
            <Base title='Search'>
            <form method='POST'>
                <input
                    className='search_bar_input'
                    type='text'
                    name='search_bar_text'
                    placeholder='Search...'
                    value={this.props.search_bar_text}>
                </input>
            </form>
            </Base>
        )
    }
}

SearchBar.propTypes = {
    search_bar_text: PropTypes.string,
}

module.exports = SearchBar;
