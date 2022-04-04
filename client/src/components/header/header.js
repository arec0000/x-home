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
            //возможно этого не происходит
    }

    render() {
        const {currentPage, pages, connectedStatus, changePage} = this.props;
        let clazz;
        if (connectedStatus) {
            switch(currentPage) {
                case 'Главная':
                    clazz = connectedStatus.esp ? 'house-connect-status-on' : 'house-connect-status-off';
                    break;
                case 'Внешняя теплица':
                    clazz = connectedStatus.greenhouse ? 'farm-connect-status-on' : 'farm-connect-status-off';
                    break;
                case 'Робот':
                    clazz = connectedStatus.robot ? 'robot-connect-status-on' : 'robot-connect-status-off';
                    break;
                default:
                    clazz = '';
            }
        } else {
            clazz = 'disconnected';
        }

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

                <div className={`connected-icon ${clazz}`}/>

                <button type="button"
                        className="button-settings">
                </button>
            </header>
        )
    }
}

export default Header;
