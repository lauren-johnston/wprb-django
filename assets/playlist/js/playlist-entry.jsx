import React from 'react';
import ReactDOM from 'react-dom';

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
						subtitle={this.props.show.subtitle}
						dj={this.props.show.dj}
						genre={this.props.show.genre}
						subgenre={this.props.show.subgenre}
						desc={this.props.show.desc}/>
				</div>
				<div id="col-right" className="col">
					<PlaylistTable spins={this.props.spins} />
				</div>
			</div>
		);
	}
}

class PlaylistDetails extends React.Component {
	constructor(props) {
		super(props)
	}

	renderDJs() {
		return this.props.dj.map( (dj) => (
			<span key={dj} className="show-dj-name tagged-item">{dj}</span>
		));
	}

	renderSubgenres() {
		return this.props.subgenre.map( (subgenre) =>
			<div key={subgenre} className="show-subgenre-name tagged-item">{subgenre}</div>
		)
	}

	render() {
		return (
			<div id="show" className="col-content">
				<div className="show-title show-section">
					<h2 className="show-title-text">{this.props.title}</h2>
					<h3 className="show-subtitle-text">{this.props.subtitle}</h3>
				</div>
				<div className="show-dj show-section">
					{this.renderDJs()}
				</div>
				<div className="show-desc show-section">
					<p className="show-desc-text">
						{this.props.desc}
					</p>
				</div>
				<div className="show-genre show-section">
					<div className="genre-heading">Genre</div>
					<span className="show-genre-name tagged-item">{this.props.genre}</span>
				</div>
				<div className="show-subgenre show-section">
					<span className="genre-heading">Sub-genre Tags</span>
					<div id="subgenre-input">New Sub-genre</div>
					<div className="subgenre-add-button">ADD</div>
					{this.renderSubgenres()}
				</div>
			</div>
		);
	}

}

class PlaylistTable extends React.Component {
	constructor(props) {
		super(props)
	}

	renderSpins() {
		return this.props.spins.map((spin) => 
			<PlaylistEntry
				key={spin.id}
				index={spin.index}
				title={spin.title}
				artists={spin.artist}
				album={spin.album}
				label={spin.label}/>
			);
	}

	addSpin(jsonData) {
		console.log(jsonData);
	}

	render() {
		return (
			<div id="playlist" className="col-content">
				<PlaylistTableHeader />
				{this.renderSpins()}
				<PlaylistEntryFormContainer
				    index={this.props.spins.length + 1}
				   	addSpin={this.addSpin.bind(this)}/>
			</div>
		);
	}
}

class PlaylistTableHeader extends React.Component {
	constructor(props) {
		super(props)
	}

	render() {
		return (
			<div id="playlist-header">
				<span className="playlist-numbering playlist-heading"> </span>
				<span className="playlist-numbering playlist-heading"> </span>
				<span className="playlist-text-cell playlist-heading"> {this.props.title} </span>
				<span className="playlist-text-cell playlist-heading"> {this.props.artist} </span>
				<span className="playlist-text-cell playlist-heading"> {this.props.album} </span>
				<span className="playlist-text-cell playlist-heading"> {this.props.label} </span>
				<span className="playlist-numbering playlist-heading"> </span>
			</div>
		);
	}
}

PlaylistTableHeader.defaultProps = {
	title: 	'title',
	artist: 'artist',
	album: 	'album',
	label: 	'record label'
}

class PlaylistEntry extends React.Component {
	constructor(props) {
		super(props)
	}

	renderArtists() {
		return this.props.artists.map( (artistName) => 
			// Todo: replace this with a component with support for clicking and editing artists
			<span className="playlist-artist-name tagged-item">{artistName}</span> 
		);
	}

	render() {
		return (
			<div className="spin">
				<div className="playlist-movetab"> </div>
				<div className="playlist-numbering">
					{this.props.index}
				</div>
				<div className="playlist-text-cell playlist-title">
					{this.props.title}
				</div>
				<div className="playlist-text-cell playlist-artist">
					{this.renderArtists()}
				</div>
				<div className="playlist-text-cell playlist-album">
					{this.props.album}
				</div>
				<div className="playlist-text-cell playlist-recordlabel">
					{this.props.label}
				</div>
				<div className="playlist-comment"> </div>
			</div>
		);
	}
}

class PlaylistEntryFormContainer extends React.Component {
	constructor(props) {
		super(props)
	}

	getCsrfToken() {

	}
	
	makeFormData() {
		var data = new FormData();
		data.append('title', document.getElementById('entry-add-title').value);
		data.append('artist', document.getElementById('entry-add-artist').value);
		data.append('album', document.getElementById('entry-add-album').value);
		data.append('label', document.getElementById('entry-add-label').value);
		return data;
	}

	makeHeaders() {
		headers = new Headers();
		csrftoken = this.getCsrfToken()
		headers.append("X-CSRFToken", csrftoken);
		return headers;
	}

	postForm(e) {
		e.preventDefault();

		fetch('entry/add/', {
			method: "POST",
			headers: this.makeHeaders(),
			body: this.makeFormData(),
			mode: 'cors',
			cache: 'default'
		}).then(response => {
			return response.json();
		}).then(data => {
			this.props.addSpin(data);
		});
	}

	render() {
		return (
			<PlaylistEntryForm 
				index={this.props.index}
				addEntry={this.postForm.bind(this)}/>
			);
	}
}

class PlaylistEntryForm extends React.Component {
	constructor(props) {
		super(props)
	}

	render() {
		return (
			<form className="entry-add-form" name='add-form' id="add-form">
				<div className="playlist-item playlist-entry" id="new-entry">
					<div className="playlist-movetab"> 
					</div>
					<div className="playlist-numbering" id="new-entry-number">
						{this.props.index}
					</div>
					<div className="playlist-text-cell playlist-title">
						<input id="entry-add-title" type="text" name="title" placeholder="track title" /> 
					</div>
					<div className="playlist-text-cell playlist-artist">
						<span className="playlist-artist-name tagged-item">
							<input id="entry-add-artist" type="text" name="artist" placeholder="artist" /> 
						</span>
					</div>
					<div className="playlist-text-cell playlist-album">
						<input id="entry-add-album" type="text" name="album" placeholder="album" /> 
					</div>
					<div className="playlist-text-cell playlist-recordlabel">
						<input id="entry-add-label" type="text" name="label" placeholder="record label" />
					</div>

					<div onClick={this.props.addEntry} className="playlist-plus clickable" id="add-entry-button">
					</div>
				</div>
			</form>
		);
	}
}

ReactDOM.render(
    React.createElement(Playlist, window.props),
    window.react_mount,
)