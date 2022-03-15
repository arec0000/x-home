import { Component } from 'react';

import DataOutput from '../data-output/data-output';
import DataSend from '../data-send/data-send';

import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: ''
    }
  }

  render() {
    const socket = new WebSocket("ws://localhost:5000");

    socket.onopen = function(e) {
      console.log('Подлкючение установлено');
    };

    socket.onmessage = function(e) {
      this.setState({data: e.data});
    }

    socket.onclose = function(e) {
      if (e.wasClean) {
        console.log('Соединение закрыто');
      } else {
        console.log('Соединение прервано(');
      }
    }

    socket.onerror = function(err) {
      console.log('Ошибка');
    }

    return (
      <div className="App">
        <DataOutput data={this.state.data}/>
        <DataSend/>
      </div>
    );
  }
}

export default App;