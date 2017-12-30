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

        return (
            <div className={panelClass}>
                <span onClick={this.toggle} id="userid-box clickable">
                    <span className="userid-pic"></span>
                    <span className="userid-name">{this.props.userinfo.username}</span>
                </span>

                <div className="userid-menu-element">
                    <a href="/" class="user-link">Settings</a>
                </div>
                
                <div className="userid-menu-element">
                    <a href="/" class="user-link">Login</a>
                </div>
            </div>
        );
    }
}

ReactDOM.render(
    React.createElement(user, window.props),
    document.getElementById('user-area'),
)