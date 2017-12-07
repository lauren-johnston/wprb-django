import React from 'react';
import ReactDOM from 'react-dom';

class Search extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<div className="search">
				THIS IS THE SEARCH COMPONENT AYYY <br />
				STYLE ME UP WITH search.CSS
			</div>
		);
	}
}

ReactDOM.render(
    React.createElement(Search, window.props),
    window.react_mount,
)