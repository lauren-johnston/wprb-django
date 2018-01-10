import React from 'react';
import Autosuggest from 'react-autosuggest';
import debounce from 'debounce';

import {autocompleteFilter, formDict} from './common.js'

const match = require('autosuggest-highlight/match');
const parse = require('autosuggest-highlight/parse');

export default class PlaylistEntryForm extends React.Component {
    constructor(props) {
        super(props);

        this.inputs = {};
        this.submit = this.submit.bind(this);
        this.suggestionFill = this.suggestionFill.bind(this);
    }

    submit() {
        let form = document.forms['add-form']
        let inputs = form.elements;
        let requiredFields = ['title', 'artist', 'album'];

        for (let field of requiredFields) {
            console.log(field);
            console.log(inputs[field].value);
            if(!inputs[field].value) 
                return document.getElementById(`add-form-${field}`).focus(); 
        }

        let reactForm = this;
        fetch('entry/add/', {
            method: "POST",
            body: JSON.stringify(formDict(form))
        }).then(response => response.json()).then(json => {
            console.log(json);
            if (json.ok) {
                this.props.addSpinToView(json.spin);
                for(let input in this.inputs) {
                    this.inputs[input].setState({
                        value: '',
                        suggestions: [],
                        cachedSuggestions: [],
                        prevSearch: ''
                    });
                }
            }
        });

    }

    suggestionFill(s, type) {
        if (!s.song) 
            return s;
        else {
            this.inputs['artist'].setState({value: s.artist})
            this.inputs['album'].setState({value: s.album})
            this.inputs['label'].setState({value: s.label})
            return s.song;
        }
    }

    render() {
        let inputs = this.inputs;

        return (
            <form className="entry-add-form" name='add-form' id="add-form">
                <div className="spin" id="new-entry">
                    <div className='playlist-movetab' style={{opacity:0.0}} />
                    <div className="playlist-numbering"> {this.props.spindex} </div>
                    <PlaylistEntryFormInput
                        identifier="title"
                        placeholder="song title"
                        value={''}
                        submit={this.submit}
                        suggestionFill={this.suggestionFill}
                        autoFocus={true}
                        ref={el => this.inputs['title'] = el} />
                    <PlaylistEntryFormInput
                        identifier="artist"
                        placeholder="artist"
                        value={''}
                        submit={this.submit}
                        suggestionFill={this.suggestionFill}
                        autoFocus={false}
                        ref={el => this.inputs['artist'] = el}  />
                    <PlaylistEntryFormInput
                        identifier="album"
                        placeholder="album"
                        value={''}
                        submit={this.submit}
                        suggestionFill={this.suggestionFill}
                        autoFocus={false} 
                        ref={el => this.inputs['album'] = el}/>
                    <PlaylistEntryFormInput
                        identifier="label"
                        placeholder="record label"
                        value={''}
                        submit={this.submit}
                        suggestionFill={this.suggestionFill}
                        autoFocus={false}
                        ref={el => this.inputs['label'] = el} />
                    <div onClick={this.submit} className="playlist-plus clickable" id="add-entry-button"/>
                </div>
            </form>
        );
    }
}

// Pass submit and autocomplete and suggestionPull
class PlaylistEntryFormInput extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            value: this.props.value,
            suggestions: [],
            cachedSuggestions: [],
            prevSearch: ''
        };

        this.onChange = this.onChange.bind(this);
        this.handleKeyUp = this.handleKeyUp.bind(this);

        this.shouldRenderSuggestions = this.shouldRenderSuggestions.bind(this);
        this.onSuggestionsFetchRequested = debounce(this.onSuggestionsFetchRequested.bind(this), 1000);
        this.onSuggestionsClearRequested = this.onSuggestionsClearRequested.bind(this);

        //console.log(this.onSuggestionsFetchRequested);
        //console.log(debounce);
    }

    handleKeyUp(evt) {
         if (evt.key == 'Enter') 
            this.props.submit();
    }

    onChange(evt, {newValue}) {
        this.setState({value: newValue});
    }

    // Autosuggest will call this function every time you need to update suggestions.
    // You already implemented this logic above, so just use it.
    onSuggestionsFetchRequested({ value }) {
        if (value.length < 3) {
            this.setState({suggestions: []});
            return;
        }

        if (value.substring(0, 3) == this.state.prevSearch.substring(0, 3)) {
            this.setState(state => {
                return ({
                    suggestions: autocompleteFilter(state.cachedSuggestions, value, this.props.identifier)
                })
            });
        }
        else  {
            fetch(`entry/complete/?identifier=${this.props.identifier}&value=${value}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },
            }).then(response => response.json()).then(data => {
                if (data.ok) 
                    this.setState({
                        suggestions: data.suggestions,
                        cachedSuggestions: data.suggestions,
                        prevSearch: value
                    })
            });
        }
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
            id: `add-form-${this.props.identifier}`,
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
                    onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
                    onSuggestionsClearRequested={this.onSuggestionsClearRequested}
                    shouldRenderSuggestions={this.shouldRenderSuggestions}
                    getSuggestionValue={s => this.props.suggestionFill(s, this.props.identifier)}
                    renderSuggestion={renderSuggestion}
                    inputProps={inputProps} />
            </div>
        );
    }
}

/* On selection of a suggestion, we call this */
const getSuggestionValue = (s, type) => {
    if(!s.song) return s;   

    let fields = ['title', 'artist', 'album', 'label'];
    fields.splice(fields.indexOf(type), 1);

    for (let field of fields) {
        let name = (field == 'title' ? 'song' : field);
        document.getElementById(`add-form-${field}`).value = s[name] || '';
    }

    return s.song;
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
