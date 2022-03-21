import { Component } from "react";

import WidgetGround from "../styled-components/styled-components";

import './climate.css';

class ClimateWidget extends Component {
    constructor(props) {
        super(props);
        this.state = {
            temp: '',
            wetness: ''
        }
    }

    onChange = (e) => {
        e.target.value = e.target.value.replace(/\D/g, '');
        if (e.target.value.length <= 2) {
            this.setState({
                [e.target.getAttribute('data-input')]: e.target.value
            });
        }
    }

    render() {
        return (
            <WidgetGround className="climate">
                <div>
                    <span>Температура {this.props.sensTemp}°</span>
                    <input
                        type="text"
                        value={this.state.temp}
                        data-input="temp"
                        onChange={this.onChange}/>
                </div>
                <div>
                    <span>Влажность {this.props.sensWetness}%</span>
                    <input
                        type="text"
                        value={this.state.wetness}
                        data-input="wetness"
                        onChange={this.onChange}/>
                </div>
            </WidgetGround>
        )
    }
}

export default ClimateWidget;
