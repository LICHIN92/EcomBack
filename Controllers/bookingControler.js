const Booking = require("../Models/booking");
const Dress = require("../Models/dress");
const USER = require("../Models/userModel");

const booking = async (req, res) => {
    console.log(req.body)
    console.log(req.params.id);
    const id = req.params.id
    console.log(req.userId);
    const user = req.userId

    const { price, size, Name } = req.body

    try {
        if (typeof size == 'undefined' || size == null || size == '') {
            console.log(size !== null);
            const data = await new Booking({ price: price, Name: Name, bookedBy: user, itemBooked: id }).save()
            // await data.save()
            const update = await Dress.findByIdAndUpdate(id, { $inc: { Quantity: -1 } }, { new: true })
            console.log(update);

        } else {
            console.log(size); 

            const data = new Booking({ Size: size, Name: Name, price: price, bookedBy: user, itemBooked: id })
            await data.save()
            const update = await Dress.findByIdAndUpdate(id, { $inc: { Quantity: -1 }, $pull: { Size: size } }, { new: true })
            console.log(update);
            console.log('with size');

        }
        return res.status(200).json('Booking is Registered /n Thank you')

    } catch (error) {
        console.log(error);

    }

}

// const bookingDetails=async(req,res)=>{
//     console.log('bookimf');
    
//     try { 
         
//         const data = await Booking.find()
//                console.log(data);
        

//     } catch (error) {
        
//     }

// }

const bookingDetails = async (req, res) => {
    console.log('Fetching booking details...');
    
    try {
        // Fetch booking details and populate the 'bookedBy' and 'itemBooked' fields
        const data = await Booking.find()
            .populate({ path: 'bookedBy', select: ['FirstName', 'LastName','Mobile',"AddressLine1",'AddressLine2','AddressLine3','PIN'] }) // Include relevant fields from the user
            .populate({ path: 'itemBooked', select: ['Name', 'Type', 'Price','Pics'] }); // Include relevant fields from the item
        
        if (!data || data.length === 0) {
            return res.status(404).json({ message: 'No booking data found' });
        }
        
        console.log('Booking data:', data);
        res.status(200).json({ data});

    } catch (error) {
        console.error('Error fetching booking details:', error.message);
        res.status(500).json({ message: 'Server error while fetching booking details', error: error.message });
    }
};
const update=async(req,res)=>{
    console.log(req.params.id);
    const id=req.params.id
    try {
        // const update=await Booking.findByIdAndUpdate(id,({delivery:true,deliveredDate:Date.now()},{rertun:true}))
        const updatedBooking = await Booking.findByIdAndUpdate(
            id,
            {
                delivery: true,
                deliveredDate: Date.now() // Use current timestamp
            },
            { new: true } // Option to return the updated document
        );
        console.log(updatedBooking);
        return res.status(200).json('ok')
        
    } catch (error) {  
       console.log(error);
       return res.status(500).json('internal server error')
        
    }
    
}

module.exports = { booking,bookingDetails,update }    