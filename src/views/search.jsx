const React = require('react');
const PropTypes = require('prop-types');

class SearchBar extends React.Component {
    render() {
        return (
            <form method='POST' className='search_bar_form'>
                <input
                    type='text'
                    name='search_bar_text'
                    placeholder='Search...'
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
