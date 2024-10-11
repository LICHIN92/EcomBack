const express=require('express')
const { review, getReview } = require('../Controllers/reviewController')
const { userAuth } = require('../middleware/authorization')

const reviewRouter=express.Router()

reviewRouter.post("/:id",userAuth, review)
reviewRouter.get('/:id',getReview)


module.exports=reviewRouter
 