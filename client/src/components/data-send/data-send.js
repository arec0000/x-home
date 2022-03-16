import { Component } from 'react';

import './data-send.css'

class DataSend extends Component {
    constructor(props) {
        super(props);
        this.state = {
            keys: ['', '', ''],
            values: ['', '', '']
        }
    }

    onInput = (e) => {
        if (e.target.getAttribute('data-key')) {
            this.setState(({keys}) => {
                const newKeys = [...keys];
                newKeys[e.target.getAttribute('data-key') - 1] = e.target.value;
                return {keys: newKeys}
            });
        }
        if (e.target.getAttribute('data-value')) {
            this.setState(({values}) => {
                const newValues = [...values];
                newValues[e.target.getAttribute('data-value') - 1] = e.target.value;
                return {values: newValues}
            });
        }
    }

    onSubmit = (e) => {
        const {keys, values} = this.state;
        e.preventDefault();

        const data = {
            title: 'data-from-app'
        }

        keys.forEach((key, i) => {
            data[key] = values[i]
        });

        this.props.onSend(JSON.stringify(data));

        this.setState({
            keys: ['', '', ''],
            values: ['', '', '']
        });
    }

    render() {
        const {keys, values} = this.state;
        return (
            <div className="data-send">
                <h2 className="data-send__header">Отправка данных подключенным клиентам</h2>
                <form onSubmit={this.onSubmit}>
                    <div className="data-send__input-line">
                        <div>
                            <h3 className="data-send__input-line__header">ключ 1</h3>
                            <input className="data-send__input"
                                   value={keys[0]}
                                   type="text" 
                                   placeholder="введите что-то" 
                                   data-key="1"
                                   onChange={this.onInput}/>
                        </div>
                        <div>
                            <h3 className="data-send__input-line__header">значение 1</h3>
                            <input className="data-send__input"
                                   value={values[0]}
                                   type="text" 
                                   placeholder="введите что-то"
                                   data-value="1"
                                   onChange={this.onInput}/>
                        </div>
                    </div>
                    <div className="data-send__input-line">
                        <div>
                            <h3 className="data-send__input-line__header">ключ 2</h3>
                            <input className="data-send__input"
                                   value={keys[1]}
                                   type="text" 
                                   placeholder="введите что-то"
                                   data-key="2"
                                   onChange={this.onInput}/>
                        </div>
                        <div>
                            <h3 className="data-send__input-line__header">значение 2</h3>
                            <input className="data-send__input"
                                   value={values[1]}
                                   type="text"
                                   placeholder="введите что-то"
                                   data-value="2"
                                   onChange={this.onInput}/>
                        </div>
                    </div>
                    <div className="data-send__input-line">
                        <div>
                            <h3 className="data-send__input-line__header">ключ 3</h3>
                            <input className="data-send__input"
                                   value={keys[2]}
                                   type="text"
                                   placeholder="введите что-то"
                                   data-key="3"
                                   onChange={this.onInput}/>
                        </div>
                        <div>
                            <h3 className="data-send__input-line__header">значение 3</h3>
                            <input className="data-send__input"
                                   value={values[2]}
                                   type="text"
                                   placeholder="введите что-то"
                                   data-value="3"
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