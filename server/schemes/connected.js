import mongoose from 'mongoose'

const ConnectedStatus = mongoose.Schema({
    esp: {type: Boolean, require: true},
    greenhouse: {type: Boolean, require: true},
    robot: {type: Boolean, require: true}
})

export default mongoose.model('ConnectedStatus', ConnectedStatus)
