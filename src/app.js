const express = require("express");
const dotenv = require("dotenv");
const { connectToDB } = require("./config/database");
const cookieParser = require("cookie-parser")
const authRouter = require("./routes/auth.route");
const requestRouter = require("./routes/request.route");
const profileRouter = require("./routes/profile.route");
const userRouter = require("./routes/user.route");


dotenv.config();



const app = express();
app.use(express.json())
app.use(cookieParser())


app.use("/api/", authRouter)
app.use("/api/", profileRouter)
app.use("/api/", requestRouter)
app.use("/api/", userRouter)






connectToDB()



module.exports = app 