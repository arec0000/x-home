import ConnectedCount from '../connected-count/connected-count';

import './data-output.css';

function DataOutput() {
    return (
        <div className="data-output">
            <div className="data-output__header">
                <h2 className="data-output__header__description">Данные полученные от клиента</h2>
                <ConnectedCount/>
            </div>
            <div className="data-output__field">
                
            </div>
            <button className="data-output__clear">очистить</button>
        </div>
    );
}

export default DataOutput;