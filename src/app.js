const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors")






dotenv.config();

require("./utils/cron")

const { connectToDB } = require("./config/database");
const cookieParser = require("cookie-parser")
const authRouter = require("./routes/auth.route");
const requestRouter = require("./routes/request.route");
const profileRouter = require("./routes/profile.route");
const userRouter = require("./routes/user.route");
const { chatRouter } = require("./routes/chat.route");







const app = express();

app.use(cors({ origin: "http://localhost:5173", credentials: true }))
app.use(express.json())
app.use(cookieParser())


app.use("/", authRouter)
app.use("/", profileRouter)
app.use("/", requestRouter)
app.use("/", userRouter)
app.use("/", chatRouter)






connectToDB()



module.exports = app 