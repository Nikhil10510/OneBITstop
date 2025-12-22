import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const connectDB = async() =>{
    try {
        await mongoose.connect(process.env.MONGODB_URL)
        .then(() => {
            console.log("MongoDB Connected Successfully");
        })
        .catch((err) => {
            console.log(err);
        });
        // console.log(`MongoDB Connected Successfully: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
}


export default connectDB;