import { Component } from "react";

import WidgetGround from "../styled-components/styled-components";

import './climate.css';

class ClimateWidget extends Component {
    constructor(props) {
        super(props);
        this.state = {
            wishTemp: this.props.climate.wishTemp,
            wishWet: this.props.climate.wishWet
        }
    }

    onChange = (e) => {
        if (e.target.value.replace(/\D/g, '').length <= 3) {

            e.target.value = e.target.value.replace(/\D/g, '');

            if (e.target.value === '0') {
                e.target.value = ''
            }

            if (e.target.value.replace(/\D/g, '').length === 3 && e.target.value !== '100') {
                e.target.value = +e.target.value.replace(/\D/g, '') / 10;
            }

            this.setState({[e.target.getAttribute('data-input')]: e.target.value});
        }
    }

    //Отправлять данные после снятия фокуса, проверять подходят ли они,
    //если нет, не отправлять и менять цвет формы

    render() {
        return (
            <WidgetGround className="climate">
                <div>
                    <span>Температура {this.props.climate.sensTemp}°</span>
                    <input
                        type="text"
                        value={this.state.wishTemp}
                        data-input="wishTemp"
                        onChange={this.onChange}/>
                </div>
                <div>
                    <span>Влажность {this.props.climate.sensWetness}%</span>
                    <input
                        type="text"
                        value={this.state.wishWet}
                        data-input="wishWet"
                        onChange={this.onChange}/>
                </div>
            </WidgetGround>
        )
    }
}

export default ClimateWidget;
