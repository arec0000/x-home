const mongoose = require('mongoose')

const Esp = new mongoose.Schema({
    climate: {
        sensTemp: {type: Number, required: true},
        sensWet: {type: Number, required: true},
        wishTemp: {type: Number, required: true},
        wishWet: {type: Number, required: true}
    },

    doorControl: {type: Boolean, required: true},

    lightButtons: [
        new mongoose.Schema({
            name: {type: String, required: true},
            shine: {type: Boolean, required: true},
            id: {type: Number, required: true}
        })
    ]
})

module.exports = mongoose.model('esp', Esp)
