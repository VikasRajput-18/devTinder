const express = require("express");
const dotenv = require("dotenv");
const { connectToDB } = require("./config/database");
const { User } = require("./models/user");
const { validateSignUpData } = require("./utils/validation");
const bcrypt = require("bcrypt")
const cookieParser = require("cookie-parser")
const jwt = require("jsonwebtoken");
const { authUser } = require("./middleware/auth");


dotenv.config();


const PORT = process.env.PORT || 8000

const app = express();
app.use(express.json())
app.use(cookieParser())

app.post("/sign-up", async (req, res) => {
    try {
        validateSignUpData(req)
        const { email, password, firstName, lastName, } = req.body;
        const userExits = await User.findOne({ email }, { runValidators: true })
        if (userExits) {
            return res.status(400).json({ message: "Email already exists" })
        }
        const hashPassword = await bcrypt.hash(password, 10);
        const user = new User({ email, firstName, lastName, password: hashPassword });
        await user.save();
        res.status(200).json({ message: "User is successfully added" })
    } catch (error) {
        console.log("Signup Error: ", error.message);
        res.status(500).json({ message: error.message || "Something went wrong" })
    }
});

app.post("/sign-in", async (req, res) => {
    try {
        const { email, password } = req.body
        const userExits = await User.findOne({ email })
        if (!userExits) {
            return res.status(400).json({ message: "Invalid Credentials" })
        }
        const matchPassword = await bcrypt.compare(password, userExits.password);

        if (!matchPassword) {
            return res.status(400).json({ message: "Invalid Credentials" })
        }
        const token = jwt.sign({ userId: userExits._id }, process.env.JWT_SECRET_TOKEN, {
            expiresIn: "7d"
        })
        res.cookie("token", token, { expires: new Date(Date.now() + 8 * 3600000 ) })

        return res.status(200).json({ message: "Login Successfully" })
    }

    catch (error) {
        console.log("Signup Error: ", error.message);
        res.status(500).json({ message: error.message || "Something went wrong" })
    }
})


app.get("/profile", authUser, async (req, res) => {
    try {
        const user = req.user
        res.status(200).send(user);
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})


app.post("/send-connection", authUser, async (req, res) => {
    const user = req.user;
    res.send(user.firstName + " Sent the connection request")
})


connectToDB()

app.listen(PORT, () => {
    console.log(`Server is listening on PORT: http://localhost:${PORT}`)
})

