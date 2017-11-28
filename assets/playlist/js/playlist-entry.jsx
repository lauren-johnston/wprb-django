import React from 'react';
import ReactDOM from 'react-dom';

const common = require('./common.js');

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
		super(props);
		this.state = { spins:this.props.spins };

		this.addSpin = this.addSpin.bind(this);
		this.removeSpin = this.removeSpin.bind(this);
	}

	renderSpins() {
		return this.state.spins.map((spin, index) => 
			<PlaylistEntryContainer
				key={spin.id}
				index={index}
				title={spin.title}
				artists={spin.artist}
				album={spin.album}
				label={spin.label}
				removeSpin={this.removeSpin}/>
			);
	}

	addSpin(newSpin) {
		let updatedSpins = this.state.spins.slice();
		updatedSpins.push(newSpin);
		this.setState({spins: updatedSpins});
	}

	removeSpin(spinIndex) {
		let updatedSpins = this.state.spins.slice();
		updatedSpins.pop(spinIndex);
		this.setState({spins: updatedSpins});
	}

	render() {
		return (
			<div id="playlist" className="col-content">
				<PlaylistTableHeader />
				{this.renderSpins()}
				<PlaylistEntryFormContainer
				    index={this.props.spins.length + 1}
				   	addSpin={this.addSpin}/>
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

class PlaylistEntryContainer extends React.Component {
	constructor(props) {
		super(props);
		this.deleteEntry = this.deleteEntry.bind(this);
	}

	deleteEntry() {
		console.log("deleting!");
		// Remove spin from the server
		fetch('entry/delete/', {
			method: "DELETE",
			headers: {
				"Content-Type": "application/json",
				"Accept": "application/json"
			},
			body: JSON.stringify({index: this.props.index}),
			mode: 'cors',
			cache: 'default'
		}).then(response => {
			return response.json();
		}).then(data => {
			this.props.removeSpin(this.props.index);
		});
	}

	render() {
		return (
			<PlaylistEntry
				index={this.props.index}
				title={this.props.title}
				artists={this.props.artists}
				album={this.props.album}
				label={this.props.label} 
				deleteEntry={this.deleteEntry}
			/>
			);
	}
}


class PlaylistEntry extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			title:  this.props.title,
			artists: this.props.artists,
			album:  this.props.album,
			label:  this.props.label,
			index: this.props.index
		};

		this.delete = this.delete.bind(this);
	}

	renderArtists() {
		return this.state.artists.map( (artistName) => 
			// Todo: replace this with a component with support for clicking and editing artists
			<span key={artistName} className="playlist-artist-name tagged-item">{artistName}</span> 
		);
	}

	delete() { this.props.deleteEntry(); }

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
				<div className="playlist-minus clickable" onClick={this.delete}> </div>
				<div className="playlist-comment clickable"> </div>
			</div>
		);
	}
}

class PlaylistEntryFormContainer extends React.Component {
	constructor(props) {
		super(props)
	}

	makeHeaders() {
		let headers = new Headers();
		let csrftoken = common.getCookie('csrftoken')
		headers.append("X-CSRFToken", csrftoken);
		console.log(headers);
		console.log(csrftoken);
		return headers;
	}

	postForm() {
		let headers = {
				"X-CSRFToken": common.getCookie('csrftoken'),
				"Accept": "application/json",
				"Content-Type": "multipart/form-data"
		};
		console.log(headers);

		// Post new spin to the server
		fetch('entry/add/', {
			method: "POST",
			//headers: headers,
			body: new FormData(document.getElementById("add-form")),
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
				postForm={this.postForm.bind(this)}/>
			);
	}
}

class PlaylistEntryForm extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			title:  '',
			artist: '',
			album:  '',
			label:  '',
			index: props.index
		}
		this.submit = this.submit.bind(this);
		this.handleChange = this.handleChange.bind(this);
	}

	handleChange(e) {
		let newState = {};
		newState[e.target.name] = e.target.value;
		this.setState(newState);
	}

	submit() {
		this.props.postForm();
		this.setState((state) => {
			return {
				title:  '',
				artist: '',
				album:  '',
				label:  '',
				index: state.index + 1
			};
		});
	}

	render() {
		return (
			<form className="entry-add-form" name='add-form' id="add-form">
				<div className="playlist-item playlist-entry" id="new-entry">
					<div className="playlist-movetab"> 
					</div>
					<div className="playlist-numbering" id="new-entry-number">
						{this.state.index}
					</div>
					<div className="playlist-text-cell playlist-title">
						<input 
							id="entry-add-title" 
							type="text" 
							name="title" 
							value={this.state.title}
							placeholder="track title" 
							onChange={this.handleChange} /> 
					</div>
					<div className="playlist-text-cell playlist-artist">
						<span className="playlist-artist-name tagged-item">
							<input 
								id="entry-add-artist" 
								type="text" 
								name="artist" 
								value={this.state.artist}
								placeholder="artist" 
								onChange={this.handleChange}/> 
						</span>
					</div>
					<div className="playlist-text-cell playlist-album">
						<input 
							id="entry-add-album" 
							type="text" 
							name="album" 
							value={this.state.album}
							placeholder="album" 
							onChange={this.handleChange}/> 
					</div>
					<div className="playlist-text-cell playlist-recordlabel">
						<input 
							id="entry-add-label" 
							type="text" 
							name="label" 
							value={this.state.label}
							placeholder="record label" 
							onChange={this.handleChange}/>
					</div>

					<div onClick={this.submit} className="playlist-plus clickable" id="add-entry-button">
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