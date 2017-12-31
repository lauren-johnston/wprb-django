import React from 'react';
import ReactDOM from 'react-dom';

import {ExploreDetails, ExplorePlaylist} from './Explore.jsx';
import {EmbeddedCommentPanel} from './Comment.jsx';

class ExplorePlaylistPage extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<div className="explore">
				<div id="content-main">
					<div id="content-left">
						<ExploreDetails title={this.props.title} />
						<ExplorePlaylist spins={this.props.spins} />
					</div>
					<div id="content-right">
						<EmbeddedCommentPanel playlistId={this.props.show.id} comments={this.props.comments} />
					</div>
				</div>
			</div>
		);
	}
}

ReactDOM.render(
    React.createElement(ExplorePlaylistPage, window.props),
    window.react_mount,
);
