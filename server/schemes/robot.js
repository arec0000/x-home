import mongoose from 'mongoose'

const Robot = mongoose.Schema({
    state: {type: Boolean, required: true},
    current: {type: Number, required: true},
    target: {type: Number, required: true}
})

export default mongoose.model('Robot', Robot)
