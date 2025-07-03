
// import express from 'express';
// import cors from 'cors';
// import 'dotenv/config'; // Load .env automatically
// import connectDB from './config/mongodb.js';
// import connectCloudinary from './config/cloudinary.js';
// import userRouter from './routes/userRoutes.js';
// import productRouter from './routes/productRoutes.js';
// import cartRouter from './routes/cartRoutes.js';
// import orderRouter from './routes/orderRoutes.js';

// // Add config
// const app = express();
// const port = process.env.PORT || 4000;

// // Connect to DBs
// connectDB();
// connectCloudinary();

// // Middlewares
// app.use(express.json());
// app.use(cors());

// // Routes
// app.use('/api/user', userRouter);
// app.use('/api/product', productRouter);
// app.use('/api/cart', cartRouter);
// app.use('/api/order', orderRouter);

// app.get('/', (req, res) => {
//   res.send('API WORKING');
// });

// app.listen(port, () => console.log('🚀 Server is running on port : ' + port));

import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import connectDB from './config/mongodb.js'
import connectCloudinary from './config/cloudinary.js'
import userRouter from './routes/userRoutes.js'
import productRouter from './routes/productRoutes.js'
import cartRouter from './routes/cartRoutes.js'
import orderRouter from './routes/orderRoutes.js'
import contactRouter from './routes/contactRoutes.js'

// App Config
const app = express()
const port = process.env.PORT || 4000
connectDB()
connectCloudinary()

// middlewares
app.use(express.json())
app.use(cors())

// api endpoints
app.use('/api/user', userRouter)
app.use('/api/product', productRouter)
app.use('/api/cart', cartRouter)
app.use('/api/order', orderRouter)
app.use('/api/contact', contactRouter)

app.get('/', (req, res) => {
    res.send("API Working")
})

app.listen(port, () => console.log('Server started on PORT : ' + port))