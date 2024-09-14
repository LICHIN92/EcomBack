const mongoose=require('mongoose')
const schema=mongoose.Schema({
    FirstName:{
        type:String,
        required:true
    },
    LastName:{
        type:String,
        required:true
    },
    Mobile:{
        type:String,
        required:true,
        unique:true
    },
    Email:{
        type:String,
        required:true,
        unique:true
    },
    Password:{
        type:String,
        required:true
    },
    user:{
        type:Boolean,
        default:false       // false=user    // true=admin
    },
    AddressLine1:{
        type:String,
    },
    AddressLine2:{
        type:String,
    },
    AddressLine3:{
        type:String,
    },
    PIN:{
        type:Number,
         
    }
},
{
    timestamps: true

})
const USER=mongoose.model('user',schema)
module.exports=USER