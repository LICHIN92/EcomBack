const express=require('express')
const { review, getReview,average } = require('../Controllers/reviewController')
const { userAuth } = require('../middleware/authorization')

const reviewRouter=express.Router()

reviewRouter.post("/:id",userAuth, review)
reviewRouter.get('/:id',getReview)
reviewRouter.get("/avgg/:id",average)


module.exports=reviewRouter
 