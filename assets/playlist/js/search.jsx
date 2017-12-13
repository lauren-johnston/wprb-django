import React from 'react';
import ReactDOM from 'react-dom';
import ClickableExploreField from './ClickableExploreField.jsx';

class Search extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<div className="search">
				THIS IS THE SEARCH COMPONENT AYYY <br />
				STYLE ME UP WITH search.CSS
				<ClickableExploreField field="artist" value="me" id="1" />
			</div>
		);
	}
}

ReactDOM.render(
    React.createElement(Search, window.props),
    window.react_mount,
);