import express from 'express';
import connectDB from './db/index.js';
import dotenv from 'dotenv';

dotenv.config({
    path: "./env"
})

const app = express();

connectDB();

























// const connectDB = async() => {
//     try{
//         await mongoose.connect(`${process.env.MONGODB_URL}/${DB_NAME}`);
//         app.on("error", (error) => {
//             console.log("Error connecting to database", error);
//             throw error
//         })

//         app.listen(process.env.PORT, () => {
//             console.log(`App is listing on port number ${process.env.PORT}`)
//         })

//     }
//     catch(error){
//         console.log(error);
//         throw error;
//     }
// }