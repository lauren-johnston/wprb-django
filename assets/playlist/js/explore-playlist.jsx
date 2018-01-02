import React from 'react';
import ReactDOM from 'react-dom';

import Search from './Search.jsx';
import {ExploreDetails, ExplorePlaylist} from './Explore.jsx';
import {EmbeddedCommentPanel} from './Comment.jsx';

class ExplorePlaylistPage extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		let details = {
			title: `${this.props.show.title} w/${this.props.show.dj.join(' & ')}`,
			subtitle: `${this.props.show.date} @${this.props.show.time}`,
			desc: this.props.show.desc
		}

		return (
			<div className="explore">
				<div id="content-main">
					<div id="content-left">
						<ExploreDetails {...details}/>
						<ExplorePlaylist spins={this.props.spins} />
					</div>
					<div id="content-right">
						<Search />
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
