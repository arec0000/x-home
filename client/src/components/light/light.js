import { Component } from "react";

import WidgetGround from "../styled-components/styled-components";

import './light.css';

class LightControl extends Component {
    constructor(props) {
        super(props);
        this.state = {
            lightButtons: this.props.lightButtons
        }
    }

    onToggleLight = (id) => {
        new Promise(resolve => this.setState(({lightButtons}) => ({
            lightButtons: lightButtons.map(item =>
                item.id === id ? {...item, shine: !item.shine} : item
            )
        }), resolve))
            .then(() =>
                this.props.sendData({title: 'data-from-app-to-esp', lightButtons: this.state.lightButtons})
            );
    }

    render() {

        const buttons = this.state.lightButtons.map(item => {
            const clazz = item.shine ? 'light-on' : 'light-off';
            return (
                <button
                    className={clazz}
                    type="button"
                    key={item.id}
                    onClick={() => this.onToggleLight(item.id)}>
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
