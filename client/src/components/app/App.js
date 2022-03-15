import { Component } from 'react';

import DataOutput from '../data-output/data-output';
import DataSend from '../data-send/data-send';

import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      connectedCount: 0,
      data: ''
    }
  }

  render() {
    const {socket} = this.props;

    socket.onopen = function(e) {
      console.log('Подлкючение установлено');
    };
  
    socket.onmessage = (e) => {
      this.setState({data: e.data});
    }
  
    socket.onclose = (e) => {
      if (e.wasClean) {
        console.log('Соединение закрыто');
      } else {
        console.log('Соединение прервано(');
      }
    }
  
    socket.onerror = function(err) {
      console.log('Ошибка');
    }
    
    function sendData(data) {
      socket.send(data);
    }

    return (
      <div className="App">
        <DataOutput data={this.state.data} connectedCount={this.state.connectedCount}/>
        <DataSend onSend={sendData}/>
      </div>
    );
  }
}

export default App;