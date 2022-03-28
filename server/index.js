const mongoose = require('mongoose');
const ws = require('ws');
const express = require('express');

// const Post = require('./Post');

// async function startApp() {
//     try {
//         await mongoose.connect('mongodb://localhost:27017/x-home', {useNewUrlParser: true, useUnifiedTopology: true})
//     } catch (e) {
//         console.log(e)
//     }
//     const post = await Post.create({author: 'ffffff', title: 'ffffffff'})
//     const posts = await Post.find({});
//     console.log(post);
//     console.log(posts);

// }
// startApp();


const app = express()

const PORT = 3000;

app.listen(PORT, (error) => {
    error ? console.log(error) : console.log(`Сервер запущен на ${PORT} порту`)
})

app.use(express.static('build'))
//отслеживание гет запросов по этому роуту
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/build/index.html')
});

const websocketServer = {
    start() {
        //создаём сервер из пакета ws
        this.chanel = new ws.Server({port: 5000}, () => console.log('Сервер запущен на 5000'))

        this.chanel.on('connection', (ws) => {
            console.log('Пользователь подключился')
            console.log(`Всего пользователей ${this.chanel.clients.size}`)
            ws.isAlive = true;
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
                        } else if (newMessage.title == 'data-from-app') {
                            this.sendExceptApp(newMessage)
                            console.log(newMessage)
                        } else {
                            this.sendToApp(newMessage)
                            console.log(newMessage)
                        }
                    } else {
                        console.log(`Получены данные не в JSON формате ${message.toString()}`)
                        ws.send(JSON.stringify({title: 'error', message: 'Никита просит перевести формат в JSON'}))
                    }

                } catch(error) {
                    console.log(`Ошибка при получении данных, Никита плохой ${error.message}`)
                    ws.send(JSON.stringify({title: 'error', message: `Ошибка при получении данных, Никита плохой ${error.message}`}))
                }
            })

            ws.on('pong', () =>  ws.isAlive = true)

            ws.on('close', () => {
                console.log('Пользователь отключился')
            })

            ws.on('error', () => {
                console.log(`Ошибка ${error.message}`)
            })
        })

        const closeFallenConections = setInterval(() => {
            this.chanel.clients.forEach(client => {
                if (!client.isAlive) {
                    client.terminate();
                    console.log('Связь с пользователем разорвана');
                } else {
                    client.isAlive = false;
                    client.ping();
                }
            })
        }, 1000)

        this.chanel.on('close', () => {
            clearInterval(closeFallenConections)
            console.log('Сервер отключен')
        })

        this.chanel.on('error', () => {
            console.log(`Ошибка ${error.message}`)
        })
    },

    sendExceptApp(message) {
        this.chanel.clients.forEach(client => {
            if (client.id !== 'app') {
                client.send(JSON.stringify(message))
            }
        })
    },

    sendToApp(message) {
        this.chanel.clients.forEach(client => {
            if (client.id === 'app') {
                client.send(JSON.stringify(message))
            }
        })
    }
}

try {
    websocketServer.start()
}   catch(error) {
    console.log(`Ошибка при запуске сервера ${error.message}`)
}
