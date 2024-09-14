const mongoose = require('mongoose')
const schema = mongoose.Schema({
    Type: {
        type: String,
        unique: true,
        required: true
    },
    Category: {
        type: String,
        required: true
    },
    Pics: {
        type: Array,
        required: true 
    }
})

const ITEM= mongoose.model('category', schema)
module.exports = ITEM