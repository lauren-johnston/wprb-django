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
		this.state = {spins:this.props.spins};

		this.addSpinToView      = this.addSpinToView.bind(this);
		this.removeSpinFromView = this.removeSpinFromView.bind(this);
		this.updateSpinInView   = this.updateSpinInView.bind(this);
	}


	renderSpins() {
		return this.state.spins.map((spin, index) => 
				<PlaylistEntryContainer
					key={spin.id}
					index={index + 1}
					title={spin.title}
					artist={spin.artist}
					album={spin.album}
					label={spin.label}
					removeSpinFromView={this.removeSpinFromView}
					updateSpinInView={this.updateSpinInView}/>
			);
	}

	updateSpinInView(spin) {
		this.removeSpinFromView(spin.index);
		this.addSpinToView(spin);
	}

	addSpinToView(spin) {
		let updatedSpins = this.state.spins.slice();
		updatedSpins.splice(spin.index, 0, spin);
		this.setState({ spins: updatedSpins });
	}

	removeSpinFromView(index) {
		let updatedSpins = this.state.spins.slice();
		updatedSpins.pop(index);
		this.setState({ spins: updatedSpins });
	}

	render() {
		console.log("rerendering!");
		console.log("Current spins");
		console.log(this.state.spins);
		return (
			<div id="playlist" className="col-content">
				<PlaylistTableHeader />
				{this.renderSpins()}
				<PlaylistEntryFormContainer
					index={this.state.spins.length+ 1}
					addSpinToView={this.addSpinToView} />
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

		this.saveEntry = this.saveEntry.bind(this);
		this.saveInput = this.saveInput.bind(this);

		this.deleteSpinFromDB = this.deleteSpinFromDB.bind(this);
		this.updateSpinInDB   = this.updateSpinInDB.bind(this);

		this.state = {_entry: undefined}
	}

	saveEntry(c) { this.setState({_entry: c}) }
	saveInput(c) { 
		let field = c.state.name;
		let newState = {};
		newState[field] = c;
		this.setState(newState);
	}

	deleteSpinFromDB() {
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
			if(!data.success) {
				console.log("Ajax Error:");
				console.log(data);
				return;
			}
			this.props.removeSpinFromView(this.props.index);
		});
	}

	updateSpinInDB() {
		// Build body of request
		let updateRequestBody = { index: this.props.index }
		for(let field of ['title', 'artist', 'album', 'label'])
			if(field in this.state) {
				console.log(field);
				console.log(this.state[field]);
				updateRequestBody[field] = this.state[field].state.value;
			}

		console.log("Here's our state");
		console.log(this.state);
		console.log("Here's the update request body..");
		console.log(updateRequestBody);

		// Update spin in the server
		fetch('entry/update/', {
			method: "PUT",
			headers: {
				"Content-Type": "application/json",
				"Accept": "application/json"
			},
			body: JSON.stringify(updateRequestBody),
			mode: 'cors',
			cache: 'default'
		}).then(response => {
			return response.json();
		}).then(data => {
			if(!data.success) {
				console.log("Ajax Error:");
				console.log(data);
				return;
			}
			console.log(data);
			this.props.updateSpinInView(data.spin);
		});
	}

	render() {
		return (
			<PlaylistEntry
				index={this.props.index}
				title={this.props.title}
				artist={this.props.artist}
				album={this.props.album}
				label={this.props.label} 
				delete={this.deleteSpinFromDB}
				update={this.updateSpinInDB}
				ref={this.entrySet}
				saveInput={this.saveInput}
			/>
			);
	}
}


class PlaylistEntry extends React.Component {
	constructor(props) {
		super(props)
	}

	renderArtists() {
		return this.props.artists.map( (artistName) => 
			// Todo: replace this with a component with support for clicking and editing artists
			<span key={artistName} className="playlist-artist-name tagged-item">{artistName}</span> 
		);
	}

	render() {
		return (
			<div className="spin">
				<div className="playlist-movetab"> </div>
				<div className="playlist-numbering"> {this.props.index} </div>
				<PlaylistTextInput ref={this.props.saveInput} value={this.props.title}      name='title' inDB={true} update={this.props.update}/>
				<PlaylistTextInput ref={this.props.saveInput} value={this.props.artist}     name='artist'inDB={true} update={this.props.update}/>
				<PlaylistTextInput ref={this.props.saveInput} value={this.props.album}      name='album' inDB={true} update={this.props.update}/>
				<PlaylistTextInput ref={this.props.saveInput} value={this.props.label}      name='label' inDB={true} update={this.props.update}/>
				<div className="playlist-minus clickable" onClick={this.props.delete}> </div>
				<div className="playlist-comment clickable"> </div>
			</div>
		);
	}
}

class PlaylistEntryFormContainer extends React.Component {
	constructor(props) {
		super(props)
		this.addSpinToDB = this.addSpinToDB.bind(this);
	}

	makeHeaders() {
		let headers = new Headers();
		let csrftoken = common.getCookie('csrftoken')
		headers.append("X-CSRFToken", csrftoken);
		return headers;
	}

	addSpinToDB() {
		// Post new spin to the server
		fetch('entry/add/', {
			method: "POST",
			//headers: {
			// 		"X-CSRFToken": common.getCookie('csrftoken'),
			// 		"Accept": "application/json",
			// 		"Content-Type": "multipart/form-data"
			// }
			body: new FormData(document.getElementById("add-form")),
			mode: 'cors',
			cache: 'default'
		}).then(response => {
			return response.json();
		}).then(data => {
			if(!data.success) {
				console.log("Ajax Error:");
				console.log(data);
				return;
			}
			this.props.addSpinToView(data.spin);
		});
	}

	render() {
		return (
			<PlaylistEntryForm 
				index={this.props.index}
				addSpinToDB={this.addSpinToDB}/>
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
					<div className="playlist-movetab"> </div>
					<div className="playlist-numbering"> {this.state.index} </div>
					<PlaylistTextInput 
						name="title"
						placeholder="song title"
						value={this.state.title}
						editing={true}
						inDB={false}
					/>
					<PlaylistTextInput 
						name="artist"
						placeholder="artist"
						value={this.state.artist}
						editing={true}
						inDB={false}
					/>
					<PlaylistTextInput 
						name="album"
						placeholder="album"
						value={this.state.album}
						editing={true}
						inDB={false}
					/>
					<PlaylistTextInput 
						name="label"
						placeholder="album label"
						value={this.state.album}
						editing={true}
						inDB={false}
					/>
					<div onClick={this.submit} className="playlist-plus clickable" id="add-entry-button">
					</div>
				</div>
			</form>
		);
	}
}

class PlaylistTextInput extends React.Component {
	constructor(props){
		super(props);
		this.state = {
			value: this.props.value,
			name:  this.props.name,
			placeholder: this.props.placeholder,
			editing: this.props.editing,
			inDB: this.props.inDB
		}

		this.handleKeyPress = this.handleKeyPress.bind(this);
		this.toggleEditing = this.toggleEditing.bind(this);
		this.updateValue  = this.updateValue.bind(this);
	}

	handleKeyPress(e) {
		if(this.state.inDB){
			if(e.key == 'Enter') {
				this.toggleEditing();
				this.props.update();
			}
		}		
	}

	updateValue(e) { this.setState({value:e.target.value}); }

	toggleEditing() {
		this.setState((state) => {
			return {
				editing: !state.editing
			};
		});
	}

	render() {
		if(this.state.editing) {
			return (
				<div className="playlist-text-cell clickable" >
						<input 
							type="text" 
							name={this.state.name}
							value={this.state.value}
							placeholder={this.state.placeholder} 
							onChange={this.updateValue}
							onKeyPress={this.handleKeyPress}/>
				</div>
			)
		}
		else {
			return (
				<div className="playlist-text-cell clickable"
					 onDoubleClick={this.toggleEditing}>
					{this.state.value}
				</div>
				)
		}
	}
}

ReactDOM.render(
    React.createElement(Playlist, window.props),
    window.react_mount,
)