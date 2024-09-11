const express= require('express')
const { login, signup, forgot, address } = require('../Controllers/userControllers')
const { userAuth } = require('../middleware/authorization')
const UserRouter=express.Router()

UserRouter.post('/',login)
UserRouter.post('/signup',signup)
UserRouter.post('/forgot',forgot)
UserRouter.post('/address',userAuth,address)


module.exports =UserRouter