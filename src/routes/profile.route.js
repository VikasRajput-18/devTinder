const express = require("express");
const bcrypt = require("bcrypt");
const { authUser } = require("../middleware/auth");
const { User } = require("../models/user");
const { validateEditProfileData } = require("../utils/validation")


const profileRouter = express.Router()

profileRouter.get("/profile", authUser, async (req, res) => {
    try {
        const user = req.user
        const profile = await User.findById(user._id).select("-password")
        res.status(200).send({ user: profile });
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

profileRouter.patch("/profile/edit", authUser, async (req, res) => {
    try {
        if (!validateEditProfileData(req)) {
            return res.status(400).json({ message: "Invalid edit request" })
        }
        const existingUser = req.user;

        // option 1 way of updating user
        // const updateUser = await User.findByIdAndUpdate(existingUser._id, { ...req.body }, {
        //     runValidators: true,
        //     new: true
        // })
        // if (!updateUser) {
        //     return res.status(404).json({ message: "User not found" })
        // }

        // option 2 wway of updating user

        Object.keys(req.body).forEach((key) => existingUser[key] = req.body[key]);

        await existingUser.save()
        const { password, ...user } = existingUser._doc


        return res.status(200).json({ message: `${existingUser.firstName}, your profile updated successfully!`, user: user })

    } catch (error) {
        return res.status(500).json({ message: error.message || "Something went wrong" })
    }


})


profileRouter.patch("/profile/reset-password", authUser, async (req, res) => {
    try {
        const existingUser = req.user;
        const { oldPassword, newPassword } = req.body;

        if (!oldPassword || !newPassword) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // const isMatchedPassword = await existingUser.validatePassword(oldPassword);


        const isMatchedPassword = await bcrypt.compare(oldPassword, existingUser.password);

        if (!isMatchedPassword) {
            return res.status(401).json({ message: "Old Password is not correct" })
        }

        let newHashedPassword = await bcrypt.hash(newPassword, 10);

        existingUser.password = newHashedPassword

        await existingUser.save()

        return res.status(201).json({ message: "Password Updated" })


    } catch (error) {
        return res.status(500).json({ message: error.message || "Something went wrong" })
    }
})

module.exports = profileRouter
