import React from 'react';
import ReactDOM from 'react-dom';
import ClickableExploreField from './ClickableExploreField.jsx';

class Search extends React.Component {
	constructor(props) {
		super(props);
		this.makeQuery = this.makeQuery.bind(this);

		this.state = {query: '', results: null};
		this.makeQuery = this.makeQuery.bind(this);
	}

	makeQuery() {
		let query = document.getElementById("search-bar").value
		fetch('/playlist/search/?query=' + query, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
				"Accept": "application/json"
			},
			mode: 'cors',
			cache: 'default'
		}).then(response => {
			return response.json();
		});
	}

	render() {
		let results;
		if (this.state.results) results = <SearchResults results={this.state.results} />)
		else results = null;

		return (
			<div className="search">
				<input id="search-bar" type="text" name="search-input" onKeyUp={this.makeQuery} />
				{results}
			</div>
		);
	}
}

class SearchResults extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		return null;
	}
}

ReactDOM.render(
    React.createElement(Search, window.props),
    window.react_mount,
);
