const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    bookedBy: {
        type: mongoose.Types.ObjectId,
        ref: "user",
        required: true
    },
    itemBooked: {
        type: mongoose.Types.ObjectId,
        ref: "dress",
        required: true
    },
    Size: {
        type: String,
    },
    Name:{
        type:String,
        required:true
    },
    bookingDate: {
        type: Date,
        default: new Date()
    },
    price: {
        type: Number,
        required: true
    },
    delivery: {
        type: Boolean,
        default: false
    },
    deliveredDate: {
        type: Date,
        default: null
    }
}, {
    timestamps: true
});

const Booking = mongoose.model('booking', schema);
module.exports = Booking;
