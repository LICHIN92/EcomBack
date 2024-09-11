const express=require('express')
const { items, viewType, detail, deleting } = require('../Controllers/productController')
const productRouter=express.Router()

productRouter.get('/',items)
productRouter.get('/viewType/:type',viewType)
productRouter.get('/:id',detail)
productRouter.delete("/:id",deleting)

module.exports=productRouter
 