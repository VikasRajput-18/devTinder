const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors")

const { connectToDB } = require("./config/database");
const cookieParser = require("cookie-parser")
const authRouter = require("./routes/auth.route");
const requestRouter = require("./routes/request.route");
const profileRouter = require("./routes/profile.route");
const userRouter = require("./routes/user.route");



dotenv.config();



const app = express();

app.use(cors({ origin: "http://localhost:5173", credentials: true }))
app.use(express.json())
app.use(cookieParser())


app.use("/", authRouter)
app.use("/", profileRouter)
app.use("/", requestRouter)
app.use("/", userRouter)






connectToDB()



module.exports = app 