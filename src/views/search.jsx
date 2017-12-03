const React = require('react');
const PropTypes = require('prop-types');
const Base = require('./base');

class SearchBar extends React.Component {
    render() {
        return (
            console.log('$$$ search bar text value', this.props.search_bar_text),
            <form method='POST'>
                <input
                    className='search_bar_input'
                    type='text'
                    name='search_bar_text'
                    placeholder='search...'
                    value={this.props.search_bar_text}>
                </input>
            </form>
        )
    }
}

SearchBar.propTypes = {
    search_bar_text: PropTypes.string,
}

module.exports = SearchBar;
