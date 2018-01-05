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
		let details = {
			title: this.props.title,
			subtitle: `(${this.props.field})`,
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
						<PlayGraph data={this.props.spins.map(spin => spin.datetime)}/>
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