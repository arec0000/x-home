import { Component } from 'react';
import socket from './socket';

import Header from '../header/header';
import ClimateWidget from '../climate/climate';
import DoorControl from '../door/door';
import LightControl from '../light/light';
import ScenariosControl from '../scenarios/scenarios';
import RobotControl from '../robot-control/robot-control';
import Greenhouse from '../greenhouse/greenhouse';

import './App.css';

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentPage: localStorage.getItem('lastPage') || 'Главная',
            pages: ['Главная', 'Теплица', 'Робот'],
            connectedStatus: {esp: false, greenhouse: false, robot: false},
            climate: {sensTemp: 27.3, sensWet: 40, wishTemp: 29, wishWet: 55},
            doorControl: false,
            lightButtons: [
                {name: 'спальня', shine: true, id: 1},
                {name: 'кухня', shine: false, id: 2},
                {name: 'гостинная', shine: false, id: 3},
                {name: 'территория', shine: false, id: 4},
                {name: 'гараж', shine: false, id: 5}
            ],
            farm: [
                {temp: 27, humidity: 40},
                {temp: 24, humidity: 74}
            ],
            robot: {state: false, current: 1, target: 5},
            robotRooms: [
                {name: 'Гараж', id: 1},
                {name: 'Спальня', id: 2},
                {name: 'Кухня', id: 3},
                {name: 'Гостинная', id: 4},
                {name: 'Корридор', id: 5},
                {name: 'Гардеробная', id: 6},
                {name: 'Холл', id: 7}
            ]
        }
    }

    changePage = (page) => {
        this.setState({currentPage: page});
        localStorage.setItem('lastPage', page);
        this.sendData({title: 'page-data-request', page});
    }

    sendData = (data) => {
        try {
            socket.chanel.send(JSON.stringify(data));
            console.log(`Отправлены данные: ${JSON.stringify(data)}`);
        } catch (err) {
            console.error(`Ошибка при отправке данных: ${err.message}`);
        }
    }

    onMessage = (e) => {
        try {
            const message = JSON.parse(e.data);
            console.log(`Получены данные: ${e.data}`);
            if (message.connectedStatus) {
                this.setState({connectedStatus: message.connectedStatus});
            }
            if (message.esp) {
                this.setState({
                    climate: message.esp.climate,
                    doorControl: message.esp.doorControl,
                    lightButtons: message.esp.lightButtons
                });
            }
            if (message.farm) {
                this.setState({farm: message.farm});
            }
            if (message.robot) {
                this.setState({robot: message.robot});
            }
        } catch (err) {
            console.error(`Ошибка при получении данных: ${err.message}`);
        }
    }

    componentDidMount() {
        if (!socket.chanel) {
            socket.connect('ws://localhost:5000', this.onMessage);
        }
    }

    render() {
        const {currentPage, pages, connectedStatus, climate,
               doorControl, lightButtons, farm, robot, robotRooms} = this.state;

        const Page = () => {
            switch (currentPage) {
                case 'Теплица':
                    return <ul className='widgets'>
                             <Greenhouse
                                key={1}
                                farm={farm}/>
                           </ul>
                case 'Робот':
                    return <RobotControl
                                robot={robot}
                                robotRooms={robotRooms}
                                connectedStatus={connectedStatus}
                                sendData={this.sendData}/>
                default: //Главная
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
                    );
            }
        }

        return (
            <div className="App">
                <Header
                    currentPage={currentPage}
                    pages={pages}
                    connectedStatus={connectedStatus}
                    changePage={this.changePage}/>
                <Page/>
            </div>
        );
    }
}

export default App;
