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

		this.renderSpins        = this.renderSpins.bind(this);
		this.addSpinToView      = this.addSpinToView.bind(this);
		this.removeSpinFromView = this.removeSpinFromView.bind(this);
		this.updateSpinInView   = this.updateSpinInView.bind(this);
	}


	renderSpins() {
		let spinList = this.state.spins.sort((spina, spinb) => {
			return spina.index - spinb.index;
		}).map((spin, index) => 
			<PlaylistEntryContainer
				key={spin.id}
				index={index + 1}
				title={spin.title}
				artist={spin.artist}
				album={spin.album}
				label={spin.label||''}
				removeSpinFromView={this.removeSpinFromView}
				updateSpinInView={this.updateSpinInView}/>
		);

		console.log("This was spinlist on render spins...");
		console.log(spinList);

		return spinList;
	}

	updateSpinInView(spin) {
		let updatedSpins = this.state.spins.slice();
		console.log("Placing new spin at index " + spin.index)
		// Spin indices are 1 oriented
		updatedSpins[spin.index - 1] = spin;
		this.setState({ spins: updatedSpins });
	}

	addSpinToView(spin) {
		let updatedSpins = this.state.spins.slice();
		updatedSpins.splice(spin.index - 1, 0, spin);
		this.setState({ spins: updatedSpins });
	}

	removeSpinFromView(index) {
		let updatedSpins = this.state.spins.slice();
		updatedSpins.splice(index-1, 1);
		// console.log("old spins");
		// console.log(this.state.spins);
		// console.log("shallow copy");
		// console.log(updatedSpins);
		// console.log('index');
		// console.log(index);
		// // Spin indices are 1-oriented
		// updatedSpins.pop((index - 1));
		// console.log("after popping index - 1");
		// console.log(updatedSpins);
		this.setState({ spins: updatedSpins} );
	}

	render() {
		console.log("rerendering!");
		console.log("Current spins");
		console.log(this.state.spins);
		let spinList = this.renderSpins();
		return (
			<div id="playlist" className="col-content">
				<PlaylistTableHeader />
				{spinList}
				<PlaylistEntryFormContainer
					key={spinList.length + 1}
					index={spinList.length + 1}
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

		this.setEntry = this.setEntry.bind(this);
		this.setInput = this.setInput.bind(this);

		this.deleteSpinFromDB = this.deleteSpinFromDB.bind(this);
		this.updateSpinInDB   = this.updateSpinInDB.bind(this);

		this.state = {
			entry: undefined,
			inputs: {}
		}
	}

	setEntry(c) { this.setState({entry: c}) }

	setInput(c) {
		let isMount = (c==null? false:true);
		if(isMount) {
			this.setState((state) => {
				let newInputs = state.inputs;
				newInputs[c.state.name] = c;
				return {
					inputs:newInputs
				}
			});
		}
	}

	deleteSpinFromDB() {
		// Close all inputs (for a small bug)
		for(let inputKey of Object.keys(this.state.inputs)) 
			this.state.inputs[inputKey].setState({editing:false})
		
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
		let body = { index: this.props.index }
		for(let inputKey of Object.keys(this.state.inputs))
			body[inputKey] = this.state.inputs[inputKey].state.value;

		console.log("Here's our state");
		console.log(this.state);
		console.log("Here's the update request body..");
		console.log(body);

		// Update spin in the server
		fetch('entry/update/', {
			method: "PUT",
			headers: {
				"Content-Type": "application/json",
				"Accept": "application/json"
			},
			body: JSON.stringify(body),
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
				setInput={this.setInput}
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
				<PlaylistTextInput 
					ref={this.props.setInput} 
					value={this.props.title}     
					name='title' 
					inDB={true} 
					update={this.props.update}
					delete={this.props.delete}/>
				<PlaylistTextInput 
					ref={this.props.setInput} 
					value={this.props.artist}     
					name='artist'
					inDB={true} 
					update={this.props.update}
					delete={this.props.delete}/>
				<PlaylistTextInput 
					ref={this.props.setInput} 
					value={this.props.album}      
					name='album' 
					inDB={true} 
					update={this.props.update}
					delete={this.props.delete}/>
				<PlaylistTextInput 
					ref={this.props.setInput} 
					value={this.props.label}      
					name='label' 
					inDB={true} 
					update={this.props.update}
					delete={this.props.delete}/>
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
			index: props.index,
			inputs: {}
		}

		this.submit = this.submit.bind(this);
		this.saveInput = this.saveInput.bind(this);
		this.clearInputs = this.clearInputs.bind(this);
		this.titleFocus  = this.titleFocus.bind(this);
	}

	saveInput(input) {
		let isMount = (input==null? false:true);
		if(isMount) {
			let newState = {inputs: this.state.inputs};
			newState.inputs[input.state.name] = input;
			this.setState(newState);
		}
	}

	clearInputs() {
		for(let inputKey of Object.keys(this.state.inputs)) {
			this.state.inputs[inputKey].setState((state) => {
				return {
					value:''
				}
			});
		}
	}

	titleFocus() {
		console.log(this.state.inputs);
		if('title' in Object.keys(this.state.inputs)) {
			console.log("TItle is there..");
			this.state.inputs['title'].focus();
		}
	}

	submit() {
		this.props.addSpinToDB();
		this.clearInputs();
		this.setState((state) => {
			return {
				index: state.index + 1
			}
		});
		this.titleFocus();
	}

	render() {
		return (
			<form className="entry-add-form" name='add-form' id="add-form">
				<div className="spin" id="new-entry">
					<div className="playlist-movetab"> </div>
					<div className="playlist-numbering"> {this.state.index} </div>
					<PlaylistTextInput 
						ref={this.saveInput}
						name="title"
						placeholder="song title"
						value=''
						editing={true}
						inDB={false}
						submit={this.submit}
					/>
					<PlaylistTextInput
					    ref={this.saveInput} 
						name="artist"
						placeholder="artist"
						value=''
						editing={true}
						inDB={false}
						submit={this.submit}
					/>
					<PlaylistTextInput 
					    ref={this.saveInput}
						name="album"
						placeholder="album"
						value=''
						editing={true}
						inDB={false}
						submit={this.submit}
					/>
					<PlaylistTextInput 
					    ref={this.saveInput}
						name="label"
						placeholder="album label"
						value=''
						editing={true}
						inDB={false}
						submit={this.submit}
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
			inDB: this.props.inDB,
			update: this.props.update,
			submit: this.props.submit,
			delete: this.props.delete
		}

		this.handleKeyDown = this.handleKeyDown.bind(this);
		this.toggleEditing = this.toggleEditing.bind(this);
		this.updateValue  = this.updateValue.bind(this);
	}

	handleKeyDown(e) {
		if (this.state.inDB) {
			if(e.key == 'Enter') {
				this.toggleEditing();
				this.state.update();
			}
			else if (e.metaKey) {
				if(e.key == "Backspace") {
					this.toggleEditing();
					this.state.delete();
				}
			}
		}
		else {
			if(e.key == 'Enter')
				this.state.submit();
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
		let onDblClick = null;
		if(this.state.inDB) onDblClick = this.toggleEditing;

		if(this.state.editing) {
			return (
				<div className="playlist-text-cell dbl-clickable" 
					 onDoubleClick={onDblClick}>
						<input 
							type="text" 
							name={this.state.name}
							value={this.state.value}
							placeholder={this.state.placeholder} 
							onChange={this.updateValue}
							onKeyDown={this.handleKeyDown}/>
				</div>
			)
		}
		else if(!this.state.editing) {
			return (
				<div className="playlist-text-cell dbl-clickable"
					 onDoubleClick={onDblClick}>
					{this.state.value}
				</div>
			);
		}
	}
}

ReactDOM.render(
    React.createElement(Playlist, window.props),
    window.react_mount,
)