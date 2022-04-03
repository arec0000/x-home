import mongoose from 'mongoose'

const Farm = new mongoose.Schema({
    id: {type: Number, required: true},
    temp: {type: Number, required: true},
    humidity: {type: Number, required: true}
})

export default mongoose.model('Farm', Farm)
