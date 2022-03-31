import { Component } from "react";

import WidgetGround from "../styled-components/styled-components";
import './scenarios.css'

class ScenariosControl extends Component {
    render() {
        return (
            <WidgetGround className="scenarios-control">
                <span>Сценарий</span>
                <select className="scenarios-control__select">
                    <option value="standart">Стандартный</option>
                    <option value="morning">Утро</option>
                    <option value="another-one">И ещё какой-то</option>
                </select>
            </WidgetGround>
        )
    }
}

export default ScenariosControl;
