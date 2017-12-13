import React from 'react';
import ReactDOM from 'react-dom';

class ShowsList extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<div className="shows">
				THIS IS THE SHOWS COMPONENT AYYY <br />
				STYLE ME UP WITH shows.CSS
			</div>
		);
	}
}

ReactDOM.render(
    React.createElement(ShowsList, window.props),
    window.react_mount,
)