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
        let clazz;

        switch(currentPage) {
            case 'Главная':
                clazz = connectedStatus.esp ? 'house-connect-status-on' : 'house-connect-status-off';
                break;
            case 'Теплица':
                clazz = connectedStatus.greenhouse ? 'farm-connect-status-on' : 'farm-connect-status-off';
                break;
            case 'Робот':
                clazz = connectedStatus.robot ? 'robot-connect-status-on' : 'robot-connect-status-off';
                break;
            default:
                clazz = '';
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

                <div className={clazz}/>

                <button type="button"
                        className="button-settings">
                </button>
            </header>
        )
    }
}

export default Header;
