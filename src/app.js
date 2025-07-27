const express = require("express");
const dotenv = require("dotenv");
const { connectToDB } = require("./config/database");
const { User } = require("./models/user");


dotenv.config();


const PORT = process.env.PORT || 8000

const app = express();
app.use(express.json())

app.post("/sign-up", async (req, res) => {
    const { firstName, lastName, email, password, age, gender } = req.body;

    const userExits = await User.findOne({ email })

    if (userExits) {
        return res.status(400).json({ message: "Email already exists" })
    }



    try {
        const userObj = {
            firstName,
            lastName,
            email,
            password,
            age,
            gender
        }

        // creating a new instance of User model 
        const user = new User(userObj);

        await user.save();
        res.status(200).json({ message: "User is successfully added" })
    } catch (error) {
        res.status(500).json({ message: error || "Something went wrong" })
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

