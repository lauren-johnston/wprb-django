import React from 'react';
import Moment from 'moment';

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

		const dateField = this.props.showDate && this.props.datetime ? (
				<div className="play-field timestamp-field">
					<ClickableExploreField
						field="playlist"
						value={Moment(this.props.datetime, 'X').format('MM/DD/YY')}
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
export const ExploreShows = ({playlists}) => {
	return (
		<div className="show-container">
			<div className="show-container-header">
				<span className="show-heading show-date">Date</span>
		        <span className="show-heading show-title">Title</span>
		        <span className="show-heading show-subtitle">Subtitle</span>
	        </div>
	        <div className="shows">
	        {playlists.map((playlist) => (
	        	<div key={playlist.id} className="show-list-entry">
	            	<a href={`/explore/playlist/${playlist.id}/`} className="playlist-link">
	                	<span className="show-text-cell show-date">{Moment(playlist.date, 'X').format('dddd, MM/DD/YY @h:mma')}</span>
	                	<span className="show-text-cell show-title">{playlist.title}</span>
	                	<span className="show-text-cell show-subtitle">{playlist.subtitle}</span>
	            	</a> 
		        </div>
	        ))}
	        </div>
        </div>
	);
}
