import React from 'react';
import ReactDOM from 'react-dom';

class user extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            show: false,
        };

        this.toggle = this.toggle.bind(this);
    }   

    toggle() {
        this.setState((state, props) => {
            return { show: !state.show };
        });
    }

    render() {
        let panelClass = this.state.show ? "userid-panel show" : "userid-panel hidden";
        let loginDependentContent = (
            <div className="userid-panel">
                <a href="/playlist/login" className="user-link">
                    <span className="userid-box clickable">
                        <span className="userid-pic"></span>
                        <span className="userid-name">DJ Login</span>
                    </span>
                </a>
            </div>
        );

        if (this.props.username) {
            loginDependentContent = (
                <div className={panelClass}>
                    <span onClick={this.toggle} className="userid-box clickable">
                        <span className="userid-pic"></span>
                        <span className="userid-name">{this.props.username}</span>
                    </span>
                    <div className="userid-menu-element">
                        <a href="/explore" className="user-link">Explore</a>
                    </div>

                    <div className="userid-menu-element">
                        <a href="/playlist" className="user-link">My Playlists</a>
                    </div>
                    
                    <div className="userid-menu-element">
                        <a href="/logout">Logout</a>
                    </div>
                </div>
            );
        }

        return (
            loginDependentContent
        );
    }
}

ReactDOM.render(
    React.createElement(user, window.props.userinfo),
    document.getElementById('user-area'),
)