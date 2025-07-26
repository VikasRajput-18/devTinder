const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

const connectToDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URL);
        console.log(`MongoDB Connected Successfully ✅`)
    } catch (error) {
        console.log("Error While Connecting to Databse", error.message)
        process.exit(1);
    }
}


module.exports = { connectToDB }