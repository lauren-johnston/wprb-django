import React from 'react';
import ReactDOM from 'react-dom';
import CommentPanel from './Comment.jsx';

class ExploreDetails extends React.Component {
	constructor(props) {
		super(props);
	}
	
	render() {
		return (
			<div className="details">
				<h1 className="details-title">{this.props.title}</h1>
				<h3 className="details-subtitle">{this.props.subtitle}</h3>
				<div className="details-description">{this.props.desc}</div>
			</div>
		);
	}
}

class ExploreChart extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		return null;
	}
}


class ExplorePage extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<div className="explore">
				<ExploreDetails />
				<ExplorePlaysTable plays={this.props.plays} />
				<ExploreChart title={this.props.title}/>
			</div>
		);
	}
}

class ExplorePlaysTable extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<div className="play-container">
				<ExplorePlaysHeader />
				<div className="plays">
					{this.props.plays.map((play) =>
						<ExplorePlay key={play.spinId} {...play}/>)}
				</div>
			</div>
		);
	}
}

function ExplorePlaysHeader() {
	return (
		<div className="play-container-header">
			<div className="play-field artist-field">artist</div>
			<div className="play-field song-field">song</div>
			<div className="play-field album-field">album</div>
			<div className="play-field label-field">label</div>
			<div className="play-field dj-field">dj</div>
			<div className="play-field date-field">date</div>
		</div>
	);
}

class ExplorePlay extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<div className="play">
				<div className="play-field artist-field">
					{this.props.artist.map((artist) =>
						<ClickableExploreField
							field="artist"
							key={artist.id}
							value={artist.name}
							id={artist.id} />)}
				</div>
				<div className="play-field song-field">
					<ClickableExploreField
						field="song"
						value={this.props.song}
						id={this.props.songId} />
				</div>
				<div className="play-field album-field">
					<ClickableExploreField
						field="album"
						value={this.props.album}
						id={this.props.albumId} />
				</div>
				<div className="play-field label-field">
					<ClickableExploreField
						field="label"
						value={this.props.label}
						id={this.props.labelId} />
				</div>
				<div className="play-field dj-field">
					{this.props.dj.map((dj) =>
						<ClickableExploreField
							field="dj"
							key={dj.id}
							value={dj.name}
							id={dj.id} />)}
				</div>
				<div className="play-field timestamp-field">
					<ClickableExploreField
						field="playlist"
						value={this.props.date}
						id={this.props.playlistId} />
				</div>
			</div>
		);
	}
}

class ClickableExploreField extends React.Component {
	constructor(props) {
		super(props);

		this.followLink = this.followLink.bind(this);
	}

	followLink() {
		window.location.href = `/explore/${this.props.field}/${this.props.id}/`;
	}

	render() {
		return (
			<span className="field-link" onClick={this.followLink}>
				{this.props.value}
			</span>
		)
	}
}

ReactDOM.render(
    React.createElement(ExplorePage, window.props),
    window.react_mount,
)
