import React from 'react';
import Autosuggest from 'react-autosuggest';


export default class PlaylistEntryForm extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			spindex: this.props.spindex,
			title: '',
			artist: '',
			album: '',
			label: ''
		};

		this.submit = this.submit.bind(this);
	}

	submit() {
		fetch('entry/add/', {
			method: "POST",
			body: new FormData(document.getElementById("add-form")),
			mode: 'cors'
		}).then(response => response.json()).then(json => {
			console.log(json);
			if (json.ok) this.props.addSpinToView(json.spin);
		});

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
						autoFocus={true} />
					<PlaylistEntryFormInput
						identifier="artist"
						placeholder="artist"
						value={this.state.artist}
						submit={this.submit}
						autoFocus={false} />
					<PlaylistEntryFormInput 
						identifier="album"
						placeholder="album"
						value={this.state.album}
						submit={this.submit}
						autoFocus={false} />
					<PlaylistEntryFormInput 
						identifier="label"
						placeholder="record label"
						value={this.state.label}
						submit={this.submit}
						autoFocus={false} />
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

	handleKeyUp(evt) { 
		if (evt.key == 'Enter') 
			this.props.submit(); 
	}

	updateValue(value) { 
		this.setState({value: value});
		
		fetch(`entry/complete/?identifier=${this.props.identifier}&value=${value}`, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
				"Accept": "application/json"
			},
		}).then(response => response.json()).then(json => {
			if (json.ok) {
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
					type="text"
					value={this.state.value} 
					name={this.props.identifier}
					placeholder={this.props.placeholder} 
					onChange={e => this.updateValue(e.target.value)}
					onKeyUp={this.handleKeyUp}/>
				{this.state.suggestions.length ? <SuggestionsBox
					suggestions={this.state.suggestions} 
					updateValue  ={this.updateValue}/> : ''}
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
		return this.props.suggestions.map((suggestion, index) => {
			let customStyle = {};
			if (index == this.state.selected)
				customStyle.backgroundColor = '#ffd';

			return (
				<div
					key={index} 
					style={customStyle}
					onClick={e => this.clickedIt(suggestion, index)}
					className="playlist-suggestion"> 
					{suggestion} 
				</div>
			);
		});
	}

	render() {
		if (this.props.suggestions.length > 0)
			return (
				<div className="playlist-autocomplete-box">
					{this.renderSuggestions()} 
				</div>
			);
		else return null;
	}
}
