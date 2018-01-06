import React from 'react';
import Moment from 'moment';

import {
	VictoryLine, VictoryChart, VictoryAxis, VictoryTheme, VictoryLabel
} from 'victory';

const UNITS = {
	'week' : 'MM/DD/YY',
	'month': 'MMM \'YY',
	'year' : 'YYYY'
}

export default class PlayGraph extends React.Component {
	constructor(props) {
		super(props);

		this.state = { unit: 'month' };
	}

	binData() {
		let start = new Moment(Math.min(...this.props.data), 'X').startOf(this.state.unit);
		let now = Moment();

		// Generate bins
		let binEdges = [];
		for (let m = new Moment(start); m.isBefore(now); m.add(1, this.state.unit))
			binEdges.push(new Moment(m));

		let bins = new Array(binEdges.length).fill(0);

		// Do the binning
		for (let point of this.props.data) {
			let idx = Moment(point, 'X').diff(start, this.state.unit);
			bins[idx] += 1;
		}

		// Trim trailing zeros while there are multiple
		while (bins[bins.length-1] === 0 && bins[bins.length-2] === 0) {
			bins.pop();
			binEdges.pop();
		}

		return {bins, binEdges}
	}

	render() {
		let {bins, binEdges} = this.binData();

		let points = bins.map((val,idx) => {
			return {x: idx, y: val}
		});

		let dateFormat = UNITS[this.state.unit];

		return (
			<div className="graph">
				<VictoryChart
					theme={VictoryTheme.grayscale}
					domainPadding={10} >
					<VictoryLabel
						x={200}
						textAnchor="middle"
						text="Popularity over time"/>

					<VictoryAxis 
						style= {{
							axisLabel: { fontSize: 10, padding: 10 },
							ticks: {size: 1},
							tickLabels: {fontSize: 8}
						}}
						fixLabelOverlap={true}
						tickValues={points.map((val, idx) => idx)}
						tickFormat={(idx) => binEdges[idx].format(dateFormat)} />
					<VictoryAxis dependentAxis
						label={`Plays per ${this.state.unit}`}
						style= {{ 
							axisLabel: { fontSize: 10, padding: 20 },
							tickLabels: {fontSize: 10, padding: 2}
						}} 
						tickFormat={(val) => val === parseInt(val) ? val : ''} />

					<VictoryLine data={points} />
				</VictoryChart>
			</div>
		);
	}
}