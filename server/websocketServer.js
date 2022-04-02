const ws = require('ws');
const mongoose = require('mongoose');
const {spawn} = require('child_process')
const Jimp = require('jimp')

const Esp = require('./schemes/esp')
const Farm = require('./schemes/farm')
const Robot = require('./schemes/robot')
const ConnectedStatus = require('./schemes/connected')

class WebsocketServer {
    start() {
        //создаём сервер из пакета ws
        this.chanel = new ws.Server({port: 5000}, () => console.log('Websocket сервер запущен на порту 5000'))
        this.initDatabase()
        this.chanel.on('connection', (ws) => {
            console.log(`Пользователь подключился, всего ${this.chanel.clients.size} пользователей`)
            ws.isAlive = true;
            ws.on('message', (message) => {
                try {
                    if (/^[\],:{}\s]*$/.test(message.toString()
                        .replace(/\\["\\\/bfnrtu]/g, '@')
                        .replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']')
                        .replace(/(?:^|:|,)(?:\s*\[)+/g, ''))) {
                        const newMessage = JSON.parse(message)
                        if (newMessage.title == 'authentication') {
                            this.authenticate(newMessage.id, ws)
                        } else {
                            this.receiveData(newMessage, ws)
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
                new Promise(resolve =>
                    ConnectedStatus.findOneAndUpdate({}, {[ws.id]: false}, () => resolve())
                ).then(async () => {
                    const connectedStatus = await ConnectedStatus.findOne({})
                    this.sendById('app', {connectedStatus})
                })
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
        }, 3000)

        this.chanel.on('close', () => {
            clearInterval(closeFallenConections)
            console.log('Сервер отключен')
        })

        this.chanel.on('error', () => {
            console.log(`Ошибка ${error.message}`)
        })
    }

    async authenticate(id, client) {
        client.id = id;
        new Promise(resolve =>
            ConnectedStatus.findOneAndUpdate({}, {[id]: true}, () => resolve())
        ).then(async () => {
            const connectedStatus = await ConnectedStatus.findOne({})
            this.sendById('app', {connectedStatus})
        })
        if (id == 'app') {
            const esp = await Esp.findOne({})
            const farm = await Farm.find({})
            const robot = await Robot.findOne({})
            client.send(JSON.stringify({esp, farm, robot}))
            console.log('Приложение подключено')
        }
        if (id == 'esp') {
            const esp = await Esp.findOne({})
            client.send(JSON.stringify(esp))
            console.log('esp подключено')
        }
        if (id == 'robot') {
            Robot.findOneAndUpdate({}, {state: false, current: 1, target: 1}, {new: true}, (err, doc) => {
                console.log(`Робот подключен, данные изменены на дефолтные ${doc}`)
            })
        }
    }

    async receiveData(newMessage, client) {
        if (client.id == 'app') {
            if (newMessage.title == 'page-data-request') {
                if (newMessage.page == 'Главная') {
                    const esp = await Esp.findOne({})
                    this.sendById('app', {esp})
                }
                if (newMessage.page == 'Робот') {
                    const robot = await Robot.findOne({})
                    this.sendById('app', {robot})
                }
            }
            if (newMessage.title == 'data-from-app-to-esp') {
                if (newMessage.climate) {
                    new Promise(resolve => {
                        Esp.findOneAndUpdate({}, {climate: newMessage.climate}, {new: true}, (err, doc) => {
                            resolve()
                            console.log(`Данные датчиков климата изменены ${doc}`)
                        })
                    }).then(async () => {
                        const esp = await Esp.findOne({})
                        this.sendById('esp', esp)
                        console.log(`Отправлены данные на esp, изменён климат ${esp}`)
                    })
                }
                if (newMessage.doorControl !== undefined) {
                    new Promise(resolve => {
                        Esp.findOneAndUpdate({}, {doorControl: newMessage.doorControl}, {new: true}, (err, doc) => {
                            resolve()
                            console.log(`Данные датчиков двери изменены ${doc}`)
                        })
                    }).then(async () => {
                        const esp = await Esp.findOne({})
                        this.sendById('esp', esp)
                        console.log(`Отправлены данные на esp, изменёно состояние двери ${esp}`)
                    })
                }
                if (newMessage.lightButtons) {
                    new Promise(resolve => {
                        Esp.findOneAndUpdate({}, {lightButtons: newMessage.lightButtons}, {new: true}, (err, doc) => {
                            resolve()
                            console.log(`Данные датчиков света изменены ${doc}`)
                        })
                    }).then(async () => {
                        const esp = await Esp.findOne({})
                        this.sendById('esp', esp)
                        console.log(`Отправлены данные на esp, изменён свет ${esp}`)
                    })
                }
            }
            if (newMessage.title == 'data-from-app-to-robot') {
                Robot.findOneAndUpdate({}, {target: newMessage.target}, {new: true}, (err, doc) => {
                    console.log(`Данные робота изменены ${doc}`)
                })
                this.sendById('robot', {target: newMessage.target})
            }
        } else if (client.id == 'esp') {
            if (newMessage.title == 'data-from-esp-to-app') {
                Esp.findOneAndUpdate({}, newMessage.data, {new: true}, (err, doc) => {
                    this.sendById('app', {esp: doc})
                    console.log(`Полученны данные от esp ${newMessage}`)
                })
            }
            if (newMessage.title == 'data-from-esp-to-cv') {
                Jimp.read(newMessage.data).then(image => {
                    image.write('image.png')
                    const cv = spawn('python', ['cv.py'])
                    cv.stdout.on('data', (data) => {
                        console.log(`Данные из python ${data}`)
                        if (data == 'recognized') {
                            Esp.findOneAndUpdate({}, {doorControl: false}, {new: true}, (err, doc) => {
                                this.sendById('esp', doc)
                                this.sendById('app', {esp: doc})
                                console.log('Ваше лицо распознано')
                            })
                        } else {
                            console.log('Ваше лицо не распознано')
                        }
                    })

                })
            }
        } else if (client.id == 'greenhouse') {
            newMessage.data.forEach(item => {
                Farm.findOneAndUpdate({id: item.id}, item)
            })
            this.sendById('app', {farm: newMessage.data})
            console.log(`Полученны данные от теплицы ${newMessage}`)
        } else if (client.id == 'robot') {
            Robot.findOneAndUpdate({}, newMessage, {new: true}, (err, doc) => {
                this.sendById('app', {robot: doc})
                console.log(`Полученны данные от робота ${newMessage}`)
            })
        } else {
            client.send(JSON.stringify({title: 'error', message: 'Пошел в лес, ты не авторизован'}))
            console.error(`Неавторизованный пользователь пошел в лес и прислал данные ${newMessage}`)
        }
    }

    sendById(id, message) {
        this.chanel.clients.forEach(client => {
            if (client.id == id) {
                client.send(JSON.stringify(message))
            }
        })
    }

    async initDatabase() {
        ConnectedStatus.findOne({}, (err, doc) => {
            if (!doc) {
                ConnectedStatus.create({
                    esp: false,
                    greenhouse: false,
                    robot: false
                })
                console.log('Созданы дефолтные данные соединения, по приказу Никиты')
            } else {
                console.log(doc)
            }
        })
        Esp.findOne({}, (err, doc) => {
            if (!doc) {
                Esp.create({
                    climate: {sensTemp: 30.3, sensWet: 40, wishTemp: 29, wishWet: 55},
                    doorControl: false,
                    lightButtons: [
                        {name: 'спальня', shine: false, id: 1},
                        {name: 'кухня', shine: false, id: 2},
                        {name: 'гостинная', shine: false, id: 3},
                        {name: 'территория', shine: false, id: 4},
                        {name: 'гараж', shine: false, id: 5}
                    ]
                })
                console.log('Созданы дефолтные данные esp, по приказу Никиты')
            } else {
                console.log(doc)
            }
        })
        Farm.find({}, (err, doc) => {
            if (!doc[0]) {
                Farm.create({id: 1, temp: 30, humidity: 40}, (err, doc) => {
                    console.log('Создана дефолтная секция фермы, по приказу Никиты')
                });
                Farm.create({id: 2, temp: 24, humidity: 74}, (err, doc) => {
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
}

module.exports = new WebsocketServer()

        // Farm.deleteOne({}, function(err, result) {

        // })
