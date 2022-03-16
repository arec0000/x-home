import { Component } from 'react';

import DataOutput from '../data-output/data-output';
import DataSend from '../data-send/data-send';

import './App.css';

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            socket: null,
            connectedCount: 0,
            data: ''
        }
    }

    connect = () => {
        const socket = new WebSocket("ws://81.163.29.85:5000");

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

    onClearData = () => {
        this.setState({data: ''});
    }

    componentDidMount() {
        this.connect();
    }

    render() {
        const {connectedCount, data} = this.state;
        return (
            <div className="App">
                <DataOutput 
                    data={data} 
                    connectedCount={connectedCount}
                    onClearData={this.onClearData}/>
                <DataSend onSend={this.sendData}/>
            </div>
        );
    }
}

export default App;