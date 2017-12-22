import React from 'react';

/*****************************************************************
 * THIS MODULE HAS BEEN REPLACED
 * playlist.jsx is now using riek (react inline-edit kit)
 * which includes support for editable textareas, inputs, and TAGS
 * and also handles a couple extra corner cases for us so we don't
 * have multiple text-edit fields open at once.
 *****************************************************************/

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
		if (e.key == 'Enter') {
			this.toggleEditing();
			this.props.update(this.props.identifier, e.target.value);
		}	
	}

	updateValue(value) {
		this.props.handleInput(this.props.identifier, value);
		if (this.props.autocomplete) {
			fetch(`entry/complete/?identifier=${this.props.identifier}&value=${value}`, {
				method: "GET",
				headers: {
					"Content-Type": "application/json",
					"Accept": "application/json"
				},
			}).then(response => response.json()).then(json => {
				console.log(json);
				if (json.ok) {
					if (json.suggestions.length == 1 && json.suggestions[0] == value)
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