import React from 'react';

/**
 *
 */
export default class ClickableExploreField extends React.Component {
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
		);
	}
}

/**
 * 
 */
export class ExploreDetails extends React.Component {
	constructor(props) {
		super(props);
	}
	
	render() {
		return (
			<div className="details">
				<div className="details-area">
					<h1 className="details-title">{this.props.title}</h1>
					<h3 className="details-subtitle">{this.props.subtitle}</h3>
				</div>
				<div className="details-area details-description">{this.props.desc}</div>
			</div>
		);
	}
}

/**
 *
 */
export class ExploreSpinsTable extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		console.log(this.props);
		return (
			<div className="play-container">
				<ExploreHeader 
					showDJ="true"
					showDate="true" />
				<div className="plays">
					{this.props.spins.map((spin) =>
						<ExploreSpin {...spin} 
							key={spin.spinId} 
							showDJ="true" 
							showDate="true" />
					)}
				</div>
			</div>
		);
	}
}

/**
 *
 */
export class ExplorePlaylist extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {	
		return (
			<div className="play-container">
				<ExploreHeader 
					showIndex={true} 
					showDJ={false} 
					showDate={false} />
				<div className="plays">
					{this.props.spins.map((spin, index) =>
						<ExploreSpin {...spin} 
							key={spin.spinId}
							index={index + 1}
							showDJ="true" 
							showDate="true" />
					)}
				</div>
			</div>
		)
	}
}

/**
 *
 */
const ExploreHeader = ({showIndex, showDJ, showDate}) => {
	const index = showIndex
		? <div className="play-field index-field">#</div>
		: null;

	const dj = showDJ
		? <div className="play-field dj-field">dj</div>
		: null;

	const date = showDate
		? <div className="play-field date-field">date</div>
		: null;

	return (
		<div className="play-container-header">
			{index}
			<div className="play-field artist-field">artist</div>
			<div className="play-field song-field">song</div>
			<div className="play-field album-field">album</div>
			<div className="play-field label-field">label</div>
			{dj}
			{date}
			<div className="section-title-underline"></div>
		</div>
	);
}

/**
 *
 */
class ExploreSpin extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		const indexField = this.props.index ? (
				<div className="play-field index-field">{this.props.index}</div>
			) : null;

		const djField = this.props.showDJ && this.props.dj ? (
				<div className="play-field dj-field">
					{this.props.dj.map((dj) =>
						<ClickableExploreField
							field="dj"
							key={dj.id}
							value={dj.name}
							id={dj.id} />)}
				</div>
			) : null;

		const dateField = this.props.showDate && this.props.date ? (
				<div className="play-field timestamp-field">
					<ClickableExploreField
						field="playlist"
						value={this.props.date}
						id={this.props.playlistId} />
				</div>
			) : null;

		return (
			<div className="play">
				{indexField}
				<div className="play-field artist-field">
					{/*this.props.artist.map((artist) =>*/}
					<ClickableExploreField
						field="artist"
						key={this.props.artistId}
						value={this.props.artist}
						id={this.props.artistId} />
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
				{djField}
				{dateField}
			</div>
		);
	}
}

/**
 *
 */
export class ExploreShows extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			null
		);
	}
}
