import React from 'react';
import ReactDOM from 'react-dom';
import Moment from 'moment';

/*import {ExploreDetails} from './Explore.jsx';*/

const ExploreShows = ({playlists}) => {
    return (
        <div className="show-container">
            <div className="show-container-header">
                <span className="show-heading show-date">Date</span>
                <span className="show-heading show-title">Title</span>
                <span className="show-heading show-subtitle">Subtitle</span>
            </div>
            <div className="shows">
            {playlists.map((playlist) => (
                <div key={playlist.id} className="show-list-entry">
                    <a href={`/playlist/${playlist.id}/`} className="playlist-link">
                        <span className="show-text-cell show-date">{Moment(playlist.date, 'X').format('dddd, MM/DD/YY @h:mma')}</span>
                        <span className="show-text-cell show-title">{playlist.title}</span>
                        <span className="show-text-cell show-subtitle">{playlist.subtitle}</span>
                    </a> 
                </div>
            ))}
            </div>
        </div>
    );
}


class Landing extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="landing">

                <div id="welcome-box">
                    <div className="welcome-text-dj">Welcome {this.props.dj}!</div>
                    <div className="welcome-text-prompt">Select a playlist to edit or create a new one!</div>
                </div>
                <div id="playlist-list-box">
                    <ExploreShows playlists={this.props.playlists} />
                </div>

                <div id="new-playlist-button" className="button">
                    <a href="/playlist/new"> 
                        <span className="button-text">CREATE NEW PLAYLIST</span>
                    </a>
                </div>
            </div>
        );
    }
}

ReactDOM.render(
    React.createElement(Landing, window.props),
    window.react_mount,
)
