const express = require('express')
const { booking, bookingDetails, update, myBook, deleteCancel, returnOrNot, returnRequest, buyBack, order,verify } = require('../Controllers/bookingControler')
const { userAuth, adminAuth } = require('../middleware/authorization')
const bookRouter = express.Router()

bookRouter.post('/:id', userAuth, booking)
bookRouter.get('/bookings', bookingDetails)
bookRouter.put('/:id', update)
bookRouter.get('/user/:id', myBook)
bookRouter.delete('/:id', deleteCancel)
bookRouter.put('/return/:id', returnOrNot)
bookRouter.get('/return', adminAuth, returnRequest)
bookRouter.put('/update/:id', adminAuth, buyBack)
bookRouter.post('/orderr/:id', userAuth, order)
bookRouter.post('/verify',userAuth,verify)

module.exports = { bookRouter }    