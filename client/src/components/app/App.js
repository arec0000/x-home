import { Component } from 'react';
import { Routes, Route} from 'react-router-dom';
import socket from './socket';

import Header from '../header/header';
import Main from '../main/main';
import RobotControl from '../robot-control/robot-control';
import Greenhouse from '../greenhouse/greenhouse';
import GreenhouseInside from '../greenhouse-Inside/greenhouse-inside';

import './App.css';

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            connectedStatus: null,
            pages: [
                {name: 'Главная', route: '/'},
                {name: 'Внешняя теплица', route: '/greenhouse-outside'},
                {name: 'Внутренняя теплица', route: '/greenhouse-inside'},
                {name: 'Робот', route: '/robot-control'}
            ],
            climate: {sensTemp: 15, sensWet: 45, wishTemp: 0, wishWet: 0},
            doorControl: false,
            lightButtons: [
                {name: 'спальня', shine: false, id: 1},
                {name: 'кухня', shine: false, id: 2},
                {name: 'гостинная', shine: false, id: 3},
                {name: 'территория', shine: false, id: 4},
                {name: 'гараж', shine: false, id: 5}
            ],
            farm: [
                {id: 1, temp: 15, humidity: 45},
                {id: 2, temp: 15, humidity: 45}
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

    onChangeClimate = (e) => {
        if (e.target.value.replace(/\D/g, '').length <= 3) {

            e.target.value = e.target.value.replace(/\D/g, '');

            if (e.target.value === '0') {
                e.target.value = ''
            }

            if (e.target.value.replace(/\D/g, '').length === 3 && e.target.value !== '100') {
                e.target.value = +e.target.value.replace(/\D/g, '') / 10;
            }

            this.setState(({climate}) => ({
                climate: {...climate, [e.target.getAttribute('data-input')]: e.target.value}
            }));
        }
    }

    onToggleLight = (id) => {
        new Promise(resolve => this.setState(({lightButtons}) => ({
            lightButtons: lightButtons.map(item =>
                item.id === id ? {...item, shine: !item.shine} : item
            )
        }), resolve))
            .then(() =>
                this.sendData({title: 'data-from-app-to-esp', lightButtons: this.state.lightButtons})
            );
    }

    onClickDoor = () => {
        new Promise(resolve => this.setState(({doorControl}) => ({doorControl: !doorControl}), resolve))
            .then(() =>
                this.sendData({title: 'data-from-app-to-esp', doorControl: this.state.doorControl})
            );
    }

    changeRobotTarget = (id) => {
        const connected = this.state.connectedStatus ? this.state.connectedStatus.robot : undefined;
        if (id !== this.state.robot.target && id !== this.state.robot.current && connected === undefined) {
            this.setState({robot: {...this.state.robot, target: id}});
            return console.error('Связь с сервером потеряна, отправка данных на робота невозможна!');
        }
        if (id !== this.state.robot.target && id !== this.state.robot.current && connected) {
            this.setState({robot: {state: true, current: this.state.robot.current, target: id}});
            this.sendData({title: 'data-from-app-to-robot', target: id});
        } else if (id !== this.state.robot.target && id !== this.state.robot.current) {
            this.setState({robot: {...this.state.robot, target: id}});
            console.error('Робот не в сети, отправка данных невозможна!');
        }
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

    onClose = () => {
        this.setState({connectedStatus: null});
    }

    componentDidMount() {
        if (!socket.chanel) {
            socket.connect('ws://81.163.29.85:5000', this.onMessage, this.onClose);
        }
    }

    render() {
        const {connectedStatus, pages, climate, doorControl,
               lightButtons, farm, robot, robotRooms} = this.state;

        return (
            <>
                <Header
                    pages={pages}
                    connectedStatus={connectedStatus}/>
                <Routes>
                    <Route
                        path="/"
                        element={<Main
                                    climate={climate}
                                    onChangeClimate={this.onChangeClimate}
                                    doorControl={doorControl}
                                    onClickDoor={this.onClickDoor}
                                    lightButtons={lightButtons}
                                    onToggleLight={this.onToggleLight}
                                    sendData={this.sendData}/>
                                } />
                    <Route path="/greenhouse-outside" element={<Greenhouse farm={farm}/>} />
                    <Route path="/greenhouse-inside" element={<GreenhouseInside/>} />
                    <Route
                        path="/robot-control"
                        element={<RobotControl
                                    robot={robot}
                                    robotRooms={robotRooms}
                                    changeRobotTarget={this.changeRobotTarget}/>
                                } />
                </Routes>
            </>
        );
    }
}

export default App;
