import React from 'react';
import ReactDOM from 'react-dom';
import Moment from 'moment';

import Search from './Search.jsx';
import {ExploreDetails, ExplorePlaylist} from './Explore.jsx';
import {EmbeddedCommentPanel} from './Comment.jsx';

class ExplorePlaylistPage extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		console.log(this.props.show.datetime)
		let time = Moment(this.props.show.datetime, 'X');
		let start = time.format('ddd MMM D, Y h:mm');
		let end = time.add(this.props.show.length, 'h').format('h:mma');
		let details = {
			title: `${this.props.show.title} with ${this.props.show.dj.join(' & ')}`,
			subtitle: `${start}-${end}`,
			desc: this.props.show.subtitle + (this.props.show.desc ? `: ${this.props.show.desc}` : '')
		};

		return (
			<div className="explore">
				<div id="content-main">
					<div id="content-left">
						<ExploreDetails {...details}/>
						<ExplorePlaylist spins={this.props.spins} />
					</div>
					<div id="content-right">
						<Search />
						<EmbeddedCommentPanel 
							playlistId={this.props.show.id} 
							comments={this.props.comments} 
							userId={this.props.userinfo.id} />
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
