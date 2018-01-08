import React from 'react';
import ReactDOM from 'react-dom';
import { WithContext as ReactTags } from 'react-tag-input';

import { smartComplete } from './async.jsx';
import { tagArrayFromArray }  from './common.jsx';

export default class TagBox extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			tags: tagArrayFromArray(this.props.tags),
			suggestions: [],
            prevSearch: '',
			classNames: {
		      tags: 'ReactTags__tags',
		      tagInput: 'ReactTags__tagInput',
		      tagInputField: 'ReactTags__tagInputField',
		      selected: 'ReactTags__selected',
		      tag: 'ReactTags__tag',
		      remove: 'ReactTags__remove',
		      suggestions: 'ReactTags__suggestions',
		      activeSuggestion: 'ReactTags__activeSuggestions'
		    },
		    editing: false
		};

		this.handleDelete   = this.handleDelete.bind(this);
		this.handleAddition = this.handleAddition.bind(this);
		this.handleDrag     = this.handleDrag.bind(this);
		this.toggleEditing  = this.toggleEditing.bind(this);
		this.startMouseOver = this.startMouseOver.bind(this);
		this.startMouseOut  = this.startMouseOut.bind(this);
		this.updateSuggestions = this.updateSuggestions.bind(this);
		this.componentDidMount = this.componentDidMount.bind(this);
	}


	// A total hack to gain control over a very tough style issue 
	// without cracking open the box on react-tag-input
	componentDidMount() {
		let input = document.getElementById(this.props.inputId);
		input.insertAdjacentHTML('afterend',
			`<div class="ReactTags__tagInputExitButton clickable"
			      id="exit-button-for-${this.props.inputId}" />`);
		input.style.width = '90%';
		input.style['max-width'] = '130px';

		let tagbox = this;
		let exitButton = document.getElementById(`exit-button-for-${this.props.inputId}`);
		exitButton.addEventListener('click', f => tagbox.toggleEditing());
	}

    handleDelete(i) {
        let tags = this.state.tags;

        if(tags.length == 1 && !this.props.allownone) 
        	return;

        this.props.delTag(tags[i].text);

        tags.splice(i, 1);
        this.setState({tags: tags});
    }
 
    handleAddition(tag) {
        let tags = this.state.tags;
        if(tags.map(t => t.text).includes(tag)) return;

        tags.push({
            id: tags.length + 1,
            text: tag
        });

        this.props.addTag(tag);

        this.setState({
        	tags:tags
        });

        this.toggleEditing();
    }
 
    handleDrag(tag, currPos, newPos) { 
        // No Drag 
    }

    startMouseOver() {
    	this.setState(state => {
    		let classes = state.classNames
    		classes['remove'] = 'ReactTags__removeShowing'
    		return { classNames: classes}
    	})
    }

    startMouseOut() {
    	this.setState(state => {
    		let classes = state.classNames
    		classes['remove'] = 'ReactTags__remove'
    		return { classNames: classes}
    	})
    }

    toggleEditing() {
    	let classes = this.state.classNames

    	if(this.state.editing) {
    		classes['tagInput'] = 'ReactTags__tagInput';
    		classes['tagInputField'] = 'ReactTags__tagInputField';
    		setTimeout(f => {document.getElementById(id).value = ''}, 0);
    	} else {
    		classes['tagInput'] = 'ReactTags__tagInputEditing';
    		classes['tagInputField'] = 'ReactTags__tagInputFieldEditing';
    	}

    	
    	this.setState(state => {
    		return { classNames: classes,
    				 editing: !state.editing }
    	});


    	/* For some reason, the third line works where the second
    	   line doesn't. Let me know if you know why! */
    	let id = this.props.inputId;
    	// document.getElementById(id).focus();
    	setTimeout(f => {document.getElementById(id).focus()}, 0);
    }

    async updateSuggestions(value) {
    	
        this.setState({suggestions: suggestions});
    }

	render() {
		const { tags, suggestions, classNames, editing } = this.state;
		const adjElement = editing? '' : 'tag-plus clickable';

		return (
			<div className="tagbox">
				<ReactTags tags={tags}
						id={this.props.inputId || ''}
	                    suggestions={suggestions}
	                    classNames={classNames} 
	      				placeholder={this.props.placeholder}
	      				onMouseOver={this.startMouseOver}
	      				onMouseOut={this.startMouseOut}
	      				handleInputChange={this.updateSuggestions}
	                    handleDelete={this.handleDelete}
	                    handleAddition={this.handleAddition}
	                    handleDrag={this.handleDrag}
	                    allowDeleteFromEmptyInput={false}
	                    />
	           	<div className={adjElement}
	           		 onClick={this.toggleEditing} />
	       </div>
            );
	}
}