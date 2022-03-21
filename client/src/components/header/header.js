import { Component } from 'react'

import './header.css';

class Header extends Component {

    render() {
        let connected = "датчики отключены";
        if (this.props.connectedStatus) {
            connected = "датчики подключены";
        }
        const clazz = this.props.connectedStatus ? "connect-status-on" : "connect-status-off";

        return (
            <header>
                <button type="button"
                        className="button-menu">
                </button>

                <span type="text"
                      className={clazz}>
                    {connected}
                </span>

                <button type="button"
                        className="button-settings">
                </button>
            </header>
        )
    }
}

export default Header;
