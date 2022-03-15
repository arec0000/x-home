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
    counters(); 
    broadcastMessage()
    ws.send(JSON.stringify(messages))
    // ws.on('close', function close(ws) {
        
    // })
    ws.on('message', function (message) {
        const newMessage = JSON.parse(message)
        if (newMessage.title == "authentication") {
            ws.id = newMessage.id;
            console.log(ws.id);
        } else if (newMessage.title == "data-from-app") {
            uotputMessageClient(message);
        } else {
            console.log(JSON.parse(message))
            // ws.send(JSON.stringify(JSON.parse(message)))
            outputJastClient(message);
        }
         
    })
})

function broadcastMessage() {
    wss.clients.forEach(client => {
        client.send(JSON.stringify(counter))
    })
}

function uotputMessageClient(message) {
    wss.clients.forEach(client => {
        if (client.id !== 'app') {
            client.send(JSON.stringify(JSON.parse(message)))
        }
    })
}

function outputJastClient(message) {
    wss.clients.forEach(client => {
        if (client.id === 'app') {
            client.send(JSON.stringify(JSON.parse(message)))
        }
    })
}