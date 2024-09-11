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
// const corsOption = {
//     origin: "http://localhost:5173"
//     // ,
//     // allowedHeaders: ['Content-Type', 'Authorization'],

// } 
// app.use(cors(corsOption))

const corsOptions = {
    origin: 'http://localhost:5173', // Frontend origin
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true, // If you need to send cookies or other credentials
};
 
app.use(cors(corsOptions));

app.options('*', cors(corsOptions)); // Handle preflight requests for all routes

app.use(bodyParser.urlencoded({ extended: false }));

// Parse application/json
app.use(bodyParser.json());

app.use('/', UserRouter)
app.use('/admin', adminRouter)
app.use('/product',productRouter)
app.use('/booking',bookRouter)

app.listen(process.env.port, () => {
    console.log(`server is running at ${process.env.port}`);
}) 

