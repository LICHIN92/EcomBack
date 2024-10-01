const mongoose=require('mongoose')

const Connectdb=async ()=>{
   try {
    await mongoose.connect(process.env.connect_url)
    console.log(`Connected to ${process.env.connect_url}`);
   } catch (error) {
    console.log(error);
   }
} 
module.exports=Connectdb