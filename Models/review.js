const { default: mongoose } = require("mongoose")


const schema = new mongoose.Schema({
    user: {
        type: mongoose.Types.ObjectId,
        ref: "user",
        required: true
    },
    product: {
        type: mongoose.Types.ObjectId,
        ref: "dress",
        required: true
    },
    booking: {
        type: mongoose.Types.ObjectId,
        ref: "booking",
        required: true
    },
    review: {
        type: String,
        required: true
    },
    starRating: {
        type: Number,
        required: true
    }
})
const Review = mongoose.model('reviews', schema)
module.exports = Review

