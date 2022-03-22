import { Component } from "react";

import WidgetGround from "../styled-components/styled-components";

import './light.css';

class LightControl extends Component {
    render() {
        return (
            <WidgetGround className="light-control">
                <span>Свет</span>
                <button
                    type="button">
                </button>
            </WidgetGround>
        )
    }
}

export default LightControl;
