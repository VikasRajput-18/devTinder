const express = require("express");
const { authUser } = require("../middleware/auth");
const { User } = require("../models/user");
const { validateEditProfileData } = require("../utils/validation")


const profileRouter = express.Router()

profileRouter.get("/profile", authUser, async (req, res) => {
    try {
        const user = req.user
        res.status(200).send(user);
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

        return res.status(200).json({ message: `${existingUser.firstName}, your profile updated successfully!` })

    } catch (error) {
        return res.status(500).json({ message: error.message || "Something went wrong" })
    }


})

module.exports = profileRouter
