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
    ws.isAlive = true;
    counter.count = wss.clients.size
    sendToApp(counter)
    ws.send(JSON.stringify('Подключение установлено'))
    ws.on('message', function (message) {
        try {
            if (/^[\],:{}\s]*$/.test(message.toString()
                .replace(/\\["\\\/bfnrtu]/g, '@')
                .replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']')
                .replace(/(?:^|:|,)(?:\s*\[)+/g, ''))) {
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
            } else {
                console.log(`Получены данные не в JSON формате ${message.toString()}`)
                ws.send(JSON.stringify({title: 'error', message: 'Никита просит перевести формат в JSON'}))
            }

        } catch(error) {
            console.log(`Ошибка при получении данных, Никита плохой ${error.message}`);
            ws.send(JSON.stringify({title: 'error', message: `Ошибка при получении данных, Никита плохой ${error.message}`}))
        }
    })
    ws.on('pong', () =>  ws.isAlive = true)
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

const closeFallenConections = setInterval(() => {
    wss.clients.forEach(client => {
        if (!client.isAlive) {
            client.terminate();
            console.log('Связь с пользователем разорвана');
        } else {
            client.isAlive = false;
            client.ping();
        }
    })
}, 1000)
