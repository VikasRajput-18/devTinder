const express = require("express");
const dotenv = require("dotenv");
const { connectToDB } = require("./config/database");


dotenv.config();


const PORT = process.env.PORT || 8000

const app = express();


connectToDB()

app.listen(PORT, () => {
    console.log(`Server is listening on PORT: http://localhost:${PORT}`)
})

