import React from 'react';
import ReactDOM from 'react-dom';

import Search from './Search.jsx';
import PlayGraph from './PlayGraph.jsx';
import {ExploreSpinsTable, ExploreDetails} from './Explore.jsx';

class ExploreMusicPage extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		// Get artist if applicable
		let by = '';
		if (this.props.field === 'song' || this.props.field === 'album')
			by = ` by ${this.props.spins[0].artist}`;

		let details = {
			title: this.props.title,
			subtitle: `${this.props.field}${by}`,
			desc: 'Description goes here!'
		};

		return (
			<div className="explore">
				<div id="content-main">
					<div id="content-left">
						<ExploreDetails {...details}/>
						<ExploreSpinsTable spins={this.props.spins} />
					</div>
					<div id="content-right">
						<Search />
						<PlayGraph 
							field={this.props.field} 
							data={this.props.spins.map(spin => spin.datetime)} />
					</div>
				</div>
			</div>
		);
	}
}

ReactDOM.render(
    React.createElement(ExploreMusicPage, window.props),
    window.react_mount,
);