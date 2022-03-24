import { Component } from "react";

import WidgetGround from "../styled-components/styled-components";

import './light.css';


class LightControl extends Component {
    render() {
        const {lightButtons} = this.props;

        const buttons = lightButtons.map(item => {
            const clazz = item.shine ? 'light-on' : 'light-off';

            return (
                <button
                    className={clazz}
                    type="button"
                    key={item.id}
                    onClick={() => this.props.onToggleLight(item.id)}>
                    {item.name}
                </button>
            )
        });

        return (
            <WidgetGround className="light-control">
                <span>Свет</span>
                <div className="btn-group">
                    {buttons}
                </div>
            </WidgetGround>
        )
    }
}

export default LightControl;
