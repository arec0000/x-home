import { Component } from 'react';

import './data-send.css'

class DataSend extends Component {
    constructor(props) {
        super(props);
        this.state = {
            key1: '',
            key2: '',
            key3: '',
            value1: '',
            value2: '',
            value3: ''
        }
    }

    onInput = (e) => {
        this.setState({
            [e.target.getAttribute('data-input')]: e.target.value
        });
    }

    onSubmit = (e) => {
        const {key1, key2, key3, value1, value2, value3} = this.state;
        e.preventDefault();
        this.props.onSend(JSON.stringify({
            [key1]: value1,
            [key2]: value2,
            [key3]: value3
        }));
        this.setState({
            key1: '',
            key2: '',
            key3: '',
            value1: '',
            value2: '',
            value3: ''
        });
    }

    render() {
        const {key1, key2, key3, value1, value2, value3} = this.state;
        return (
            <div className="data-send">
                <h2 className="data-send__header">Отправка данных подключенным клиентам</h2>
                <form onSubmit={this.onSubmit}>
                    <div className="data-send__input-line">
                        <div>
                            <h3 className="data-send__input-line__header">ключ 1</h3>
                            <input className="data-send__input"
                                   value={key1}
                                   type="text" 
                                   placeholder="введите что-то" 
                                   data-input="key1"
                                   onChange={this.onInput}/>
                        </div>
                        <div>
                            <h3 className="data-send__input-line__header">значение 1</h3>
                            <input className="data-send__input"
                                   value={value1}
                                   type="text" 
                                   placeholder="введите что-то"
                                   data-input="value1"
                                   onChange={this.onInput}/>
                        </div>
                    </div>
                    <div className="data-send__input-line">
                        <div>
                            <h3 className="data-send__input-line__header">ключ 2</h3>
                            <input className="data-send__input"
                                   value={key2}
                                   type="text" 
                                   placeholder="введите что-то"
                                   data-input="key2"
                                   onChange={this.onInput}/>
                        </div>
                        <div>
                            <h3 className="data-send__input-line__header">значение 2</h3>
                            <input className="data-send__input"
                                   value={value2}
                                   type="text"
                                   placeholder="введите что-то"
                                   data-input="value2"
                                   onChange={this.onInput}/>
                        </div>
                    </div>
                    <div className="data-send__input-line">
                        <div>
                            <h3 className="data-send__input-line__header">ключ 3</h3>
                            <input className="data-send__input"
                                   value={key3}
                                   type="text"
                                   placeholder="введите что-то"
                                   data-input="key3"
                                   onChange={this.onInput}/>
                        </div>
                        <div>
                            <h3 className="data-send__input-line__header">значение 3</h3>
                            <input className="data-send__input"
                                   value={value3}
                                   type="text"
                                   placeholder="введите что-то"
                                   data-input="value3"
                                   onChange={this.onInput}/>
                        </div>
                    </div>
                    <button type="submit" className="data-send__submit">отправить</button>
                </form>
            </div>
        );
    }
}

export default DataSend;