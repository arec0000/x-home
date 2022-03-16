const ws = require('ws');
//создаём сервер из пакета ws
const wss = new ws.Server({
    port: 5000,
}, () => console.log('server start'))

const counter = {
	title: 'connected-count',
	count: 0  
}

wss.on('connection', (ws) => {
    console.log('Пользователь подключился')
    counter.count = wss.clients.size
    sendToApp(counter)
    ws.send(JSON.stringify('Подключение установлено'))
    ws.on('message', function (message) {
        const newMessage = JSON.parse(message)
        if (newMessage.title == 'authentication') {
            ws.id = newMessage.id;
            ws.send(JSON.stringify(counter))
        } else if (newMessage.title == 'data-from-app') {
            sendExceptApp(message);
            console.log(JSON.parse(message))
        } else {
            sendToApp(JSON.parse(message));
            console.log(JSON.parse(message))
        }
    })
    ws.on('close', () => {
        counter.count = wss.clients.size
        sendToApp(counter)
        console.log('Пользователь отключился')
    })
})

function sendExceptApp(message) {
    wss.clients.forEach(client => {
        if (client.id !== 'app') {
            client.send(JSON.stringify(JSON.parse(message)))
        }
    })
}

function sendToApp(message) {
    wss.clients.forEach(client => {
        if (client.id === 'app') {
            client.send(JSON.stringify(message))
        }
    })
}