import express from 'express'
import mongoose from 'mongoose'
import websocketServer from './websocketServer.js'
import { dirname } from 'path'
import { fileURLToPath } from 'url'

mongoose.connect('mongodb://81.163.29.85:27017/x-home', {useNewUrlParser: true, useUnifiedTopology: true})

const fast = express()
const _dir = dirname(fileURLToPath(import.meta.url))

fast.listen(3000, (error) => {
    error ? console.log(error) : console.log(`Сервер запущен на 3000 порту`)
})

fast.use(express.static('build'))
//отслеживание гет запросов по этому роуту
fast.get('/', (req, res) => {
    res.sendFile(_dir + '/build/index.html')
})

fast.get('/greenhouse-outside', (req, res) => {
    res.sendFile(_dir + '/build/index.html')
})

fast.get('/greenhouse-inside', (req, res) => {
    res.sendFile(_dir + '/build/index.html')
})

fast.get('/robot-control', (req, res) => {
    res.sendFile(_dir + '/build/index.html')
})

try {
    websocketServer.start()
}   catch(error) {
    console.error(`Ошибка при запуске websocket сервера ${error.message}`)
}
