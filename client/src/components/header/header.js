import { Component } from 'react'
import { Link } from 'react-router-dom';
import './header.css';

class Header extends Component {
    constructor(props) {
        super(props);
        this.state = {
            menuOpened: false,
            currentPath: window.location.pathname
        }
    }

    onToggleMenu = () => {
        this.setState(({menuOpened}) => ({menuOpened: !menuOpened}));
    }

    changePage = (route) => {
        this.setState({currentPath: route});
    }

    render() {
        const {pages, connectedStatus} = this.props;

        let clazz;

        if (connectedStatus) {
            switch(this.state.currentPath) {
                case '/':
                    clazz = connectedStatus.esp ? 'house-connect-status-on' : 'house-connect-status-off';
                    break;
                case '/greenhouse-outside':
                    clazz = connectedStatus.greenhouse ? 'farm-connect-status-on' : 'farm-connect-status-off';
                    break;
                case '/robot-control':
                    clazz = connectedStatus.robot ? 'robot-connect-status-on' : 'robot-connect-status-off';
                    break;
                default:
                    clazz = '';
            }
        } else {
            clazz = 'disconnected';
        }

        const links = pages.map((item, index) => (
            <li
                key={index}>
                    <Link
                        to={item.route}
                        className={item.route === window.location.pathname ? "menu__link current" : "menu__link"}
                        onClick={() => this.changePage(item.route)}>
                            {item.name}
                    </Link>
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
