const express = require('express');
const UserRouter = require('./Routes/userRouter');
const bodyParser = require('body-parser');
const dotenv = require('dotenv')
const connectdb = require('./config/connectDB.js')
const cors = require('cors');
const adminRouter = require('./Routes/adminRouter.js');
const productRouter = require('./Routes/productRouter.js');
const { bookRouter } = require('./Routes/BookingRouter.js');
dotenv.config()
  
connectdb()
const app = express()


const corsOptions = {
    origin: ['http://localhost:5173', 'https://e-comme-umber.vercel.app/'], // Corrected to an array
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
};

app.use(cors(corsOptions));

app.options('*', cors(corsOptions));

app.use(bodyParser.urlencoded({ extended: false }));

// Parse application/json
app.use(bodyParser.json());

app.use('/user', UserRouter)
app.use('/admin', adminRouter)
app.use('/product',productRouter)
app.use('/booking',bookRouter)

app.listen(process.env.PORT, () => {
    console.log(`server is running at ${process.env.PORT}`);
}) 

