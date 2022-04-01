const mongoose = require('mongoose')

const ConnectedStatus = mongoose.Schema({
    esp: {type: Boolean, require: true},
    greenhouse: {type: Boolean, require: true},
    robot: {type: Boolean, require: true}
})

module.exports = mongoose.model('connectedStatus', ConnectedStatus)
