import { Component } from "react";

import WidgetGround from "../styled-components/styled-components";

import './climate.css';

class ClimateWidget extends Component {
    constructor(props) {
        super(props);
        this.state = {
            tempIsValid: true,
            wetIsValid: true
        }
    }

    onBlur = (e) => {
        new Promise(resolve => {
            if (e.target.getAttribute('data-input') === 'wishTemp' && e.target.value >= 15 && e.target.value <= 35) {
                this.setState({tempIsValid: true}, resolve);
            } else if (e.target.getAttribute('data-input') === 'wishTemp') {
                this.setState({tempIsValid: false}, resolve);
            }

            if (e.target.getAttribute('data-input') === 'wishWet' && e.target.value > 0) {
                this.setState({wetIsValid: true}, resolve);
            } else if (e.target.getAttribute('data-input') === 'wishWet') {
                this.setState({wetIsValid: false}, resolve);
            }
        }).then(() => {
            if (this.state.tempIsValid && this.state.wetIsValid) {
                this.props.sendData({
                    title: 'data-from-app-to-esp',
                    climate: {sensTemp: this.props.climate.sensTemp,
                              sensWet: this.props.climate.sensWet,
                              wishTemp: +this.props.wishTemp,
                              wishWet: +this.props.wishWet}
                });
            }
        })
    }

    render() {
        return (
            <WidgetGround className="climate">
                <div>
                    <span>Температура {this.props.climate.sensTemp}°</span>
                    <input
                        className={this.state.tempIsValid ? 'climate__input' : 'climate__input wrong'}
                        type="text"
                        value={this.props.climate.wishTemp}
                        data-input="wishTemp"
                        onChange={this.props.onChangeClimate}
                        onBlur={this.onBlur}/>
                </div>
                <div>
                    <span>Влажность {this.props.climate.sensWet}%</span>
                    <input
                        className={this.state.wetIsValid ? 'climate__input' : 'climate__input wrong'}
                        type="text"
                        value={this.props.climate.wishWet}
                        data-input="wishWet"
                        onChange={this.props.onChangeClimate}
                        onBlur={this.onBlur}/>
                </div>
            </WidgetGround>
        )
    }
}

export default ClimateWidget;
