const express = require('express')
const { booking,bookingDetails,update } = require('../Controllers/bookingControler')
const { userAuth } = require('../middleware/authorization')
const bookRouter = express.Router()

bookRouter.post('/:id',userAuth, booking)
bookRouter.get('/',bookingDetails)
bookRouter.put('/:id',update)

module.exports = { bookRouter }