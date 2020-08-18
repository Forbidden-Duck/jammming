import React from "react";
import "./SearchBar.css";

class SearchBar extends React.Component {
    constructor(props) {
        super(props);

        // Storage
        const cacheTerm = localStorage.getItem("term");

        this.state = { term: cacheTerm ? cacheTerm : "" };
        this.search = this.search.bind(this);
        this.handleTermChange = this.handleTermChange.bind(this);
        this.handleKeyPress = this.handleKeyPress.bind(this);
    }

    handleTermChange(event) {
        localStorage.setItem("term", event.target.value);
        this.setState({ term: event.target.value });
    }

    handleKeyPress(event) {
        const keyCode = event.keyCode || event.which;
        // ENTER
        if (keyCode === 13) {
            this.search();
        }
    }

    search() {
        this.props.onSearch(this.state.term);
    }

    render() {
        return (
            <div className="SearchBar">
                <input
                    placeholder="Enter a, Album, or Artist"
                    type="text" value={this.state.term}
                    onChange={this.handleTermChange}
                    onKeyPress={this.handleKeyPress} />
                <button className="SearchButton" onClick={this.search}>SEARCH</button>
            </div>
        );
    }
}

export default SearchBar;