const mongoose = require('mongoose')
const schema = mongoose.Schema({
    Type: {
        type: String,
        required: true,
        ref: 'category'
    },
    Category: {
        type: String,
        required: true,
        ref: 'category'
    },
    Name: {
        type: String,
        required: true
    },
    Price: {
        type: Number,
        required: true
    },
    Fabric: {
        type: String,
        required: true,
    },
    Size: {
        type: Array
    },
    Quantity: {
        type: Number,
        required: true,
    },
    Pics: {
        type: Array,
        required: true
    }
},
{
    timestamps: true // Corrected: should be "timestamps" instead of "timestamp"
});

const Dress = mongoose.model("dress", schema);
module.exports = Dress;
