import { Component } from 'react';
import socket from './socket';

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

    onToggleMenu = () => {
        this.setState(({menuOpened}) => ({menuOpened: !menuOpened}));
    }

    changePage = (page) => {
        this.setState({currentPage: page});
    }

    sendData = (data) => {
        try {
            socket.chanel.send(data);
            console.log(`Отправлены данные: ${data}`);
        } catch (err) {
            console.error(`Ошибка при отправке данных: ${err.message}`);
        }
    }

    onMessage = (e) => {
        const message = JSON.parse(e.data);
        console.log(message);
    }

    componentDidMount() {
        socket.connect(this.onMessage);
    }

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
            default: //Главная
                Page = () => {
                    return (
                        <ul className="widgets">
                            <ClimateWidget
                                key={1}
                                climate={climate}
                                sendData={this.sendData}/>
                            <DoorControl
                                key={2}
                                doorControl={doorControl}
                                sendData={this.sendData}/>
                            <LightControl
                                key={3}
                                lightButtons={lightButtons}
                                sendData={this.sendData}/>
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
