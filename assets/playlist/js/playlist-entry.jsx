import React from 'react';
import ReactDOM from 'react-dom';

import {SortableContainer, 
		SortableElement, 
		SortableHandle,
		arrayMove} from 'react-sortable-hoc';

const common = require('./common.js');
// Following syntax from online
const DragHandle = SortableHandle(() => <div className="playlist-movetab"/>);
const SortablePlaylistEntry = 
	SortableElement(function({spin, spindex, removeSpinFromView, updateSpinInView}) {
	// Hacked to remove index keyword (demanded by Sortable Element)
	return (
		<PlaylistEntryContainer
				title={spin.title}
				artist={spin.artist}
				album={spin.album}
				label={spin.label||''}
				spindex={spindex}
				removeSpinFromView={removeSpinFromView}
				updateSpinInView={updateSpinInView}/>
		);
});
const SortablePlaylistList = 
	SortableContainer(({spins, removeSpinFromView, updateSpinInView}) => {
	// index MUST BE index in array or Sortable will blow up
	return (
		<div className='playlist-table-contents'>
		 {
		 	spins.map((spin, index) => {
		 		return <SortablePlaylistEntry 
		 			key={spin.id}
		 			spin={spin}
		 			spindex={index + 1}
		 			index={index}
		 			removeSpinFromView={removeSpinFromView}
		 			updateSpinInView={updateSpinInView} />
		 	})
		 }
		</div>
		);
});

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
					<SortablePlaylistTable spins={this.props.spins} />
				</div>
			</div>
		);
	}
}

class PlaylistDetails extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			title: this.props.title,
			subtitle: this.props.subtitle,
			djs: this.props.dj,
			genre: this.props.genre,
			subgenres: this.props.subgenre,
			desc: this.props.desc
		}

		this.updateGeneral = this.updateGeneral.bind(this);
		this.updateSubgenre = this.updateSubgenre.bind(this);
		this.updateDJ = this.updateDJ.bind(this);
	}

	putToServer(identifier, value) {
		let body = {};
		body[identifier] = value;
		fetch(`meta/${identifier}/`, {
			method: "PUT",
			body: JSON.stringify(body),
		}).then(response => response.json()).then(json => {
			console.log(json);
			if(json.ok) {
				// Do something
			}
		});
	}

	updateGeneral(identifier, value) {
		let newState = this.state;
		newState[identifier] = value;
		this.setState(newState);
	}
	updateSubgenre(identifier, value) {
		let subgenres = this.state.subgenres;
		subgenres[identifier] = value;
		this.setState({subgenres: subgenres});
	}
	updateDJ(identifier, value) {
		let djs = this.state.djs;
		djs[identifier] = value;
		this.setState({djs: djs});
	}

	renderDJs() {
		return this.state.djs.map( (dj, index) => (
			<ResponsiveTextInput
				key={dj} 
				value={dj}
				identifier={index}
				handleInput={this.updateDJ}
				/>
		));
	}

	renderSubgenres() {
		return this.props.subgenre.map( (subgenre, index) => (
			<ResponsiveTextInput
				key={subgenre}
				value={subgenre}
				identifier={index}
				handleInput={this.updateSubgenre} />
		));
	}

	render() {
		return (
			<div id="show" className="col-content">
				<div className="show-title show-section">
					<h2 className="show-title-text">
						{this.props.title}
					</h2>
					<h3 className="show-subtitle-text">
						<ResponsiveTextInput
							value={this.state.subtitle}
							identifier={'subtitle'}
							handleInput={this.updateGeneral}
							update={this.putToServer}
							/>
					</h3>
				</div>
				<div className="show-dj show-section">
					{this.renderDJs()}
				</div>
				<div className="show-desc show-section">
					<div className="show-desc-text">
						<ResponsiveTextInput
							value={this.state.desc}
							identifier={'desc'}
							handleInput={this.updateGeneral}
							update={this.putToServer}
							/>
					</div>
				</div>
				<div className="show-genre show-section">
					<div className="genre-heading">Genre</div>
						<ResponsiveTextInput
							value={this.state.genre}
							identifier={'genre'}
							handleInput={this.updateGeneral}
							update={this.putToServer}
							/>
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

class SortablePlaylistTable extends React.Component {
	constructor(props) {
		super(props);
		this.state = {spins:this.props.spins};

		this.addSpinToView      = this.addSpinToView.bind(this);
		this.removeSpinFromView = this.removeSpinFromView.bind(this);
		this.updateSpinInView   = this.updateSpinInView.bind(this);
		
		this.onSortEnd          = this.onSortEnd.bind(this);
	}

	updateSpinInView(spin) {
		let updatedSpins = this.state.spins.slice();
		updatedSpins[spin.spindex - 1] = spin;
		this.setState({ spins: updatedSpins });
	}

	addSpinToView(spin) {
		let updatedSpins = this.state.spins.slice();
		updatedSpins.push(spin);
		this.setState({ spins: updatedSpins});
	}

	removeSpinFromView(spindex) {
		let updatedSpins = this.state.spins.slice();
		updatedSpins.splice(spindex-1, 1);
		this.setState({ spins: updatedSpins });
	}

	onSortEnd({oldIndex, newIndex}) {
		let newSpins = arrayMove(this.state.spins, oldIndex, newIndex);
		this.setState({spins: newSpins});

		// Move spin in the server
		if(oldIndex != newIndex) 
			fetch('entry/move/', {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
					"Accept": "application/json"
				},
				body: JSON.stringify({oldSpindex: oldIndex+1, newSpindex: newIndex+1}),
				mode: 'cors',
			}).then(response => response.json()).then(json => {
				console.log(json);
				if(json.ok) {} // Something
			});
	};

	render() {
		return (
			<div id="playlist" className="col-content">
				<PlaylistTableHeader />
				<div className="playlist-table-contents">
					<SortablePlaylistList 
						spins = {this.state.spins}
						updateSpinInView={this.updateSpinInView}
						removeSpinFromView={this.removeSpinFromView}
						onSortEnd={this.onSortEnd}
						useDragHandle={true}/>
					<PlaylistEntryFormContainer
						key={this.state.spins.length + 1}
						spindex={this.state.spins.length + 1}
						addSpinToView={this.addSpinToView} />
				</div>
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

// All the logic of a Playlist Entry
class PlaylistEntryContainer extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			title: this.props.title,
			artist: this.props.artist,
			album: this.props.album,
			label: this.props.label
		}

		this.deleteSpinFromDB = this.deleteSpinFromDB.bind(this);
		this.updateSpinInDB   = this.updateSpinInDB.bind(this);
		this.handleInput      = this.handleInput.bind(this);
		this.autocomplete     = this.autocomplete.bind(this);
	}

	autocomplete(identifier, value) {
		// Make call to server autocomplete
		console.log('called autocomplete with ...');
		console.log(`IDENTIFIER: ${identifier}`);
		console.log(`VALUE:      ${value}`);
		autocomplete(identifier, value);
		console.log('called global autocomplete...');
		return Array.from(value);
	}

	handleInput(identifier, value) {
	 	let updated = {};
	 	updated[identifier] = value;
		this.setState(updated);
	}

	deleteSpinFromDB() {
		fetch('entry/delete/', {
			method: "DELETE",
			headers: {
				"Content-Type": "application/json",
				"Accept": "application/json"
			},
			body: JSON.stringify({index: this.props.spindex}),
			mode: 'cors'
		}).then(response => response.json()).then(json => {
			console.log(json);
			if(json.ok) this.props.removeSpinFromView(this.props.spindex);
		});
	}

	updateSpinInDB() {
		let body = this.state;
		body.spindex = this.props.spindex;

		fetch('entry/update/', {
			method: "PUT",
			headers: {
				"Content-Type": "application/json",
				"Accept": "application/json"
			},
			body: JSON.stringify(body),
			mode: 'cors'
		}).then(response => response.json()).then(json => {
			console.log(json);
			if(json.ok) this.props.updateSpinInView(json.spin);
		});
	}
	 				
	render() {
		return (
			<PlaylistEntry 
				spindex={this.props.spindex}
				title={this.state.title}
				artist={this.state.artist}
				album={this.state.album}
				label={this.state.label} 
				delete={this.deleteSpinFromDB}
				update={this.updateSpinInDB}
				handleInput={this.handleInput}
				autocomplete={this.autocomplete}/>
			);
	}
}
// Pure Presentation
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
				<DragHandle />
				<div className="playlist-numbering"> {this.props.spindex} </div>
				<ResponsiveTextInput 
					identifier='title'
					value={this.props.title}     
					update={this.props.update}
					handleInput={this.props.handleInput}
					autocomplete={this.props.autocomplete}/>
				<ResponsiveTextInput 
					identifier='artist'
					value={this.props.artist}     
					update={this.props.update}
					handleInput={this.props.handleInput}
					autocomplete={this.props.autocomplete}/>
				<ResponsiveTextInput 
					identifier='album' 
					value={this.props.album}      
					update={this.props.update}
					handleInput={this.props.handleInput}
					autocomplete={this.props.autocomplete}/>
				<ResponsiveTextInput 
					identifier='label' 
					value={this.props.label}      
					update={this.props.update}
					handleInput={this.props.handleInput}
					autocomplete={this.props.autocomplete}/>
				<div className="playlist-minus clickable" onClick={this.props.delete}> </div>
				<div className="playlist-comment clickable"> </div>
			</div>
		);
	}
}
// Pass update, handleInput, and (autocomplete)
// Does not own it's value
class ResponsiveTextInput extends React.Component {
	constructor(props){
		super(props);
		this.state = { 
			editing: this.props.editing,
			suggestions: []
		}

		this.handleKeyUp = this.handleKeyUp.bind(this);
		this.toggleEditing = this.toggleEditing.bind(this);
		this.updateValue   = this.updateValue.bind(this);
	}

	handleKeyUp(e) {
		if(e.key == 'Enter') {
			this.toggleEditing();
			this.props.update(this.props.identifier, e.target.value);
		}	
	}

	updateValue(value) {
		this.props.handleInput(this.props.identifier, value);
		if(this.props.autocomplete) {
			fetch(`entry/complete/?identifier=${this.props.identifier}&value=${value}`, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
				"Accept": "application/json"
			},
			}).then(response => response.json()).then(json => {
				console.log(json);
				if(json.ok) {
					if(json.suggestions.length == 1 && json.suggestions[0] == value)
						this.setState({suggestions: []})
					else 
						this.setState({suggestions: json.suggestions})
				}
			});		
		}
	}

	toggleEditing() {this.setState(state => {return {editing: !state.editing}})}

	render() {
		if(this.state.editing) {
			return (
				<div className="playlist-text-cell dbl-clickable" 
					 onDoubleClick={this.toggleEditing}>
						<input 
							type="text" 
							value={this.props.value || ''}
							placeholder={this.props.placeholder} 
							onKeyUp={this.handleKeyUp}
							autoComplete={'off'}
							onChange={e => this.updateValue(e.target.value)}/>
						<SuggestionsBox
							suggestions={this.state.suggestions}
							updateValue={this.updateValue} />
				</div>
			)
		}
		else if(!this.state.editing) {
			return (
				<div className="playlist-text-cell dbl-clickable"
					 onDoubleClick={this.toggleEditing}>
					{this.props.value || ''}
				</div>
			);
		}
	}
}

class PlaylistEntryFormContainer extends React.Component {
	constructor(props) {
		super(props)
		this.addSpinToDB = this.addSpinToDB.bind(this);
		this.autocomplete= this.autocomplete.bind(this);
	}

	autocomplete(identifier, value) {
		// Make call to server autocomplete
		console.log('called autocomplete with ...');
		console.log(`IDENTIFIER: ${identifier}`);
		console.log(`VALUE:      ${value}`);
		autocomplete(identifier, value);
		console.log('called global autocomplete...');
		return Array.from(value);
	}

	addSpinToDB() {
		fetch('entry/add/', {
			method: "POST",
			body: new FormData(document.getElementById("add-form")),
			mode: 'cors'
		}).then(response => response.json()).then(json => {
			console.log(json);
			if(json.ok) this.props.addSpinToView(json.spin);
		});
	}

	render() {
		return (
			<PlaylistEntryForm 
				spindex={this.props.spindex}
				addSpinToDB={this.addSpinToDB}
				autocomplete={this.autocomplete}/>
			);
	}
}
class PlaylistEntryForm extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			spindex: this.props.spindex,
			title: '',
			artist: '',
			album: '',
			label: ''
		}

		this.submit = this.submit.bind(this);
	}
	submit() {
		this.props.addSpinToDB();
		this.setState((state) => {
			return {
				spindex: state.spindex + 1,
				title: '',
				artist: '',
				album: '',
				label: ''
			}
		});
	}

	render() {
		return (
			<form className="entry-add-form" name='add-form' id="add-form">
				<div className="spin" id="new-entry">
					<div className='playlist-movetab' style={{opacity:0.0}} />
					<div className="playlist-numbering"> {this.state.spindex} </div>
					<PlaylistEntryFormInput
						identifier="title"
						placeholder="song title"
						value={this.state.title}
						submit={this.submit}
						autoFocus={true}
						autocomplete={this.props.autocomplete}
					/>
					<PlaylistEntryFormInput
						identifier="artist"
						placeholder="artist"
						value={this.state.artist}
						submit={this.submit}
						autoFocus={false}
						autocomplete={this.props.autocomplete}
					/>
					<PlaylistEntryFormInput 
						identifier="album"
						placeholder="album"
						value={this.state.album}
						submit={this.submit}
						autoFocus={false}
						autocomplete={this.props.autocomplete}
					/>
					<PlaylistEntryFormInput 
						identifier="label"
						placeholder="album label"
						value={this.state.label}
						submit={this.submit}
						autoFocus={false}
						autocomplete={this.props.autocomplete}
					/>
					<div onClick={this.submit} className="playlist-plus clickable" id="add-entry-button">
					</div>
				</div>
			</form>
		);
	}
}
// Pass submit and autocomplete
class PlaylistEntryFormInput extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			value: this.props.value,
			suggestions: []
		};

		this.handleKeyUp = this.handleKeyUp.bind(this);
		this.updateValue  = this.updateValue.bind(this);
	}

	handleKeyUp(e) { if(e.key == 'Enter') this.props.submit(); }

	updateValue(value) { 
		this.setState({value: value});
		fetch(`entry/complete/?identifier=${this.props.identifier}&value=${value}`, {
				method: "GET",
				headers: {
					"Content-Type": "application/json",
					"Accept": "application/json"
				},
			}).then(response => response.json()).then(json => {
				console.log(json);
				if(json.ok) {
					if(json.suggestions.length == 1 && json.suggestions[0] == value)
						this.setState({suggestions: []})
					else 
						this.setState({suggestions: json.suggestions})
				}
		});		
	}

	render() { 
			return (
				<div className="playlist-text-cell">
					<input 
						autoFocus={this.props.autoFocus}
						autoComplete={'off'}
						type="text"
						value={this.state.value} 
						name={this.props.identifier}
						placeholder={this.props.placeholder} 
						onChange={e => this.updateValue(e.target.value)}
						onKeyUp={this.handleKeyUp}/>
					<SuggestionsBox
						suggestions={this.state.suggestions} 
						updateValue  ={this.updateValue}/>
				</div>

				);
	}
}

// Expects updateValue, a function
class SuggestionsBox extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			suggestions: this.props.suggestions,
			selected: 0
		}
		this.renderSuggestions = this.renderSuggestions.bind(this);
	}

	clickedIt(suggestion, index) {
		this.setState({selected: index});
		this.props.updateValue(suggestion);
	}

	/* SOMEHOW WE WANT A FUNCTION BINDING KEYSTROKES TO CHANGING SELECTED, 
	   AND PICKING A VALUE ON KEYPRESS */ 
	   
	renderSuggestions() {
		return ( this.props.suggestions.map((suggestion, index) => {

			let customStyle = {};
			if(index == this.state.selected)
				customStyle.backgroundColor = 'blue';

			return(
					<div
						key={index} 
						style={customStyle}
						onClick={e => this.clickedIt(suggestion, index)}
						className="playlist-suggestion"> 
						{suggestion} 
					</div>
			);
		}));
	}

	render() {
		return (
			<div className="playlist-autocomplete-box">
				{this.renderSuggestions()} 
			</div>
			);
	}
}


ReactDOM.render(
    React.createElement(Playlist, window.props),
    window.react_mount,
)