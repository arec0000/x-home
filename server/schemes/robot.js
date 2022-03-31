const mongoose = require('mongoose');


const Robot = mongoose.Schema({
    state: {type: Boolean, required: true},
    current: {type: Number, required: true},
    target: {type: Number, required: true}
})

module.exports = mongoose.model('Robot', Robot)

