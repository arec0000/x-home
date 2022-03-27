import { Component } from 'react'

import './header.css';

class Header extends Component {
    constructor(props) {
        super(props);
        this.state = {
            menuOpened: localStorage.getItem('menuLastState') === 'true'
        }
    }

    onToggleMenu = () => {
        new Promise(resolve => this.setState(({menuOpened}) => ({menuOpened: !menuOpened}), resolve))
            .then(() => localStorage.setItem('menuLastState', this.state.menuOpened));
            //Если придут данные с сервера это изменит главный стейт и закроет меню, что неудобно
    }

    render() {
        const {currentPage, pages, connectedStatus, changePage} = this.props;

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
                        onClick={this.onToggleMenu}>
                </button>

                <div className={`menu-shading${this.state.menuOpened ? " active" : ""}`} onClick={this.onToggleMenu}/>

                <nav className={`menu${this.state.menuOpened ? " active" : ""}`}>
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
