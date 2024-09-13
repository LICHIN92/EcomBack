const express = require('express')
const { booking,bookingDetails,update,myBook,deleteCancel } = require('../Controllers/bookingControler')
const { userAuth } = require('../middleware/authorization')
const bookRouter = express.Router()

bookRouter.post('/:id',userAuth, booking)
bookRouter.get('/bookings',bookingDetails)
bookRouter.put('/:id',update)
bookRouter.get('/user/:id',myBook)
bookRouter.delete('/:id',deleteCancel)

module.exports = { bookRouter }