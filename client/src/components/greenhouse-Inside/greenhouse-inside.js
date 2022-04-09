import { Component } from "react";
import WidgetGround from "../styled-components/styled-components";
import "./greenhouse-inside.css";

class GreenhouseInside extends Component {
    constructor(props) {
        super(props);
        this.state = {
                dataetime: '',
                sensors: [
                    {id: 'tempWater', name: 'Температура воды', value: 27, measure: '°'},
                    {id: 'tempAir', name: 'Температура воздуха', value: 100, measure: '%'},
                    {id: 'humidity', name: 'Влажность', value: 42, measure: '%'}
                ],
                control: [
                    {id: 'pump_state', name: 'Полив', toggleRoute: '/pump/config', state: false},
                    {id: 'led_state', name: 'Свет', toggleRoute: '/led/config', state: false},
                    {id: 'water_level', name: 'Уровень воды', state: false}
                ]
        }
    }

    onToggleFarmControl = (id, toggleRoute) => {
        if (toggleRoute) {
            this.setState(({control}) => ({
                control: control.map(item => item.id === id ? {...item, state: !item.state} : item)
            }))
            fetch(`http://11.1.30.22:5000${toggleRoute}`)
                .catch(error => console.error(`Ошибка при отправке данных на http://predeludel.pythonanywhere.com${toggleRoute} ${error}`))
        }
    }

    sendRequest = async (link) => {
        const response = await fetch(link)
        const data = await response.json()
        console.log(data);
        if (this._isMounted) {
            new Promise(resolve =>
                this.setState({...data}, resolve)
            ).then(() => setTimeout(() => this.sendRequest(link), 3000))
        }
    }

    componentDidMount = () => {
        this._isMounted = true
        this.sendRequest('http://11.1.30.22:5000/api/data')
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
        return (
            <ul className='widgets'>
                {outputs}
                <WidgetGround className="farm-control" key="farmControle">
                    {controls}
                </WidgetGround>
            </ul>
        )
    }
}

export default GreenhouseInside;
