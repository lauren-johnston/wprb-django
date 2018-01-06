import React from 'react';
import ReactDOM from 'react-dom';

import Charts from './Charts.jsx';
import Search from './Search.jsx';
import {ExploreDetails, ExploreShows} from './Explore.jsx';

class ExploreDJPage extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<div className="explore">
				<div id="content-main">
					<div id="content-left">
						<ExploreDetails title={this.props.title} />
						<ExploreShows playlists={this.props.playlists} />
					</div>
					<div id="content-right">
						<Search />
						<Charts charts={this.props.charts} for={this.props.title}/>
					</div>
				</div>
			</div>
		);
	}
}

ReactDOM.render(
    React.createElement(ExploreDJPage, window.props),
    window.react_mount,
)
