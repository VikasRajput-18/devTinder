const express = require("express")

const PORT = process.env.PORT || 8000

const app = express();

let count = 0
app.use("/test", (req, res, next) => {
    console.log(`Request: ${req.method} ${req.url}`);
    res.send("Test")
});


app.get("/", (req, res) => {
    const hi = req.next()
    console.log("--hi", hi)
    count++
    res.json({ count })
})
 
app.listen(PORT, () => {
    console.log(`Server is listening on PORT: http://localhost:${PORT}`)
})