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
        let loginDisp = <a href="/playlist/login" className="user-link">Login</a>;
        let djDisp;

        if (this.props.username) {
            loginDisp = <a href="/playlist/logout" className="user-link">Logout</a>;
        }

        if (this.props.djName) {
            djDisp = <a href="/playlist" className="user-link">My Playlists</a>;
        }

        return (
            <div className={panelClass}>
                <span onClick={this.toggle} className="userid-box clickable">
                    <span className="userid-pic"></span>
                    <span className="userid-name">{this.props.username}</span>
                </span>

                <div className="userid-menu-element">
                    <a href="/" className="user-link">Settings</a>
                </div>

                <div className="userid-menu-element">
                    <a href="/explore" className="user-link">Explore</a>
                </div>

                <div className="userid-menu-element">{djDisp}</div>
                
                <div className="userid-menu-element">{loginDisp}</div>
            </div>
        );
    }
}

ReactDOM.render(
    React.createElement(user, window.props.userinfo),
    document.getElementById('user-area'),
);