const cloudinaryInstance = require('../config/cloudinary.js');
const Item = require('../Models/category.js');
const dotenv = require('dotenv'); // Make sure this is at the top of your entry file (e.g., index.js)
const Dress = require('../Models/dress.js');
dotenv.config()

const itemPost = async (req, res) => {
   console.log(req.file);
   console.log(req.body);  

   const { Type, Category } = req.body;

   try {
      // Check if the item already exists
      const exist = await Item.findOne({ Type: Type, Category: Category });
      if (exist) {
         console.log(exist);

         return res.status(400).json({ message: `${Type} already exists` });
      }
      const folderName = 'E-commerce'
      const file = await cloudinaryInstance.uploader.upload(req.file.path, {
         public_id: `${folderName}/${req.file.originalname.split('.'[0])}`,
      })
      console.log(file);

      const newItem = new Item({ 
         Type,
         Category,
         Pics: file.secure_url,  // Save the Cloudinary URL or other relevant file data
      });

      await newItem.save();

      res.status(201).json({ message: "Item successfully created", item: newItem });

   } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ error: "An error occurred", details: error.message });
   }
};

const newDress = async (req, res) => {
   console.log('addNew');
   console.log(req.body);
   console.log(req.files);
   const { Type, Category, Name, Fabric, Price, Quantity, Size } = req.body
   const url = []
   try {
      const exist = await Dress.findOne({ Name: req.body.Name })
      if (exist) {
         return res.status(400).json('this Dress is already exist')
      }
      const folderName = 'E-commerce';

      for (const file of req.files) {
         const image = await cloudinaryInstance.uploader.upload(file.path, {
            public_id: `${folderName}/${file.originalname.split('.')[0]}`, // Correct extraction of filename
         });
         console.log(image.secure_url); 

         url.push(image.secure_url); // Add the uploaded image URL to the array
      }

      // Save the Dress along with the URLs of uploaded images
      const newDress = new Dress({
         Type, Category, Name, Fabric, Price, Quantity, Size, 
         Pics: url, // Assuming you have an 'images' field in your schema
      });
      await newDress.save()
      return res.status(200).json('succesfuy added')
   } catch (error) {
      console.log(error);
 
      return res.status(500).json('internal server error' ) 
   }
}

module.exports = { itemPost, newDress };
