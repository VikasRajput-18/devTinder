const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

const connectToDB = async () => {
    // if (process.env.NODE_ENV === 'test') return; // ⛔ Skip in test
    try {
        await mongoose.connect(process.env.MONGODB_URL);
        console.log(`MongoDB Connected Successfully ✅`)
    } catch (error) {
        console.log("Error While Connecting to Database", error.message)
        process.exit(1);
    }
}


module.exports = { connectToDB }