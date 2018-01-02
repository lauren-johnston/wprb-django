import React from 'react';
import ReactDOM from 'react-dom';

import Search from './Search.jsx';
import {ExploreSpinsTable, ExploreDetails} from './Explore.jsx';

class ExploreMusicPage extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<div className="explore">
				<div id="content-main">
					<div id="content-left">
						<ExploreDetails title={this.props.title} />
						<ExploreSpinsTable spins={this.props.spins} />
					</div>
					<div id="content-right">
						<Search />
						Charts go here!
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