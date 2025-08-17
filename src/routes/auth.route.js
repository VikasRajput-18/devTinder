
const express = require("express");
const bcrypt = require("bcrypt");


const { validateSignUpData } = require("../utils/validation");
const { User } = require("../models/user");
const { authUser } = require("../middleware/auth");

const authRouter = express.Router();


authRouter.post("/sign-up", async (req, res) => {
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
        const token = await user.getJWT();
        res.cookie("token", token, { expires: new Date(Date.now() + 8 * 3600000) })
        res.status(201).json({ message: "User is successfully created" })
    } catch (error) {
        console.log("Signup Error: ", error.message);
        res.status(500).json({ message: error.message || "Something went wrong" })
    }
});

authRouter.post("/sign-in", async (req, res) => {
    try {
        const { email, password } = req.body
        const userExits = await User.findOne({ email })
        if (!userExits) {
            return res.status(400).json({ message: "Invalid Credentials" })
        }
        const matchPassword = await userExits.validatePassword(password);

        if (!matchPassword) {
            return res.status(400).json({ message: "Invalid Credentials" })
        }
        const token = await userExits.getJWT();
        res.cookie("token", token, { expires: new Date(Date.now() + 8 * 3600000) })


        return res.status(200).json({
            message: "Login Successfully", data: {
                _id: userExits._id,
                firstName: userExits.firstName,
                lastName: userExits.lastName,
                photoUrl: userExits.photoUrl,
            }
        })
    }

    catch (error) {
        console.log("Signup Error: ", error.message);
        res.status(500).json({ message: error.message || "Something went wrong" })
    }
})


authRouter.post("/logout", authUser, async (req, res) => {
    try {
        const user = req.user;

        if (!user || !user._id) {
            return res.status(400).json({ message: "User not authenticated" });
        }

        const userExists = await User.findById(user._id);
        if (!userExists) {
            return res.status(404).json({ message: "User not found" });
        }
        res.clearCookie("token");

        return res.status(200).json({ message: "Successfully Logged out" });
    } catch (error) {
        res.status(500).json({ message: error.message || "Something went wrong" })
    }
})


module.exports = authRouter