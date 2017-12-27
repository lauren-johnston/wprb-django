import React from 'react';
import ReactDOM from 'react-dom';

import {ExploreDetails, ExploreShows} from './Explore.jsx';

class ExploreDJPage extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<div className="explore">
				<div id="content-top">
					<ExploreDetails title={this.props.title} />
				</div>
				<div id="content-main">
					<div id="content-left">
						<ExploreShows shows={this.props.shows} />
					</div>
					<div id="content-right">
						Charts go here !
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
