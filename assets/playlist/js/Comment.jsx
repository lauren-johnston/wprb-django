import React from 'react';
import ReactDOM from 'react-dom';
import Moment from 'moment';

export default class CommentPanel extends React.Component {
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
		})
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
				<NewCommentForm addComment={this.addComment} />
			</div>
		);
	}
}


class SingleComment extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		// Convert timestamp to time string
		let time = Moment(this.props.timestamp, 'X').format('@h:mma');

		return (
			<div className="comment-box">
				<div className="comment-meta">
					<span className="comment-author">{this.props.author} </span>
					<span className="comment-timestamp">{time}</span>
				</div>
				<div className="comment-text">{this.props.text}</div>
			</div>
		);
	}
}

class NewCommentForm extends React.Component {
	constructor(props) {
		super(props);

		this.submit = this.submit.bind(this);
	}

	submit(evt) {
		evt.preventDefault();

		let text = document.getElementById("new-comment-text").value;
		document.getElementById("new-comment-text").value = '';

		let body = JSON.stringify({text});
		console.log(body);

		fetch('comment/new/', {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				"Accept": "application/json"
			},
			body: body,
			mode: 'cors',
			cache: 'default'
		}).then(response => {
			return response.json();
		}).then(data => {
			console.log(data);
			this.props.addComment(data);
		});

	}

	render() {
		return (
			<form id="new-comment-form">
				<textarea id="new-comment-text" /> <br />
				<button className="comment-button" onClick={this.submit}>comment!</button>
			</form>
		);
	}
}