import './robot-control.css';

const RobotControl = ({robot, robotRooms, changeRobotTarget}) => {

    const rooms = robotRooms.map(item => {

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
                onClick={() => changeRobotTarget(item.id)}
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

export default RobotControl;
