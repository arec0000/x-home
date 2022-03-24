import { Component } from 'react'

import './header.css';

class Header extends Component {

    onToggleMenu = (e) => {
        if (e.target.classList.contains('menu-shading')) {
            this.props.onToggleMenu();
        }
    }

    render() {
        const {connectedStatus, menuOpen, pages, currentPage, onToggleMenu, changePage} = this.props;

        let connected = 'датчики отключены';
        if (connectedStatus) {
            connected = 'датчики подключены';
        }
        if (connectedStatus === undefined) {
            connected = '';
        }
        const clazz = connectedStatus ? "connect-status-on" : "connect-status-off";

        const links = pages.map(item => (
            <li
                className={item === currentPage ? 'current' : ''}
                key={item}
                onClick={() => changePage(item)}>
                    {item}
            </li>
        ));

        return (
            <header>
                <button type="button"
                        className="button-menu"
                        onClick={onToggleMenu}>
                </button>

                <div className={`menu-shading${menuOpen ? " active" : ""}`} onClick={this.onToggleMenu}/>

                <nav className={`menu${menuOpen ? " active" : ""}`}>
                    <ul className="pagesList">
                        {links}
                    </ul>
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
