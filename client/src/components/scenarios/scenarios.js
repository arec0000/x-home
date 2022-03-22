import { Component } from "react";

import WidgetGround from "../styled-components/styled-components";
import './scenarios.css'

class ScenariosControl extends Component {
    render() {
        return (
            <WidgetGround className="scenarios-control">
                <span>Сценарий</span>
                <button>стандартный</button>
            </WidgetGround>
        )
    }
}

export default ScenariosControl;
