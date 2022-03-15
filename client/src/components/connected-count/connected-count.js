import './connected-count.css';

function ConnectedCount({connectedCount}) {
    return <output className="connected-count">подключено: {connectedCount}</output>
}

export default ConnectedCount;