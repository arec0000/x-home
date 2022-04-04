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
                    {id: 'pump_state', name: 'Полив', toggleRoute: '/pump/config', state: false},
                    {id: 'led_state', name: 'Свет', toggleRoute: '/led/config', state: false},
                    {id: 'water_level', name: 'Уровень воды',state: false}
                ]
        }
    }

    onToggleFarmControl = (id, toggleRoute) => {
        if (toggleRoute) {
            this.setState(({control}) => ({
                control: control.map(item => item.id === id ? {...item, state: !item.state} : item)
            }))
            fetch(`http://predeludel.pythonanywhere.com${toggleRoute}`)
                .catch(error => console.error(`Ошибка при отправке данных на http://predeludel.pythonanywhere.com${toggleRoute} ${error}`))
        }
    }

    sendRequest = async (link) => {
        const response = await fetch(link)
        const {data} = await response.json()
        if (this._isMounted) {
            new Promise(resolve =>
                this.setState({
                    dataetime: data.dataetime,
                    sensors: [
                        {id: 'water_temp_c', name: 'Температура воды', value: data.water_temp_c, measure: '°'},
                        {id: 'air_temp_c', name: 'Температура воздуха', value: data.air_temp_c, measure: '%'},
                        {id: 'humidity', name: 'Влажность', value: data.humidity, measure: '%'}
                    ],
                    control: [
                        {id: 'pump_state', name: 'Полив', toggleRoute: '/pump/config', state: data.pump_state},
                        {id: 'led_state', name: 'Свет', toggleRoute: '/led/config', state: data.led_state},
                        {id: 'water_level', name: 'Уровень воды', state: data.water_level}
                    ]
                }, resolve)
            ).then(() => setTimeout(() => this.sendRequest(link), 3000))
        }
    }

    componentDidMount = () => {
        this._isMounted = true
        this.sendRequest('http://predeludel.pythonanywhere.com/api/data')
    }

    componentWillUnmount = () => {
        this._isMounted = false
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
                    className= {`${item.state ? "control__button active" : "control__button"}${!item.toggleRoute ? " disabled" : ""}`}
                    onClick={() => this.onToggleFarmControl(item.id, item.toggleRoute)}>
                    {item.name}
                </button>
            )
        })
        return(
            <>
                {outputs}
                <WidgetGround className="farm-control" key="farmControle">{controls}</WidgetGround>
            </>
        )
    }
}

export default GreenhouseInside;
