import { Component } from 'react';
import Header from '../header/header';

import ClimateWidget from '../climate/climate';

import './App.css';

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            socket: null,
            sensTemp: 27.3,
            sensWetness: 40,
            connectedStatus: true
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

    render() {
        return (
            <div className="App">
                <Header connectedStatus={this.state.connectedStatus}/>
                <ul className="widgets">
                    <ClimateWidget
                        key={1}
                        sensTemp={this.state.sensTemp}
                        sensWetness={this.state.sensWetness}/>
                </ul>
            </div>
        );
    }
}

export default App;
