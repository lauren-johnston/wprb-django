import React from 'react';

export default class Charts extends React.Component {
	constructor(props) {
		super(props);

		this.state = {field: 'artist'};
	}

	componentDidMount() {
		fetch(`/explore/charts?dj=${this.props.dj}&after=${this.props.after}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
        }).then(response => response.json()).then(charts => {
            this.setState({charts});
        });
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
				<h2 className="chart-main-title">{`Top Charts for ${this.props.for}`}</h2>
				<ChartHeading title={this.state.field} />
				<div className="chart-row-container">
				{this.state.charts ? this.state.charts[this.state.field].map((item, index) => 
					<ChartRow key={item.id}
						field={this.state.field}
						title={item.name} 
						id={item.id} 
						index={index+1}
						plays={item.plays} />
				) : <div className="charts-loading">Loading charts...<br />
						<img src="/static/playlist/css/media/loading.gif" height="50" width="50"/>
					</div>}
				</div>
				<div className="chart-control">
					<ChartToggle field="artist" />
					<ChartToggle field="label" />
					<ChartToggle field="album" />
					<ChartToggle field="song" />
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