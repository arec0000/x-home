const express = require('express');
const mongoose = require('mongoose');
const ws = require('ws');
const { findOne } = require('./schemes/esp');

const Esp = require('./schemes/esp')
const Farm = require('./schemes/farm')
const Robot = require('./schemes/robot')


mongoose.connect('mongodb://localhost:27017/x-home', {useNewUrlParser: true, useUnifiedTopology: true})

        // Esp.deleteOne({}, function(err, result) {

        // })

async function init() {
    Esp.findOne({}, (err, doc) => {
        if (!doc) {
            Esp.create({
                climate: {sensTemp: 30.3, sensWet: 40, wishTemp: 29, wishWet: 55},
                doorControl: false,
                lightButtons: [
                    {name: 'спальня', shine: true, id: 1},
                    {name: 'кухня', shine: false, id: 2},
                    {name: 'гостинная', shine: false, id: 3},
                    {name: 'территория', shine: false, id: 4},
                    {name: 'гараж', shine: false, id: 5}
                ]
            })
            console.log('Созданы дефолтные данные с esp, по приказу Никиты')
        } else {
            console.log(doc)
        }
    })
    Farm.find({}, (err, doc) => {
        if (!doc[0]) {
            Farm.create({temp: 30, humidity: 40}, (err, doc) => {
                console.log('Создана дефолтная секция фермы, по приказу Никиты')
            });
            Farm.create({temp: 24, humidity: 74}, (err, doc) => {
                console.log('Создана дефолтная секция фермы, по приказу Никиты')
            });
        } else {
            console.log(doc)
        }
    })
    Robot.findOne({}, (err, doc) => {
        if (!doc) {
            Robot.create({state: false, current: 1, target: 1}, (err, doc) => {
                console.log('Создан дефолтный объект робота, по приказу Никиты')
            });
        } else {
            console.log(doc)
        }
    })
}
init();


// const app = express()

// const PORT = 3000;

// app.listen(PORT, (error) => {
//     error ? console.log(error) : console.log(`Сервер запущен на ${PORT} порту`)
// })

// app.use(express.static('build'))
// //отслеживание гет запросов по этому роуту
// app.get('/', (req, res) => {
//     res.sendFile(__dirname + '/build/index.html')
// });

const websocketServer = {
    start() {
        //создаём сервер из пакета ws
        this.chanel = new ws.Server({port: 5000}, () => console.log('Сервер запущен на 5000'))

        this.chanel.on('connection', (ws) => {
            console.log('Пользователь подключился')
            console.log(`Всего пользователей ${this.chanel.clients.size}`)
            ws.isAlive = true;
            ws.send(JSON.stringify('Подключение установлено'))
            ws.on('message', async function (message) {
                try {
                    if (/^[\],:{}\s]*$/.test(message.toString()
                        .replace(/\\["\\\/bfnrtu]/g, '@')
                        .replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']')
                        .replace(/(?:^|:|,)(?:\s*\[)+/g, ''))) {
                        const newMessage = JSON.parse(message)
                        if (newMessage.title == 'authentication') {
                            ws.id = newMessage.id;
                            if (newMessage.id == 'app') {
                                const esp = await Esp.findOne({})
                                websocketServer.sendToApp({esp})
                                const farm = await Farm.find({})
                                websocketServer.sendToApp({farm})
                                const robot = await Robot.findOne({})
                                websocketServer.sendToApp({robot})
                            }
                        } else if (ws.id == 'app') {
                            if (newMessage.title == 'page-data-request') {
                                if (newMessage.page == 'Главная') {
                                    const esp = await Esp.findOne({})
                                    websocketServer.sendToApp({esp})
                                }
                                if (newMessage.page == 'Робот') {
                                    const robot = await Robot.findOne({})
                                    websocketServer.sendToApp({robot})
                                }
                            }
                            if (newMessage.title == 'data-from-app-to-esp') {
                                if (newMessage.climate) {
                                    Esp.findOneAndUpdate({}, {climate: newMessage.climate}, {new: true}, (err, doc) => {
                                        console.log(`Данные датчиков климата изменены ${doc}`)
                                    })
                                }
                                if (newMessage.doorControl) {
                                    Esp.findOneAndUpdate({}, {doorControl: newMessage.doorControl}, {new: true}, (err, doc) => {
                                        console.log(`Данные датчиков двери изменены ${doc}`)
                                    })
                                }
                                if (newMessage.lightButtons) {
                                    Esp.findOneAndUpdate({}, {lightButtons: newMessage.lightButtons}, {new: true}, (err, doc) => {
                                        console.log(`Данные датчиков света изменены ${doc}`)
                                    })
                                }
                                const data = await Esp.findOne({})
                                websocketServer.sendToEsp(data)
                                console.log(`Отправлены данные на esp ${data}`)
                            }
                            if (newMessage.title == 'data-from-app-to-robot') {
                                Robot.findOneAndUpdate({}, {target: newMessage.target}, {new: true}, (err, doc) => {
                                    console.log(`Данные робота изменены ${doc}`)
                                })
                                websocketServer.sendToRobot({target: newMessage.target})
                            }
                        } else if (ws.id == 'esp') {

                        } else if (ws.id == 'farm') {

                        } else if (ws.id == 'robot') {

                        } else {
                            ws.send(JSON.stringify({title: 'error', message: 'Пошел в лес, ты не авторизован'}))
                            console.error(`Неавторизованный пользователь пошел в лес и прислал данные ${newMessage}`)
                        }
                    } else {
                        console.log(`Получены данные не в JSON формате ${message.toString()}`)
                        ws.send(JSON.stringify({title: 'error', message: 'Никита просит перевести формат в JSON'}))
                    }

                } catch(error) {
                    console.log(`Ошибка при получении данных ${error.message}`)
                    ws.send(JSON.stringify({title: 'error', message: `Ошибка при получении данных ${error.message}`}))
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

    sendToApp(message) {
        this.chanel.clients.forEach(client => {
            if (client.id === 'app') {
                client.send(JSON.stringify(message))
            }
        })
    },

    sendToEsp(message) {
        this.chanel.clients.forEach(client => {
            if (client.id === 'esp') {
                client.send(JSON.stringify(message))
            }
        })
    },

    sendToRobot(message) {
        this.chanel.clients.forEach(client => {
            if (client.id === 'robot') {
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
