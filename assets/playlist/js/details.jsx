import React from 'react';
import ReactDOM from 'react-dom';


class Details extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<div className="details">
				THIS IS THE DETAILS COMPONENT AYYY <br />
				STYLE ME UP WITH details.CSS
			</div>
		);
	}
}

ReactDOM.render(
    React.createElement(Details, window.props),
    window.react_mount,
)