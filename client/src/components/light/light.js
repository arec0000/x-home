import WidgetGround from "../styled-components/styled-components";

import './light.css';

const LightControl = ({lightButtons, onToggleLight}) => {
    const buttons = lightButtons.map(item => {
        return (
            <button
                className={item.shine ? 'light-on' : 'light-off'}
                type="button"
                key={item.id}
                onClick={() => onToggleLight(item.id)}>
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

export default LightControl;
