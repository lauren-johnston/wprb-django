import React from 'react';
import PlaylistEntryForm from './PlaylistEntryForm.jsx';

import { RIEInput } from 'riek';
import { SortableContainer, SortableElement, SortableHandle, arrayMove } from 'react-sortable-hoc';

export default class PlaylistTable extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			spins:this.props.spins,
			length: this.props.spins.length
		};
		this.onSortEnd = this.onSortEnd.bind(this);
		this.addSpinToView = this.addSpinToView.bind(this);
		this.removeSpinFromView = this.removeSpinFromView.bind(this);		
	}

	addSpinToView(spin) {
		let updatedSpins = this.state.spins.slice();
		updatedSpins.push(spin);
		this.setState({ 
			spins: updatedSpins,
			length: updatedSpins.length
		});
	}

	removeSpinFromView(spindex) {
		let updatedSpins = this.state.spins.slice();
		updatedSpins.splice(spindex-1, 1);
		this.setState({ 
			spins: updatedSpins,
			length: updatedSpins.length
		});
	}

	onSortEnd({oldIndex, newIndex}) {
		let newSpins = arrayMove(this.state.spins, oldIndex, newIndex);
		this.setState({
			spins: newSpins,
			length: newSpins.length
		});

		// Move spin in the server
		if (oldIndex != newIndex) {
			fetch('entry/move/', {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
					"Accept": "application/json"
				},
				body: JSON.stringify({oldSpindex: oldIndex+1, newSpindex: newIndex+1})
			}).then(response => response.json()).then(json => {
				console.log(json);
				if (!json.ok) { alert('bad move...'); } // Something
			});
		}
	};

	render() {
		return (
			<div id="playlist" className="col-content">
				<PlaylistTableHeader />
				<div className="playlist-table-contents">
					<SortablePlaylistList 
						spins={this.state.spins}
						removeSpinFromView={this.removeSpinFromView}
						onSortEnd={this.onSortEnd}
						lockAxis="y"
						useDragHandle={true} />
				</div>
				<PlaylistEntryForm
					spindex={this.state.length + 1}
					addSpinToView={this.addSpinToView} />
			</div>
		);
	}
}

// Following syntax from online
const DragHandle = SortableHandle(() => <div className="playlist-movetab"/>);

const SortablePlaylistEntry = SortableElement(({spin, spindex, removeSpinFromView, spinId}) => {
	// Hacked to remove index keyword (demanded by Sortable Element)
	return (
		<PlaylistEntryContainer
			spinId={spinId}
			title={spin.title}
			artist={spin.artist}
			album={spin.album}
			label={spin.label||''}
			spindex={spindex}
			removeSpinFromView={removeSpinFromView} />
	);
});

const SortablePlaylistList = SortableContainer(({spins, removeSpinFromView}) => {
	// index MUST BE index in array or Sortable will blow up
	return (
		<div className='playlist-list-entries'>
			{spins.map((spin, index) => {
				return <SortablePlaylistEntry 
					key={spin.id}
					spinId={spin.id}
					spin={spin}
					spindex={index + 1}
					index={index}
					removeSpinFromView={removeSpinFromView} />
				}
			)}
		</div>
	);
});

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

		// Bind handlers to this
		this.deleteSpin = this.deleteSpin.bind(this);
		this.updateSpin = this.updateSpin.bind(this);
	}

	deleteSpin() {
		fetch('entry/delete/', {
			method: "DELETE",
			headers: {
				"Content-Type": "application/json",
				"Accept": "application/json"
			},
			body: JSON.stringify({id: this.props.spinId}),
			mode: 'cors'
		}).then(response => response.json()).then(data => {
			if (data.ok) 
				this.props.removeSpinFromView(this.props.spindex);
		});
	}

	updateSpin(value) {
		// Set spindex to identify the spin
		// TODO: replace with spin ID
		let request = Object.assign({}, this.state, value, {id: this.props.spinId});

		console.log(request);

		fetch('entry/update/', {
			method: "PUT",
			headers: {
				"Content-Type": "application/json",
				"Accept": "application/json"
			},
			body: JSON.stringify(request),
			mode: 'cors'
		}).then(response => {
			console.log(response.json());
		});

		// Update state to show the change in view
		this.setState(value);
	}
	 				
	render() {
		return (
			<PlaylistEntry 
				spindex={this.props.spindex}
				title={this.state.title}
				artist={this.state.artist}
				album={this.state.album}
				label={this.state.label} 
				delete={this.deleteSpin}
				update={this.updateSpin} />
			);
	}
}
// Pure Presentation
class PlaylistEntry extends React.Component {
	constructor(props) {
		super(props);
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
				<RIEInput 
					className="playlist-text-cell"
					propName='title'
					value={this.props.title}     
					change={this.props.update} />
				<RIEInput 
					className="playlist-text-cell"
					propName='artist'
					value={this.props.artist}     
					change={this.props.update} />
				<RIEInput 
					className="playlist-text-cell"
					propName='album' 
					value={this.props.album}      
					change={this.props.update} />
				<RIEInput 
					className="playlist-text-cell"
					propName='label' 
					value={this.props.label}      
					change={this.props.update} />
				<div className="playlist-minus clickable" onClick={this.props.delete}> </div>
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
