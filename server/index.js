const express = require('express');
const mongoose = require('mongoose');
const websocketServer = require('./websocketServer')

mongoose.connect('mongodb://localhost:27017/x-home', {useNewUrlParser: true, useUnifiedTopology: true})

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

try {
    websocketServer.start()
}   catch(error) {
    console.log(`Ошибка при запуске websocket сервера ${error.message}`)
}
