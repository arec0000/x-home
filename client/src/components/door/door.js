import { Component } from "react";

import WidgetGround from "../styled-components/styled-components";

import './door.css';

class DoorControl extends Component {
    constructor(props) {
        super(props);
        this.state = {
            doorControl: this.props.doorControl
        }
    }

    onClickDoor = () => {
        this.setState(({doorControl}) => ({
            doorControl: !doorControl
        }));
    }

    render() {

        return (
            <WidgetGround className="door-control">
                <span
                    className="door-off-on">
                    {this.state.doorControl ? "Дверь закрыта" : "Дверь открыта"}
                </span>
                <button
                    className={this.state.doorControl ? "button-status-on" : "button-status-off"}
                    onClick={this.onClickDoor}>
                        {this.state.doorControl ? "Открыть" : "Закрыть"}
                </button>
            </WidgetGround>
        )
    }
}

export default DoorControl;
