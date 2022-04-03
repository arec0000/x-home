import express from 'express'
import mongoose from 'mongoose'
import websocketServer from './websocketServer.js'

mongoose.connect('mongodb://81.163.29.85:27017/x-home', {useNewUrlParser: true, useUnifiedTopology: true})

const fast = express()

fast.listen(3000, (error) => {
    error ? console.log(error) : console.log(`Сервер запущен на 3000 порту`)
})

fast.use(express.static('build'))
//отслеживание гет запросов по этому роуту
fast.get('/', (req, res) => {
    res.sendFile(__dirname + '/build/index.html')
});

try {
    websocketServer.start()
}   catch(error) {
    console.log(`Ошибка при запуске websocket сервера ${error.message}`)
}
