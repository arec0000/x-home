import { Component } from "react";

import './robot-control.css';

class RobotControl extends Component {
    constructor(props) {
        super(props);
        this.state = {
            robot: this.props.robot,
        }
    }

    onClick = (id) => {
        if (id !== this.state.robot.target) {
            this.setState({robot: {...this.state.robot, target: id}});
            this.props.sendData(JSON.stringify({title: 'data-from-app-to-robot', target: id}));
        }
    }

    render() {
        const {robot} = this.state;

        const rooms = this.props.robotRooms.map(item => {

            let clazz = 'room-button';
            if (item.id === robot.current) {
                clazz += ' current-room';
            } else if (item.id === robot.target) {
                clazz += ' target-room';
            }

            let iconClass = '';
            if (item.id === robot.current && !robot.state) {
                iconClass = 'robot-standing';
            }
            if (item.id === robot.current && robot.state) {
                iconClass = 'robot-moving';
            }
            if (item.id !== robot.current && item.id === robot.target) {
                iconClass = 'marker';
            }

            return (
                <button
                    key={item.id}
                    className={clazz}
                    onClick={() => this.onClick(item.id)}
                    disabled={robot.state}>
                        {item.name}
                        <div className={iconClass}/>
                </button>
            )
        });

        return (
            <div className="rooms-field">
                {rooms}
            </div>
        )
    }
}

export default RobotControl;
