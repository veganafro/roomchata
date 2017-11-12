class SearchBar extends React.Component {
    render() {
        return (
            <form>
            <input
                type='text'
                placeholder='Search...'
                value={this.props.searchBarText}>
            </input>
            <input
                type='submit'
                value='Go'>
            </input>
            </form>
        )
    }
}
