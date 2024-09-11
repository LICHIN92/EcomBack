const express=require('express')
const { itemPost, newDress } = require('../Controllers/adminController')
const upload = require('../middleware/upload')
const { adminAuth } = require('../middleware/authorization')
const adminRouter=express.Router()

adminRouter.post('/',adminAuth,
    upload.single('pic'),
    itemPost)

adminRouter.post('/addNewDress',upload.any(),
    newDress)

module.exports=adminRouter 

