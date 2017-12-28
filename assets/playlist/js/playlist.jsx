import React from 'react';
import ReactDOM from 'react-dom';

import CollapsibleCommentPanel from './Comment.jsx';
import PlaylistDetails from './PlaylistDetails.jsx';
import SortablePlaylistTable from './PlaylistTable.jsx';

class Playlist extends React.Component {
	constructor(props) {
		super(props)
	}

	render() {
		return (
			<div id="container">
				<div id="col-left" className="col">
					<PlaylistDetails 
						title={this.props.show.title}
						subtitle={this.props.show.subtitle || ''}
						dj={this.props.show.dj}
						genre={this.props.show.genre || ''}
						subgenre={this.props.show.subgenre || []}
						desc={this.props.show.desc || ''} />
				</div>
				<div id="col-right" className="col">
					<SortablePlaylistTable spins={this.props.spins} />
				</div>
				<CollapsibleCommentPanel playlistId={this.props.show.id} comments={this.props.comments} />
			</div>
		);
	}
}

ReactDOM.render(
    React.createElement(Playlist, window.props),
    window.react_mount,
)
