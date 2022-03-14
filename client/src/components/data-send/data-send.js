import './data-send.css'

function DataSend() {
    return (
        <div className="data-send">
            <h2 className="data-send__header">Отправка данных подключенным клиентам</h2>
            <form>
                <div className="data-send__input-line">
                    <div>
                        <h3 className="data-send__input-line__header">ключ 1</h3>
                        <input type="text" className="data-send__input" placeholder="введите что-то"/>
                    </div>
                    <div>
                        <h3 className="data-send__input-line__header">значение 1</h3>
                        <input type="text" className="data-send__input" placeholder="введите что-то"/>
                    </div>
                </div>
                <div className="data-send__input-line">
                    <div>
                        <h3 className="data-send__input-line__header">ключ 2</h3>
                        <input type="text" className="data-send__input" placeholder="введите что-то"/>
                    </div>
                    <div>
                        <h3 className="data-send__input-line__header">значение 2</h3>
                        <input type="text" className="data-send__input" placeholder="введите что-то"/>
                    </div>
                </div>
                <div className="data-send__input-line">
                    <div>
                        <h3 className="data-send__input-line__header">ключ 3</h3>
                        <input type="text" className="data-send__input" placeholder="введите что-то"/>
                    </div>
                    <div>
                        <h3 className="data-send__input-line__header">значение 3</h3>
                        <input type="text" className="data-send__input" placeholder="введите что-то"/>
                    </div>
                </div>
                <button type="submit" className="data-send__submit">отправить</button>
            </form>
        </div>
    );
}

export default DataSend;