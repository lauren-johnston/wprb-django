import React from 'react';
import ReactDOM from 'react-dom';

import Moment from 'moment';

import Charts from './Charts.jsx';
import Search from './Search.jsx';
import {ExploreDetails, ExploreShows} from './Explore.jsx';

const END_OF_TIME = Moment('1510830000', 'X');

class ExploreLandingPage extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<div className="explore">
				<div id="content-main">
					<div id="content-left">
						<NowPlaying playlist={this.props.playlists[0]} />
						<ExploreShows playlists={this.props.playlists} />
					</div>
					<div id="content-right">
						<Search />
						<Charts 
							after={END_OF_TIME.subtract(1, 'months').format('X')} 
							for="WPRB this month" />
					</div>
				</div>
			</div>
		);
	}
}

const NowPlaying = ({playlist}) => {
	return (
		<div className="now-playing">
			<h1>Now Playing:</h1>
			<h2 className="now-playing-title">
				<a href={`/explore/playlist/${playlist.id}`} className="now-playing-show">{playlist.title}</a><br/>
				<span className="now-playing-with"> with </span> 
				<a href={`/explore/dj/${playlist.djId}`} className="now-playing-dj">{playlist.dj}</a>
			</h2>
			<div className="now-playing-link"><a href={`/explore/playlist/${playlist.id}`}>view playlist!</a></div>
		</div>
	);	
}

ReactDOM.render(
    React.createElement(ExploreLandingPage, window.props),
    window.react_mount,
);
