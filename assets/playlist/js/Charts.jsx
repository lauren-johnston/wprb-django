import React from 'react';

export default class Charts extends React.Component {
	constructor(props) {
		super(props);

		this.state = {field: 'artist'};

		console.log(this.props);
	}

	render() {
		const ChartToggle = ({field}) => (
			<span 
				className={this.state.field === field ? 'chart-selected chart-option' : 'chart-option'}
				onClick={() => this.setState({field})} >{field + 's'}
			</span>
		);

		return (
			<div className="chart">
				<h3 className="chart-main-title">{`Top Charts for ${this.props.for}`}
				</h3>
				<div className="chart-control">
					<ChartToggle field="artist" />
					<ChartToggle field="album" />
					<ChartToggle field="song" />
				</div>
				<ChartHeading title={this.state.field} />
				<div className="chart-row-container">
				{this.props.charts[this.state.field].map((item, index) => 
					<ChartRow key={item.id}
						field={this.state.field}
						title={item.name} 
						id={item.id} 
						index={index+1}
						plays={item.plays} />
				)}
				</div>
			</div>
		);
	}
}


	
const ChartRow = ({plays, title, id, index, field}) => {
	return (
		<div className="chart-row" 
			onClick={() => window.location.href = `/explore/${field}/${id}/`} >
			<span className="chart-index chart-field">{index}</span>
			<span className="chart-title chart-field">{title}</span>
			<span className="chart-plays chart-field">{plays}</span>
		</div>
	);
}

const ChartHeading = ({title}) => {
	return (
		<div className="chart-heading">
			<span className="chart-index chart-heading-field">#</span>
			<span className="chart-title chart-heading-field">{title}</span>
			<span className="chart-plays chart-heading-field">plays</span>
		</div>
	);
}