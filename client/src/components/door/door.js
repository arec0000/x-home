import { Component } from "react";

import WidgetGround from "../styled-components/styled-components";

import './door.css';

class DoorControl extends Component {

    render() {

        return (
            <WidgetGround className="door-control">
                <span
                    className="door-off-on">
                    {this.props.doorControl ? "Дверь закрыта" : "Дверь открыта"}
                </span>
                <button
                    className={this.props.doorControl ? "button-status-on" : "button-status-off"}
                    onClick={this.props.onClickDoor}
                    >{this.props.doorControl ? "Открыть" : "Закрыть"}
                </button>
            </WidgetGround>
        )
    }
}

export default DoorControl;
