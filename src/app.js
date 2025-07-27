const express = require("express");
const dotenv = require("dotenv");
const { connectToDB } = require("./config/database");
const { User } = require("./models/user");
const { validateSignUpData } = require("./utils/validation");
const bcrypt = require("bcrypt")


dotenv.config();


const PORT = process.env.PORT || 8000

const app = express();
app.use(express.json())

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


app.get("/feed", async (req, res) => {
    try {

        const user = await User.find({});
        res.status(200).json({ data: user })
    } catch (error) {
        res.status(500).json({ message: "Something went wrong" })
    }
})

app.delete("/user/:id", async (req, res) => {
    try {
        const { id } = req.params;
        console.log(id)
        await User.findByIdAndDelete(id);
        return res.status(200).json({ message: "User Deleted Successfully" })


    } catch (error) {
        res.status(500).json({ message: "Something went wrong" })
    }

})


app.patch("/user/:id", async (req, res) => {
    try {
        const { id } = req.params
        const user = await User.findByIdAndUpdate(id, req.body, {
            returnDocument: "after"
        })

        console.log("user", user)
        return res.status(200).json({ message: "User Updated Successfully" })
    } catch (error) {
        res.status(500).json({ message: "Something went wrong" })

    }
})


connectToDB()

app.listen(PORT, () => {
    console.log(`Server is listening on PORT: http://localhost:${PORT}`)
})

