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
            sensTemp: 27.3,
            sensWetness: 40,
            connectedStatus: true,
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

    componentDidMount() {
        this.connect();
    }

    onClickDoor = () => {
        this.setState(({doorControl}) => ({
            doorControl: !doorControl
        }));
    }

    render() {
        const {connectedStatus, sensTemp, sensWetness, doorControl, lightButtons} = this.state;
        return (
            <div className="App">
                <Header connectedStatus={connectedStatus}/>
                <ul className="widgets">
                    <ClimateWidget
                        key={1}
                        sensTemp={sensTemp}
                        sensWetness={sensWetness}/>
                    <DoorControl
                        key={2}
                        doorControl={doorControl}
                        onClickDoor={this.onClickDoor}/>
                    <LightControl
                        key={3}
                        lightButtons={lightButtons}/>
                    <ScenariosControl
                        key={4}/>
                </ul>
            </div>
        );
    }
}

export default App;
