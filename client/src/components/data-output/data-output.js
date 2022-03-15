import ConnectedCount from '../connected-count/connected-count';

import './data-output.css';

function DataOutput({data}) {
    return (
        <div className="data-output">
            <div className="data-output__header">
                <h2 className="data-output__header__description">Данные полученные от клиента</h2>
                <ConnectedCount/>
            </div>
            <div className="data-output__field">
                {data}
            </div>
            <button className="data-output__clear">очистить</button>
        </div>
    );
}

export default DataOutput;