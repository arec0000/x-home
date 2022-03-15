const ws = require('ws');
//создаём сервер из пакета ws
const wss = new ws.Server({
    port: 5000,
}, () => console.log('server start '))

const messages = {
    name: 'Пошел Дима в лес'
}

const counter = {
	title: "connected-count",
	count: 0   
}

function counters() {
    counter.count = 0;
    wss.clients.forEach( () => {
        counter.count += 1;
    })
}

//обращаемся к серверу и подписываемся на событие подключение 
wss.on('connection', function connection(ws) {
    broadcastMessage()
    counters();
    console.log(counter.count);
    ws.send(JSON.stringify(messages))
    // ws.on('close', function close(ws) {
        
    // })
    ws.on('message', function (message) {
        console.log(JSON.parse(message))
        ws.send(JSON.stringify(JSON.parse(message)))
    })
})

function broadcastMessage() {
    wss.clients.forEach(client => {
        client.send(JSON.stringify(counter.count))
    })
}

