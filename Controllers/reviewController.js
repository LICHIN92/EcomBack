const Booking = require("../Models/booking");
const Review = require("../Models/review");
const { patch } = require("../Routes/reviewRouter");


const review = async (req, res) => {
    console.log(req.params);
    console.log(req.userId);
    console.log(req.body);
    const { review, rating, bookingId } = req.body
    const product_id = req.params.id

    try {
        const data = new Review({
            product: product_id,
            user: req.userId,
            booking: bookingId,
            review: review,
            starRating: rating
        })
        await data.save()
        const update = await Booking.findByIdAndUpdate(bookingId, { review: true }, { new: true })
        return res.status(200).json('Your valuable review is saved')

    } catch (error) {
        console.log(error);
        return res.status(500).json('internal server error')
    }
}

const getReview = async (req, res) => {
    const id = req.params.id
    console.log('review');

    console.log(id);

    try {
        const data = await Review.find({ product: id })
            .populate({ path: "user", select: ['FirstName', "LastName"] })
        console.log(data);
        return res.status(200).json(data)
    } catch (error) {
        console.log(error);
        return res.status(500).json('internal server error')

    }
}
module.exports = { review, getReview }         