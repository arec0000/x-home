import { Component } from 'react';

import Header from '../header/header';
import ClimateWidget from '../climate/climate';
import DoorControl from '../door/door';
import LightControl from '../light/light';
import ScenariosControl from '../scenarios/scenarios';

import './App.css';

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            socket: null,
            menuOpened: false,
            currentPage: 'Главная',
            pages: ['Главная', 'Теплица', 'Робот'],
            connectedStatus: true, //нужно переделать
            climate: {sensTemp: 27.3, sensWet: 40, wishTemp: 29, wishWet: 55},
            doorControl: false,
            lightButtons: [
                {name: 'спальня', shine: true, id: 1},
                {name: 'кухня', shine: false, id: 2},
                {name: 'гостинная', shine: false, id: 3},
                {name: 'территория', shine: false, id: 4},
                {name: 'гараж', shine: false, id: 5}
            ]
        }
    }

    connect = () => {
        const socket = new WebSocket("ws://localhost:5000");

        socket.onopen = () => {
            socket.send(JSON.stringify({title: 'authentication', id: 'app'}));
            this.setState({socket: socket});
            console.log('Подлкючение установлено');
        };

        socket.onmessage = e => {
            const message = JSON.parse(e.data);
            if (message.title === 'connected-count') {
                this.setState({connectedCount: message.count});
            } else {
                this.setState({data: e.data});
            }
        }

        socket.onclose = e => {
            if (e.wasClean) {
                console.log('Соединение закрыто');
            } else {
                console.log('Соединение прервано');
                this.setState({
                    connectedCount: 0,
                    data: 'Соединение прервано, переподключение..'
                });
            }
            setTimeout(() => this.connect(), 3000);
        }

        socket.onerror = err => {
            console.error(`Ошибка: ${err.message}`);
            socket.close();
        }
    }

    sendData = (data) => {
        try {
            this.state.socket.send(data);
        } catch (err) {
            console.error(`Ошибка при отправке данных: ${err.message}`);
            this.setState({
                data: 'Ошибка при отправке данных..'
            });
        }
    }

    onToggleMenu = () => {
        this.setState(({menuOpened}) => ({menuOpened: !menuOpened}));
    }

    changePage = (page) => {
        this.setState({currentPage: page});
    }

    onClickDoor = () => {
        this.setState(({doorControl}) => ({
            doorControl: !doorControl
        }));
    }

    onToggleLight = (id) => {
        this.setState(({lightButtons}) => ({
            lightButtons: lightButtons.map(item =>
                item.id === id ? {...item, shine: !item.shine} : item
            )
        }))
    }

    // componentDidMount() {
    //     this.connect();
    // }

    render() {
        const {menuOpened, currentPage, pages, connectedStatus, climate, doorControl, lightButtons} = this.state;

        let Page;

        switch (currentPage) {
            case 'Теплица':
                Page = () => {
                    return (
                        <h3>Тут типо теплица</h3>
                    )
                }
                break;
            case 'Робот':
                Page = () => {
                    return (
                        <h3>А тут робот</h3>
                    )
                }
                break;
            default:
                Page = () => {
                    return (
                        <ul className="widgets">
                            <ClimateWidget
                                key={1}
                                climate={climate}/>
                            <DoorControl
                                key={2}
                                doorControl={doorControl}
                                onClickDoor={this.onClickDoor}/>
                            <LightControl
                                key={3}
                                lightButtons={lightButtons}
                                onToggleLight={this.onToggleLight}/>
                            <ScenariosControl
                                key={4}/>
                        </ul>
                    )
                }
        }

        return (
            <div className="App">
                <Header
                    menuOpened={menuOpened}
                    currentPage={currentPage}
                    pages={pages}
                    connectedStatus={connectedStatus}
                    onToggleMenu={this.onToggleMenu}
                    changePage={this.changePage}/>
                <Page/>
            </div>
        );
    }
}

export default App;
