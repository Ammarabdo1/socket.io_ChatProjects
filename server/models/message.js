const mongoose = require('mongoose')

const ModelSchema = mongoose.Schema({
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },

    receiver: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },

    content: {
        type: String,
        required: true,
    },

    seen: {
        type: Boolean,
        default: false,
    },

    date: {
        type: Date,
        default: Date.now,
    }
})

const Model = mongoose.model(ModelSchema)

module.exports = Model;