import React from 'react';
import Autosuggest from 'react-autosuggest';
import debounce from 'debounce';

const match = require('autosuggest-highlight/match');
const parse = require('autosuggest-highlight/parse');

export default class PlaylistEntryForm extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            title: '',
            artist: '',
            album: '',
            label: ''
        };

        this.submit = this.submit.bind(this);
    }

    submit() {
        let form = document.forms['add-form'].elements;
        let requiredFields = ['title', 'artist', 'album'];
        for(let field of requiredFields) { 
            if(!form[field].value) 
                return document.getElementById(`add-form-${field}`).focus(); 
        }

        fetch('entry/add/', {
            method: "POST",
            body: new FormData(form)
        }).then(response => response.json()).then(json => {
            console.log(json);
            if (json.ok) {
                this.props.addSpinToView(json.spin);
                this.setState((state) => {
                    return {
                        title: '',
                        artist: '',
                        album: '',
                        label: ''
                    }
                });
            }
        });

    }

    render() {
        return (
            <form className="entry-add-form" name='add-form' id="add-form">
                <div className="spin" id="new-entry">
                    <div className='playlist-movetab' style={{opacity:0.0}} />
                    <div className="playlist-numbering"> {this.props.spindex} </div>
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
                        autoFocus={false}  />
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
                    <div onClick={this.submit} className="playlist-plus clickable" id="add-entry-button"/>
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

        this.onChange = this.onChange.bind(this);
        this.handleKeyUp = this.handleKeyUp.bind(this);

        this.shouldRenderSuggestions = this.shouldRenderSuggestions.bind(this);
        this.onSuggestionsFetchRequested = this.onSuggestionsFetchRequested.bind(this);
        this.onSuggestionsClearRequested = this.onSuggestionsClearRequested.bind(this);
    }

    handleKeyUp(evt) {
        // TODO: Validate that song/album/artist has all been entered.
        // IF NOT, then tab to the next empty input box, and maybe highlight it red or something?
        //      Probs just iterate through form.input, if form.input[i].value === '', form.input[i].focus()
        if (evt.key == 'Enter')
            this.props.submit();
    }

    onChange(evt, {newValue}) {
        this.setState({value: newValue});
    }

    // Autosuggest will call this function every time you need to update suggestions.
    // You already implemented this logic above, so just use it.
    onSuggestionsFetchRequested({ value }) {
        if (value.length == 0 || value.length < 3) {
            this.setState({suggestions: []});
            return;
        }

        if(value.substring(0, 3) == this.props.value.substring(0, 3))
            this.setState(state => {
                return {suggestions: state.suggestions.filter(s => s.startsWith(value))}
            });
        else 
            fetch(`entry/complete/?identifier=${this.props.identifier}&value=${value}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },
            }).then(response => response.json()).then(data => {
                if (data.ok) 
                    this.setState({suggestions: data.suggestions})
        });
    };

    // Autosuggest will call this function every time you need to clear suggestions.
    onSuggestionsClearRequested() {
        this.setState({
            suggestions: []
        });
    };

    shouldRenderSuggestions(value) {
        return value && value.trim().length > 1;
    }

    render() {
        const {value, suggestions} = this.state;

        const inputProps = {
            name: this.props.identifier,
            value: value || '',
            placeholder: this.props.placeholder,
            autoFocus: this.props.autoFocus,
            onChange: this.onChange
        };

        return (
            <div className="playlist-text-cell">
                <Autosuggest
                    id={this.props.identifier}
                    suggestions={suggestions}
                    onSuggestionsFetchRequested={debounce(this.onSuggestionsFetchRequested, 100)}
                    onSuggestionsClearRequested={this.onSuggestionsClearRequested}
                    shouldRenderSuggestions={this.shouldRenderSuggestions}
                    getSuggestionValue={s => s.song || s}
                    renderSuggestion={renderSuggestion}
                    inputProps={inputProps} />
            </div>
        );
    }
}

/**
 * Render a suggestion, whether it's a simple string or an
 * object containing song, artist, album
 */
const renderSuggestion = (s, {query, isHighlighted}) => {
    const className = isHighlighted ? 'playlist-suggestion highlighted' : 'playlist-suggestion';
    const matches = match(s.song || s, query);
    const parts = parse(s.song || s, matches);

    const highlightedParts = parts.map((part, index) => {
        const weight = {
            fontWeight: part.highlight ? 'bold' : 'normal'
        };

        return <span style={weight} key={index}>{part.text}</span>;
    })

    const details = s.artist ? (
        <span className="suggestion-details">
            <span className="suggestion-artist">by {s.artist}</span>
            <span className="suggestion-album">({s.album})</span>
        </span>
    ) : null;

    // TODO: HOOK In to render artist and album into the artist and album fields if poss
    // idk how tho
    return (
        <div className={className}>
            {highlightedParts}
            {details}
        </div>
    );
}
