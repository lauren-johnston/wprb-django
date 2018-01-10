import React from 'react';
import ReactDOM from 'react-dom';
import Moment from 'moment';

import {domCsrfToken} from './common.js';
import Cookies from 'js-cookie';

/**
 * Component to render the comment panel for the DJs.
 * Receives a list of comment objects as props.comments, and renders
 * each along with a form to input a new comment.  The component is minimized
 * by default and clicking the header will toggle its display.
 */
export default class CollabsibleCommentPanel extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			show: false,
			comments: this.props.comments
		};

		this.toggle = this.toggle.bind(this);
		this.addComment = this.addComment.bind(this);
	}	

	toggle() {
		this.setState((state, props) => {
			return { show: !state.show };
		});
	}

	addComment(comment) {
		this.setState((state, props) => {
			let comments = state.comments.slice();
			comments.push(comment);
			return { comments };
		});
	}

	render() {
		let panelClass = this.state.show ? "comment-panel show" : "comment-panel hidden";

		return (
			<div className={panelClass}>
				<h2 onClick={this.toggle} className="comment-title clickable">comments</h2>
				<div className="comment-contents">
				{this.state.comments.map((comment) => 
					<SingleComment 
						text={comment.text}
						author={comment.author}
						timestamp={comment.timestamp}
						id={comment.id}
						key={comment.id} />
				)}
				</div>
				<NewCommentForm playlistId={this.props.playlistId} addComment={this.addComment} />
			</div>
		);
	}
}

export class EmbeddedCommentPanel extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			comments: this.props.comments
		};

		this.addComment = this.addComment.bind(this);
	}

	addComment(comment) {
		this.setState((state, props) => {
			let comments = state.comments.slice();
			comments.push(comment);
			return { comments };
		})
	}

	render() {
		return (
			<div className="comment-panel">
				<h2 className="comment-title">comments</h2>
				<div className="comment-contents">
				{this.state.comments.map((comment) => 
					<SingleComment {...comment}
						key={comment.id}
						userId={this.props.userId} />
				)}
				</div>
				<NewCommentForm 
					playlistId={this.props.playlistId} 
					addComment={this.addComment} />
			</div>
		);
	}
}


const SingleComment = ({timestamp, author, authorId, userId, text}) => {
	// Convert timestamp to time string
	let time = Moment(timestamp, 'X').subtract(5, 'seconds').fromNow();

	let bubble = {
		backgroundColor: userId === authorId ? '#fdf' : '#eee',
		margin: userId === authorId ? '0.5em 0.5em 0.5em 7%' : '0.5em 7% 0.5em 0.5em'
	};

	let alignment = {
		textAlign: userId === authorId ? 'right' : 'left',
		margin: userId === authorId ? '0 5% 0 0' : '0 0 0 5%'
	};

	if (userId === authorId) 
		author = 'you';

	return (
		<div className="comment-box">
			<div style={bubble} className="comment-text">{text}</div>
			<div style={alignment} className="comment-meta">
				<span className="comment-author">{author} </span>
				<span className="comment-timestamp">{time}</span>
			</div>
		</div>
	);
}

class NewCommentForm extends React.Component {
	constructor(props) {
		super(props);

		this.submit = this.submit.bind(this);
		this.handleKeyUp = this.handleKeyUp.bind(this);
	}

	handleKeyUp(evt) {
		if (evt.key == 'Enter')
			this.submit(evt);
	}

	submit(evt) {
		evt.preventDefault();

		let text = document.getElementById("new-comment-text").value;
		document.getElementById("new-comment-text").value = '';

		let body = JSON.stringify({text});

		fetch(`/playlist/${this.props.playlistId}/comment/new/`, {
			method: "POST",
			credentials: 'include',
			headers: {
				"Content-Type": "application/json",
				"Accept": "application/json",
				"X-CSRFToken": domCsrfToken()
			},
			body: body,
			mode: 'cors',
			cache: 'default'
		}).then(response => {
			return response.json();
		}).then(data => {
			this.props.addComment(data);
		});
	}

	render() {
		return (
			<form id="new-comment-form">
				<textarea id="new-comment-text" onKeyUp={this.handleKeyUp} /> <br />
				<button className="comment-button" onClick={this.submit}>comment!</button>
			</form>
		);
	}
}