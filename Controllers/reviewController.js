const { default: mongoose } = require("mongoose");
const Booking = require("../Models/booking");
const Review = require("../Models/review");


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
        // console.log(data);

        return res.status(200).json(data)
    } catch (error) {
        console.log(error);
        return res.status(500).json('internal server error')

    }
}

const average = async (req, res) => {
    console.log(req.params.id);
    console.log('dsafsgvdgsgsgsggtrit');
    try {
        const productId = new mongoose.Types.ObjectId(req.params.id);
        const average = await Review.aggregate([
            {
                $match: {
                    product: productId
                }  // Match reviews for the specific product
            },
            {
                $group: {
                    _id: null,  // Group all matching documents together
                    averageRating: { $avg: "$starRating" }  // Calculate the average of the 'starRating' field
                }
            }
        ]);
        console.log(average);
        let averageRating = average.length > 0 ? average[0].averageRating : 0;
        console.log(averageRating);

        averageRating = averageRating.toFixed(1)
        console.log(averageRating);



        res.status(200).json({ success: true, averageRating });
    } catch (error) {
        console.error('Error calculating average rating:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to calculate average rating',
            error: error.message
        });
    }

}

module.exports = { review, getReview, average }          