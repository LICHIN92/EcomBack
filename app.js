// const express = require('express');
// const UserRouter = require('./Routes/userRouter');
// const bodyParser = require('body-parser');
// const dotenv = require('dotenv')
// const connectdb = require('./config/connectDB.js')
// const cors = require('cors');
// const adminRouter = require('./Routes/adminRouter.js');
// const productRouter = require('./Routes/productRouter.js');
// const { bookRouter } = require('./Routes/BookingRouter.js');
// dotenv.config()
  
// connectdb()
// const app = express()


// const corsOptions = {
//     origin: ['http://localhost:5173', 'https://e-comme-umber.vercel.app/'], // Corrected to an array
//     methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
//     allowedHeaders: ['Content-Type', 'Authorization'],
//     credentials: true,
// };

// app.use(cors(corsOptions));

// app.options('*', cors(corsOptions));

// app.use(bodyParser.urlencoded({ extended: false }));

// // Parse application/json
// app.use(bodyParser.json());

// app.use('/user', UserRouter)
// app.use('/admin', adminRouter)
// app.use('/product',productRouter)
// app.use('/booking',bookRouter)

// app.listen(process.env.port, () => {
//     console.log(`server is running at ${process.env.port}`);
// }) 

const express = require('express');
const UserRouter = require('./Routes/userRouter');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const connectdb = require('./config/connectDB.js');
const cors = require('cors');
const adminRouter = require('./Routes/adminRouter.js');
const productRouter = require('./Routes/productRouter.js');
const { bookRouter } = require('./Routes/BookingRouter.js');
dotenv.config();
  
connectdb();
const app = express();

const corsOptions = {
    origin: ['http://localhost:5173', 'https://e-comme-pygm-2ltgofm6x-lichin-chandrans-projects.vercel.app/'], // Corrected origins
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
};

// Enable CORS with options
app.use(cors(corsOptions));

// Handle preflight requests for all routes
app.options('*', cors(corsOptions));

// Parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// Parse application/json
app.use(bodyParser.json());

// Set up routers
app.use('/user', UserRouter);
app.use('/admin', adminRouter);
app.use('/product', productRouter);
app.use('/booking', bookRouter);

// Use proper environment variable name for port
const PORT = process.env.PORT || 3200; // Fallback to 5000 if undefined

app.listen(PORT, () => {
    console.log(`Server is running at ${PORT}`);
});
