import React from 'react';
import ReactDOM from 'react-dom';

class PlayGraph extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<div className="graph">
				THIS IS THE GRAPH COMPONENT AYYY <br />
				STYLE ME UP WITH graph.CSS
			</div>
		);
	}
}

ReactDOM.render(
    React.createElement(PlayGraph, window.props),
    window.react_mount,
)