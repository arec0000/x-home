const mongoose = require('mongoose')

const Farm = new mongoose.Schema({
    temp: {type: Number, required: true},
    humidity: {type: Number, required: true}
})

module.exports = mongoose.model('farm', Farm)
