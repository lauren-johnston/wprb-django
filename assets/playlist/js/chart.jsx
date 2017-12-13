import React from 'react';
import ReactDOM from 'react-dom';


class Chart extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<div className="chart">
				THIS IS THE CHART COMPONENT AYYY <br />
				STYLE ME UP WITH chart.CSS
			</div>
		);
	}
}

ReactDOM.render(
    React.createElement(Chart, window.props),
    window.react_mount,
)