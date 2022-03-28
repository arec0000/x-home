import WidgetGround from "../styled-components/styled-components";
import "./greenhouse.css";

const Greenhouse = (props) => {
    const farm = props.farm.map((item, index) => {
        return (
            <WidgetGround
            className="farm-section"
            key={item.id}>
                    <span className="title">Секция {index + 1}</span>
                    <div className="farm-outputs">
                        <span>Температура {item.temp}°</span>
                        <span>Влажность {item.humidity}%</span>
                    </div>
            </WidgetGround>
        )
    });

    return(
        <>{farm}</>
    )
}

export default Greenhouse;
