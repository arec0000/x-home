import WidgetGround from "../styled-components/styled-components";

import './door.css';

const DoorControl = ({doorControl, onClickDoor}) => {
    return (
        <WidgetGround className="door-control">
            <span
                className="door-off-on">
                {doorControl ? "Дверь закрыта" : "Дверь открыта"}
            </span>
            <button
                className={doorControl ? "button-status-on" : "button-status-off"}
                onClick={onClickDoor}>
                    {doorControl ? "Открыть" : "Закрыть"}
            </button>
        </WidgetGround>
    )
}

export default DoorControl;
