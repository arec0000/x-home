import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './components/app/App';

const socket = new WebSocket("ws://localhost:5000");

ReactDOM.render(
  <React.StrictMode>
    <App socket={socket}/>
  </React.StrictMode>,
  document.getElementById('root')
);
