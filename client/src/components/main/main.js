import ClimateWidget from '../climate/climate';
import DoorControl from '../door/door';
import LightControl from '../light/light';
import ScenariosControl from '../scenarios/scenarios';

const Main = ({climate, onChangeClimate, doorControl, onClickDoor, lightButtons, onToggleLight, sendData}) => {
    return (
        <ul className="widgets">
            <ClimateWidget
                key="1"
                climate={climate}
                onChangeClimate={onChangeClimate}
                sendData={sendData}/>
            <DoorControl
                key="2"
                doorControl={doorControl}
                onClickDoor={onClickDoor}/>
            <LightControl
                key="3"
                lightButtons={lightButtons}
                onToggleLight={onToggleLight}/>
            <ScenariosControl
                key="4"/>
        </ul>
    )
}

export default Main;
