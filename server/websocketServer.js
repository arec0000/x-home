import { WebSocketServer as wss } from 'ws'
import { spawn } from 'child_process'
import Jimp from 'jimp'

import Esp from './schemes/esp.js'
import Farm from './schemes/farm.js'
import Robot from './schemes/robot.js'
import ConnectedStatus from './schemes/connected.js'

class WebsocketServer {
    start() {
        //создаём сервер из пакета ws
        this.chanel = new wss({port: 5000}, () => console.log('Websocket сервер запущен на порту 5000'))

        this.initDatabase().then(() => {

            this.chanel.on('connection', (ws) => {
                console.log(`Пользователь подключился, всего ${this.chanel.clients.size} пользователей`)
                ws.isAlive = true
                ws.on('message', (message) => {
                    try {
                        if (/^[\],:{}\s]*$/.test(message.toString()
                            .replace(/\\["\\\/bfnrtu]/g, '@')
                            .replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']')
                            .replace(/(?:^|:|,)(?:\s*\[)+/g, ''))) {
                            //
                            console.log(`Получены данные ${message.toString()}`)
                            //
                            const newMessage = JSON.parse(message)
                            if (newMessage.title == 'authentication') {
                                this.authenticate(newMessage.id, ws)
                            } else {
                                this.receiveData(newMessage, ws)
                            }
                        } else {
                            console.error(`Получены данные не в JSON формате ${message.toString()}`)
                            ws.send(JSON.stringify({title: 'error', message: 'Никита просит перевести формат в JSON'}))
                        }
                    } catch(error) {
                        console.error(`Ошибка при получении данных ${error.message}`)
                        ws.send(JSON.stringify({title: 'error', message: `Ошибка при получении данных ${error.message}`}))
                    }
                })

                ws.on('pong', () =>  ws.isAlive = true)

                ws.on('close', () => {
                    console.log(`Пользователь отключился, всего ${this.chanel.clients.size} пользователей`)
                    if (ws.id !== 'app') {
                        ConnectedStatus.findOneAndUpdate({}, {[ws.id]: false}, {new: true},
                            (err, connectedStatus) => this.sendById('app', {connectedStatus}))
                    }
                })

                ws.on('error', () => {
                    console.error(`Ошибка ${error.message}`)
                })
            })

            const closeFallenConections = setInterval(() => {
                this.chanel.clients.forEach(client => {
                    if (!client.isAlive) {
                        client.terminate()
                        console.log('Связь с пользователем разорвана')
                    } else {
                        client.isAlive = false
                        client.ping()
                    }
                })
            }, 3000)

            this.chanel.on('close', () => {
                clearInterval(closeFallenConections)
                console.log('Сервер отключен')
            })

            this.chanel.on('error', () => {
                console.error(`Ошибка ${error.message}`)
            })
        })
    }

    async authenticate(id, client) {
        client.id = id
        if (id == 'app') {
            const esp = await Esp.findOne({})
            const farm = await Farm.find({})
            const robot = await Robot.findOne({})
            const connectedStatus = await ConnectedStatus.findOne({})
            client.send(JSON.stringify({connectedStatus, esp, farm, robot}))
            console.log('Приложение подключено')
        } else {
            ConnectedStatus.findOneAndUpdate({}, {[id]: true}, {new: true},
                (err, connectedStatus) => this.sendById('app', {connectedStatus}))
        }
        if (id == 'esp') {
            const esp = await Esp.findOne({})
            client.send(JSON.stringify(esp))
            console.log('esp подключено')
        }
        if (id == 'robot') {
            Robot.findOneAndUpdate({}, {state: false, current: 1, target: 1}, {new: true}, (err, doc) =>
                console.log(`Робот подключен, данные изменены на дефолтные ${doc}`)
            )
        }
    }

    async receiveData(newMessage, client) {
        if (client.id == 'app') {
            if (newMessage.title == 'page-data-request') {
                if (newMessage.page == 'Главная') {
                    const esp = await Esp.findOne({})
                    client.send(JSON.stringify({esp}))
                }
                if (newMessage.page == 'Робот') {
                    const robot = await Robot.findOne({})
                    client.send(JSON.stringify({robot}))
                }
            }
            if (newMessage.title == 'data-from-app-to-esp') {
                new Promise(resolve => {
                    if (newMessage.climate) {
                        Esp.findOneAndUpdate({}, {climate: newMessage.climate}, {new: true}, (err, doc) => {
                            resolve()
                            console.log(`Данные датчиков климата изменены ${doc}`)
                        })
                    }
                    if (newMessage.doorControl !== undefined) {
                        Esp.findOneAndUpdate({}, {doorControl: newMessage.doorControl}, {new: true}, (err, doc) => {
                            resolve()
                            console.log(`Данные датчиков двери изменены ${doc}`)
                        })
                    }
                    if (newMessage.lightButtons) {
                        Esp.findOneAndUpdate({}, {lightButtons: newMessage.lightButtons}, {new: true}, (err, doc) => {
                            resolve()
                            console.log(`Данные датчиков света изменены ${doc}`)
                        })
                    }
                }).then(async () => {
                    const esp = await Esp.findOne({})
                    this.sendById('esp', esp)
                    console.log(`Отправлены данные на esp ${esp}`)
                })
            }
            if (newMessage.title == 'data-from-app-to-robot') {
                Robot.findOneAndUpdate({}, {target: newMessage.target}, {new: true}, (err, doc) => {
                    console.log(`Данные робота изменены ${doc}`)
                })
                this.sendById('robot', {target: newMessage.target})
            }
        } else if (client.id == 'esp') {
            if (newMessage.title == 'data-from-esp-to-app') {
                Esp.findOneAndUpdate({}, newMessage.data, {new: true}, (err, esp) => {
                    this.sendById('app', {esp})
                    console.log(`Полученны данные от esp ${JSON.stringify(newMessage)}`)
                })
            }
            if (newMessage.title == 'data-from-esp-to-cv') {
                Jimp.read(newMessage.data).then(image => {
                    image.write('image.png')
                    const cv = spawn('python', ['cv.py'])
                    cv.stdout.on('data', (data) => {
                        console.log(`Данные из python ${data}`)
                        if (data == 'recognized') {
                            Esp.findOneAndUpdate({}, {doorControl: false}, {new: true}, (err, esp) => {
                                this.sendById('esp', esp)
                                this.sendById('app', {esp})
                                console.log('Ваше лицо распознано')
                            })
                        } else {
                            console.log('Ваше лицо не распознано')
                        }
                    })

                })
            }
        } else if (client.id == 'greenhouse') {
            Promise.all(
                newMessage.data.map(item =>
                    new Promise(resolve => Farm.findOneAndUpdate({id: item.id}, item, () => resolve()))
                )
            ).then(async () => {
                const farm = await Farm.find({})
                this.sendById('app', {farm})
                console.log(`Полученны данные от теплицы ${newMessage}`)
            })
        } else if (client.id == 'robot') {
            Robot.findOneAndUpdate({}, newMessage, {new: true}, (err, robot) => {
                this.sendById('app', {robot})
                console.log(`Полученны данные от робота ${newMessage}`)
            })
        } else {
            client.send(JSON.stringify({title: 'error', message: 'Пошел в лес, ты не авторизован'}))
            console.log(`Неавторизованный пользователь пошел в лес и прислал данные ${newMessage}`)
        }
    }

    sendById(id, message) {
        this.chanel.clients.forEach(client => {
            if (client.id == id) {
                client.send(JSON.stringify(message))
            }
        })
    }

    initDatabase() {
        return Promise.all([
            new Promise(resolve =>
                ConnectedStatus.findOne({}, (err, doc) => {
                    if (!doc) {
                        ConnectedStatus.create({
                            esp: false,
                            greenhouse: false,
                            robot: false
                        }, () => {
                            resolve()
                            console.log('Созданы дефолтные данные соединения, по приказу Никиты')
                        })
                    } else {
                        ConnectedStatus.findOneAndUpdate({}, {
                            esp: false,
                            greenhouse: false,
                            robot: false
                        }, (err, doc) => {
                            resolve()
                            console.log(doc)
                        })
                    }
                })
            ),
            new Promise(resolve =>
                Esp.findOne({}, (err, doc) => {
                    if (!doc) {
                        Esp.create({
                            climate: {sensTemp: 0, sensWet: 0, wishTemp: 0, wishWet: 0},
                            doorControl: false,
                            lightButtons: [
                                {name: 'спальня', shine: false, id: 1},
                                {name: 'кухня', shine: false, id: 2},
                                {name: 'гостинная', shine: false, id: 3},
                                {name: 'территория', shine: false, id: 4},
                                {name: 'гараж', shine: false, id: 5}
                            ]
                        }, () => {
                            resolve()
                            console.log('Созданы дефолтные данные esp, по приказу Никиты')
                        })
                    } else {
                        resolve()
                        console.log(doc)
                    }
                })
            ),
            new Promise(resolve =>
                Farm.find({}, (err, docs) => {
                    if (!docs[0]) {
                        Farm.create([
                            {id: 2, temp: 0, humidity: 0},
                            {id: 1, temp: 0, humidity: 0}
                        ], (err, doc) => {
                            resolve()
                            console.log('Созданы 2 дефолтные секции фермы, по приказу Никиты')
                        })
                    } else {
                        resolve()
                        console.log(docs)
                    }
                })
            ),
            new Promise(resolve =>
                Robot.findOne({}, (err, doc) => {
                    if (!doc) {
                        Robot.create({state: false, current: 1, target: 1}, (err, doc) => {
                            resolve()
                            console.log('Создан дефолтный объект робота, по приказу Никиты')
                        })
                    } else {
                        resolve()
                        console.log(doc)
                    }
                })
            )
        ])
    }
}

export default new WebsocketServer()
