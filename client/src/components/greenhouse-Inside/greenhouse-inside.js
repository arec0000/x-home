import { Component } from "react";
import WidgetGround from "../styled-components/styled-components";
import "./greenhouse-inside.css";

class GreenhouseInside extends Component {
    constructor(props) {
        super(props);
        this.state = {
                sensors: [
                    {id: 'tempWater', name: 'Температура воды', value: 27, measure: '°'},
                    {id: 'tempAir', name: 'Температура воздуха', value: 100, measure: '%'},
                    {id: 'humidity', name: 'Влажность', value: 42, measure: '%'}
                ],
                dataetime: '',
                control: [
                    {id: 'pump_state', name: 'Полив', state: true},
                    {id: 'led_state', name: 'Свет', state: false},
                    {id: 'water_level', name: 'Уровень воды', state: false}
                ]
        }
    }

    onToggleFarmControl = (id) => {
        this.setState(({control}) => ({
            control: control.map(item => item.id === id ? {...item, state: !item.state} : item)
        }))
    }

    render() {
        const outputs = this.state.sensors.map(item => {
            return(
                <WidgetGround key={item.id}>
                    <span className="output__text">{`${item.name} ${item.value}${item.measure}`}</span>
                </WidgetGround>
            )
        })
        const controls = this.state.control.map(item => {
            return(
                <button
                    key={item.id}
                    className= {item.state ? "control__button active" : "control__button"}
                    onClick={() => this.onToggleFarmControl(item.id)}>
                    {item.name}
                </button>
            )
        })
        return(
            <>{outputs}
            <WidgetGround className="farm-control" key="farmControle">{controls}</WidgetGround></>
        )
    }
}

export default GreenhouseInside;
