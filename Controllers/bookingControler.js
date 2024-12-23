const Razorpay = require("razorpay");
const Booking = require("../Models/booking");
const Dress = require("../Models/dress");
const USER = require("../Models/userModel");

const booking = async (req, res) => {
    console.log('booking');

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
        return res.status(200).json('Booking is Registered \nThank you')

    } catch (error) {
        console.log(error);

    }

}

const bookingDetails = async (req, res) => {
    console.log('Fetching booking details...');

    try {
        // Fetch booking details and populate the 'bookedBy' and 'itemBooked' fields
        const data = await Booking.find()
            .populate({ path: 'bookedBy', select: ['FirstName', 'LastName', 'Mobile', "AddressLine1", 'AddressLine2', 'AddressLine3', 'PIN'] }) // Include relevant fields from the user
            .populate({ path: 'itemBooked', select: ['Name', 'Type', 'Price', 'Pics'] }); // Include relevant fields from the item

        if (!data || data.length === 0) {
            return res.status(404).json({ message: 'No booking data found' });
        }

        console.log('Booking data:', data);
        res.status(200).json({ data });

    } catch (error) {
        console.error('Error fetching booking details:', error.message);
        res.status(500).json({ message: 'Server error while fetching booking details', error: error.message });
    }
};

const update = async (req, res) => {
    console.log(req.params.id);
    const id = req.params.id
    try {
        // Set the current date and time
        const deliveredDate = new Date();  // Create a Date object from the current timestamp

        // Calculate return date as 2 days after the delivered date
        const returnDate = new Date(deliveredDate);  // Copy deliveredDate
        console.log(returnDate);

        returnDate.setDate(returnDate.getDate() + 2);  // Add 2 days to the deliveredDate
        console.log(returnDate);

        // const update=await Booking.findByIdAndUpdate(id,({delivery:true,deliveredDate:Date.now()},{rertun:true}))
        const updatedBooking = await Booking.findByIdAndUpdate(
            id,
            {
                delivery: true,
                deliveredDate: deliveredDate,
                returnDate: returnDate
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

const myBook = async (req, res) => {
    const id = req.params.id
    console.log(id);

    try {
        const data = await Booking.find({ bookedBy: id }).populate({ path: 'itemBooked', select: ['Name', 'Type', 'Price', 'Pics'] });
        console.log('my booking', data);
        return res.status(200).json(data)

    } catch (error) {
        console.log(data)
        return res.status(500).json('internal server error')

    }
}


const deleteCancel = async (req, res) => {
    const id = req.params.id; // Booking ID

    try {
        // Find the booking by its ID
        const bookingData = await Booking.findByIdAndDelete(id);
        console.log(bookingData);

        if (bookingData) {
            const itemId = bookingData.itemBooked; // Extract item ID from booking data

            // Assuming you don't have a size attribute; adjust accordingly
            if(bookingData.Size){
                console.log(bookingData.Size);
                const update = await Dress.findByIdAndUpdate(
                    itemId,
                    {
                        $inc: { Quantity: 1 } ,// Increment the Quantity
                        // Remove size from here if it's not applicable
                        $push: { Size: bookingData.Size } 
                    },
                    { new: true } // Returns the updated document
                );
     
                console.log(update);
                res.status(200).json({ message: 'Booking cancelled and item updated successfully.', update });
            }else{
                const update = await Dress.findByIdAndUpdate(
                    itemId,
                    { 
                        $inc: { Quantity: 1 } // Increment the Quantity
                        // Remove size from here if it's not applicable
                    },
                    { new: true } // Returns the updated document
                );
     
                console.log(update);
                res.status(200).json({ message: 'Booking cancelled and item updated successfully.', update });
            }
           
        } else {
            res.status(404).json({ message: 'Booking not found.' });
        }

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'An error occurred while processing your request.', error });
    }
};

const returnOrNot = async (req, res) => {
    console.log(req.params.id);
    const id = req.params.id

    try {
        const booking = await Booking.findById(id); // Find the booking by ID first

        const updatedBooking = await Booking.findByIdAndUpdate(
            id,
            {
                return: !booking.return, // Toggle the current value of 'return'
                deliveredDate: Date.now() // Update the 'deliveredDate'
            },
            { new: true } // Return the updated document
        );

        console.log(updatedBooking);
        // return res.status(200).json('')
    } catch (error) {
        console.error('Error updating booking:', error);
    }

}

const returnRequest = async (req, res) => {
    try {
        const data = await Booking.find({ return: true, returned: false })
            .populate({ path: 'bookedBy', select: ['FirstName', 'LastName', 'Mobile', "AddressLine1", 'AddressLine2', 'AddressLine3', 'PIN'] })
            .populate({ path: 'itemBooked', select: ['Name', 'Type', 'Price', 'Pics'] })
        console.log(data);
        return res.status(200).json(data)
    } catch (error) {
        // console.log(error); 
        res.status(500).json({ data: "internal server error" }) 
    }
}

const buyBack = async (req, res) => {
    console.log(req.params.id);
    const id = req.params.id

    try {
        const result = await Booking.findByIdAndUpdate(id,{returned:true},{new:true})
        console.log(result);
        return res.status(200).json('updated')
    } catch (error) {
console.log(error); 

    }
}

const order=async(req,res,next)=>{
    console.log('order controller');
    console.log("req.body",req.body);
    const id = req.params.id
    console.log(id);
    
    console.log(req.userId);
    const user = req.userId
    const { price, size, Name,itemBooked } = req.body
    let ids=null
    
    try {
        
        const instance = new Razorpay({
            key_id: process.env.RP_KEY_ID,
            key_secret: process.env.RP_SECRET_KEY,
        });
        if (typeof size == 'undefined' || size == null || size == '') {
            console.log('without size ');
            
            console.log(size !== null);
            const data = await new Booking({ price: price, Name: Name, bookedBy: user, itemBooked: id }).save()
            await data.save()
            console.log('data',data);
            console.log("data._id",data._id);

            console.log(data._id.toString()); 
             
            ids=data._id.toString()
            const update = await Dress.findByIdAndUpdate(id, { $inc: { Quantity: -1 } }, { new: true })
            console.log(update); 

        } else {
            console.log(size);  

            const data = new Booking({ Size: size, Name: Name, price: price, bookedBy: user, itemBooked: id })
            await data.save()
            // console.log(data._id);
            
            ids=data._id.toString()

            const update = await Dress.findByIdAndUpdate(id, { $inc: { Quantity: -1 }, $pull: { Size: size } }, { new: true })
            console.log(update);
            console.log('with size');

        }
        const options={
            amount:price*100,
            currency:"INR",
            receipt:ids,
            // itemBooked:id
        }
        const order=await instance.orders.create(options)
        console.log("order",order);
        
        if(!order){
            return res.status(500).send("Some error occurred");

        }
       return res.status(200).json(order);

    } catch (error) {
        console.log('error lichin');
        
        console.log(error); 
         next()
    }
}

const verify =async(req,res)=>{
    console.log(req.body);
    console.log("lichin");
    console.log("verify");

    
    try {
        
    } catch (error) {
        console.log(error);
         
    }
}


// const order = async (req, res) => {
//     console.log("Order initiated");
//     console.log(req.body);

//     const id = req.params.id;
//     const user = req.userId;
//     const { price, size, Name } = req.body;
//     let bookingId = null;
//     let itemBooked=null

//     try {
//         const instance = new Razorpay({
//             key_id: process.env.RP_KEY_ID,
//             key_secret: process.env.RP_SECRET_KEY,
//         });

//         if (!size) {
//             // Booking without size selection
//             const data = await new Booking({ price, Name, bookedBy: user, itemBooked: id }).save();
//             console.log('ok ');
            
//             bookingId = data._id.toString();
// i
//             await Dress.findByIdAndUpdate(id, { $inc: { Quantity: -1 } }, { new: true });
//             console.log("Data saved without size", data);
//         } else {
//             // Booking with size selection
//             const data = await new Booking({ Size: size, Name, price, bookedBy: user, itemBooked: id }).save();
//             bookingId = data._id.toString();


//             await Dress.findByIdAndUpdate(id, { $inc: { Quantity: -1 }, $pull: { Size: size } }, { new: true });
//             console.log("Data saved with size", data);
//         }

//         const options = {
//             amount: price * 100, // Amount in paise
//             currency: "INR",
//             receipt: bookingId,
//         };

//         const order = await instance.orders.create(options);
//         console.log('order',order);
        
//         if (!order) {
//             return res.status(500).send("Some error occurred during order creation");
//         }

//         res.status(200).json(order);

//     } catch (error) {
//         console.error("Order Error:", error);
//         res.status(500).send("Internal Server Error");
//     }
// };

// // Verification function to validate Razorpay payment signature
// const verify = async (req, res) => {
//     console.log("Verification initiated");

//     try {
//         const { orderCreationId, razorpayPaymentId, razorpayOrderId, razorpaySignature, receipt } = req.body;

//         const shasum = crypto.createHmac("sha256", process.env.RP_SECRET_KEY);
//         shasum.update(orderCreationId + "|" + razorpayPaymentId);
//         const generatedSignature = shasum.digest("hex");

//         // Compare generated signature with Razorpay's signature
//         if (generatedSignature === razorpaySignature) {
//             // Update booking status to "Paid" in your database
//             await Booking.findByIdAndUpdate(receipt, { status: "Paid" }, { new: true });

//             res.status(200).json({ success: true, message: "Payment verification successful" });
//         } else {
//             res.status(400).json({ success: false, message: "Invalid payment signature" });
//         }
//     } catch (error) {
//         console.error("Verification Error:", error);
//         res.status(500).send("Verification failed");
//     }
// };

module.exports = { booking, bookingDetails, update, myBook, deleteCancel, returnOrNot, returnRequest, buyBack,order,verify  }   