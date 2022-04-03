import WidgetGround from "../styled-components/styled-components";
import "./greenhouse.css";

const Greenhouse = (props) => {
    const farm = props.farm
        .sort((prev, next) => prev.id - next.id)
        .map((item, index) => {
            return (
                <WidgetGround
                className="farm-section"
                key={index}>
                        <span className="title">Секция {item.id}</span>
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
