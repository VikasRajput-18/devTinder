const express = require("express");
const { authUser } = require("../middleware/auth");


const profileRouter = express.Router()

profileRouter.get("/profile", authUser, async (req, res) => {
    try {
        const user = req.user
        res.status(200).send(user);
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

module.exports = profileRouter
