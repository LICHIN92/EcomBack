const express= require('express')
const { login, signup, forgot, address,getUser,getNumber, details, Userdetails } = require('../Controllers/userControllers')
const { userAuth, adminAuth } = require('../middleware/authorization')
const UserRouter=express.Router()

UserRouter.post('/',login)
UserRouter.post('/signup',signup)
UserRouter.post('/forgot',forgot)
UserRouter.post('/address',userAuth,address)
UserRouter.get('/:id',userAuth,getUser)
UserRouter.get('/',getNumber)
UserRouter.get("/user/all",Userdetails)
 

module.exports =UserRouter 