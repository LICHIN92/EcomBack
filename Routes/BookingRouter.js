const express = require('express')
const { booking,bookingDetails } = require('../Controllers/bookingControler')
const { userAuth } = require('../middleware/authorization')
const bookRouter = express.Router()

bookRouter.post('/:id',userAuth, booking)
bookRouter.get('/',bookingDetails)

module.exports = { bookRouter }