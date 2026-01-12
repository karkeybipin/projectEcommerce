// import mongoose from "mongoose"

// const connectDB = async() => {

//     mongoose.connection.on('connected', ()=>{
//         console.log("Database is connected")
//     })

//     await mongoose.connect(`${process.env.MONGODB_URI}/yungflame`)

// }

// export default connectDB


// import mongoose from "mongoose"

// const connectDB = async() => {
//     mongoose.connection.on('connected', ()=>{
//         console.log("Database is connected")
//     })

//     await mongoose.connect(process.env.MONGODB_URI)
// }

// export default connectDB

// import mongoose from "mongoose"

// const connectDB = async () => {
//     mongoose.connection.on('connected', () => {
//         console.log("Database is connected")
//     })

//     await mongoose.connect(process.env.MONGODB_URI)
// }

// export default connectDB


// import dotenv from "dotenv";
// dotenv.config();

// import mongoose from "mongoose";
// import dotenv from "dotenv";
// dotenv.config();

// const connectDB = async () => {
//     try {
//         await mongoose.connect(process.env.MONGODB_URI, {
//             useNewUrlParser: true,
//             useUnifiedTopology: true
//         });
//         console.log("✅ MongoDB connected");
//     } catch (err) {
//         console.error("❌ MongoDB connection error:", err);
//         process.exit(1);
//     }
// };

// export default connectDB;

import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("✅ MongoDB connected");
    } catch (err) {
        console.error("❌ MongoDB connection error:", err.message);
        process.exit(1);
    }
};

export default connectDB;

