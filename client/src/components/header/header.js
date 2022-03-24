import { Component } from 'react'

import './header.css';

class Header extends Component {

    onToggleMenu = (e) => {
        if (e.target.classList.contains('menu-shading')) {
            this.props.onToggleMenu();
        }
    }

    render() {
        let connected = 'датчики отключены';
        if (this.props.connectedStatus) {
            connected = 'датчики подключены';
        }
        if (this.props.connectedStatus === undefined) {
            connected = '';
        }
        const clazz = this.props.connectedStatus ? "connect-status-on" : "connect-status-off";

        return (
            <header>
                <button type="button"
                        className="button-menu"
                        onClick={this.props.onToggleMenu}>
                </button>

                <div className={`menu-shading${this.props.menuOpen ? " active" : ""}`} onClick={this.onToggleMenu}/>

                <nav className={`menu${this.props.menuOpen ? " active" : ""}`}>

                </nav>

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
