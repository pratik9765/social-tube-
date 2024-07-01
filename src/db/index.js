import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";
import dotenv from 'dotenv';

dotenv.config();


const connectDB = async() => {
    try{
        const dbConnect = await mongoose.connect(`${process.env.MONGODB_URL}/${DB_NAME}`);
        console.log("databas connection successful");
        
    }
    catch(error){
        console.log(error);
        console.log("Problem in database connection");
        process.exit(1);
    }
}

export default connectDB;