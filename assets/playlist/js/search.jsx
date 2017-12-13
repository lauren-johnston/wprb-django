import React from 'react';
import ReactDOM from 'react-dom';
import ClickableExploreField from './ClickableExploreField.jsx';

class Search extends React.Component {
	constructor(props) {
		super(props);
		this.makeQuery = this.makeQuery.bind(this);

		this.state = {query: ''};
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
		return (
			<div className="search">

				<input id = "search-bar" type="text" name="search-input" onKeyPress={this.makeQuery} />

				



			</div>
		);
	}
}

ReactDOM.render(
    React.createElement(Search, window.props),
    window.react_mount,
);
