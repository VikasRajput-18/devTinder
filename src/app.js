const express = require("express");
const { connectToDB } = require("./config/database");

const PORT = process.env.PORT || 8000

const app = express();


connectToDB()

app.listen(PORT, () => {
    console.log(`Server is listening on PORT: http://localhost:${PORT}`)
})

